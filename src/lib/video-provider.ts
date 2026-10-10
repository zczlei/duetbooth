export type GenerateInput = {
  effectSlug: string;
  templateId: string;
  promptHint?: string;
  /** Data URLs or remote URLs for subject photos */
  imageUrls: string[];
  aspectRatio: "16:9" | "9:16";
  durationSec: number;
  /**
   * Client face hint for VIDEO_PROVIDER=auto.
   * true → prefer kie; false → prefer ark; omit/unknown → kie (safer for DuetBooth).
   */
  hasHumanFace?: boolean | null;
};

export type ProviderSubmitResult = {
  provider: string;
  providerJobId: string;
  falStatusUrl?: string;
  falResponseUrl?: string;
  demoReadyAt?: number;
};

export type ProviderPollResult = {
  status: "queued" | "running" | "succeeded" | "failed";
  videoUrl?: string;
  message?: string;
};

function env(name: string) {
  return process.env[name]?.trim() || "";
}

export function activeProvider() {
  return (env("VIDEO_PROVIDER") || "demo").toLowerCase();
}

function hasArkKey() {
  return Boolean(env("ARK_API_KEY"));
}

function hasKieKey() {
  return Boolean(env("KIE_API_KEY"));
}

/** Ark China Seedance rejects direct real-face reference uploads. */
function isArkFaceReject(message: string) {
  return /人脸|真人|face|InputImageSensitive|SensitiveContent|real.?person|portrait/i.test(
    message,
  );
}

/**
 * Pick upstream for VIDEO_PROVIDER=auto:
 * - human face → kie (Ark blocks real-face refs)
 * - no face → ark when keyed, else kie
 * - unknown → kie
 */
export function resolveAutoProvider(
  hasHumanFace?: boolean | null,
): "kie" | "ark" | "demo" {
  if (hasHumanFace === false && hasArkKey()) return "ark";
  if (hasKieKey()) return "kie";
  if (hasArkKey()) return "ark";
  return "demo";
}

/** Demo clip used when no provider key is configured */
const DEMO_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

function parseKieResultUrls(resultJson: unknown): string | undefined {
  if (!resultJson) return undefined;
  try {
    const parsed =
      typeof resultJson === "string" ? JSON.parse(resultJson) : resultJson;
    const urls = (parsed as { resultUrls?: string[] }).resultUrls;
    return Array.isArray(urls) ? urls[0] : undefined;
  } catch {
    return undefined;
  }
}

async function submitFal(input: GenerateInput): Promise<ProviderSubmitResult> {
  const key = env("FAL_KEY");
  if (!key) throw new Error("FAL_KEY missing");

  const model =
    env("FAL_VIDEO_MODEL") || "bytedance/seedance-2.5/image-to-video";
  const imageUrl = input.imageUrls[0];
  if (!imageUrl) throw new Error("FAL needs at least one image_url");

  const duration = Math.min(30, Math.max(4, input.durationSec || 4));

  const submit = await fetch(`https://queue.fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: input.promptHint || `${input.effectSlug} trend video`,
      image_url: imageUrl,
      resolution: env("FAL_RESOLUTION") || "480p",
      duration: String(duration),
      generate_audio: false,
    }),
  });

  if (!submit.ok) {
    const text = await submit.text();
    throw new Error(`FAL submit ${submit.status}: ${text.slice(0, 400)}`);
  }

  const queued = (await submit.json()) as {
    request_id?: string;
    status_url?: string;
    response_url?: string;
  };

  if (!queued.request_id || !queued.status_url || !queued.response_url) {
    throw new Error("FAL queue response missing request_id/urls");
  }

  return {
    provider: "fal",
    providerJobId: queued.request_id,
    falStatusUrl: queued.status_url,
    falResponseUrl: queued.response_url,
  };
}

async function pollFal(handle: {
  falStatusUrl?: string;
  falResponseUrl?: string;
}): Promise<ProviderPollResult> {
  const key = env("FAL_KEY");
  if (!key) throw new Error("FAL_KEY missing");
  if (!handle.falStatusUrl || !handle.falResponseUrl) {
    throw new Error("Missing FAL poll URLs");
  }

  const statusRes = await fetch(handle.falStatusUrl, {
    headers: { Authorization: `Key ${key}` },
  });
  const statusJson = (await statusRes.json()) as { status?: string };
  const status = statusJson.status;

  if (status === "COMPLETED") {
    const resultRes = await fetch(handle.falResponseUrl, {
      headers: { Authorization: `Key ${key}` },
    });
    const result = (await resultRes.json()) as { video?: { url?: string } };
    if (!result.video?.url) {
      return {
        status: "failed",
        message: "FAL completed but no video URL",
      };
    }
    return { status: "succeeded", videoUrl: result.video.url };
  }

  if (status === "FAILED" || status === "CANCELLED") {
    return { status: "failed", message: `FAL job ${status}` };
  }

  return { status: status === "IN_QUEUE" ? "queued" : "running" };
}

/**
 * KIE createTask rejects large data: URLs with a generic 500.
 * Upload base64 to their file API first and pass the returned HTTPS URL.
 */
async function resolveKieImageUrl(
  imageUrl: string,
  apiKey: string,
): Promise<string> {
  if (!imageUrl.startsWith("data:")) return imageUrl;

  const mimeMatch = /^data:([^;,]+)/.exec(imageUrl);
  const mime = mimeMatch?.[1] || "image/jpeg";
  const ext =
    mime === "image/png"
      ? "png"
      : mime === "image/webp"
        ? "webp"
        : mime === "image/gif"
          ? "gif"
          : "jpg";
  const fileName = `db-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadBase =
    env("KIE_FILE_UPLOAD_BASE") || "https://kieai.redpandaai.co";

  const upload = await fetch(`${uploadBase}/api/file-base64-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base64Data: imageUrl,
      uploadPath: "duetbooth",
      fileName,
    }),
  });

  const uploadJson = (await upload.json()) as {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: { downloadUrl?: string };
  };

  const downloadUrl = uploadJson.data?.downloadUrl;
  if (!upload.ok || !downloadUrl) {
    throw new Error(
      `KIE image upload failed: ${uploadJson.msg || upload.status}`,
    );
  }
  return downloadUrl;
}

async function submitKie(input: GenerateInput): Promise<ProviderSubmitResult> {
  const key = env("KIE_API_KEY");
  const base = env("KIE_API_BASE") || "https://api.kie.ai";
  if (!key) throw new Error("KIE_API_KEY missing");

  const model = env("KIE_VIDEO_MODEL") || "bytedance/seedance-2-mini";
  if (!input.imageUrls[0]) throw new Error("KIE needs at least one first_frame_url");

  const firstFrameUrl = await resolveKieImageUrl(input.imageUrls[0], key);
  const lastFrameUrl = input.imageUrls[1]
    ? await resolveKieImageUrl(input.imageUrls[1], key)
    : undefined;

  const duration = Math.min(15, Math.max(4, input.durationSec || 4));

  const create = await fetch(`${base}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: {
        prompt: input.promptHint || `${input.effectSlug} trend video`,
        first_frame_url: firstFrameUrl,
        ...(lastFrameUrl ? { last_frame_url: lastFrameUrl } : {}),
        aspect_ratio: input.aspectRatio,
        resolution: env("KIE_RESOLUTION") || "480p",
        duration,
        generate_audio: false,
      },
    }),
  });

  const createJson = (await create.json()) as {
    code?: number;
    msg?: string;
    data?: { taskId?: string };
  };

  if (!create.ok || createJson.code !== 200 || !createJson.data?.taskId) {
    throw new Error(
      `KIE createTask failed: ${createJson.msg || create.status} ${JSON.stringify(createJson).slice(0, 300)}`,
    );
  }

  return {
    provider: "kie",
    providerJobId: createJson.data.taskId,
  };
}

async function pollKie(providerJobId: string): Promise<ProviderPollResult> {
  const key = env("KIE_API_KEY");
  const base = env("KIE_API_BASE") || "https://api.kie.ai";
  if (!key) throw new Error("KIE_API_KEY missing");

  const infoRes = await fetch(
    `${base}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(providerJobId)}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    },
  );
  const info = (await infoRes.json()) as {
    code?: number;
    data?: {
      state?: string;
      resultJson?: string;
      failMsg?: string | null;
    };
  };

  const state = info.data?.state;
  if (state === "success") {
    const videoUrl = parseKieResultUrls(info.data?.resultJson);
    if (!videoUrl) {
      return { status: "failed", message: "KIE success but no resultUrls" };
    }
    return { status: "succeeded", videoUrl };
  }

  if (state === "fail" || state === "failed") {
    return {
      status: "failed",
      message: info.data?.failMsg || "KIE generation failed",
    };
  }

  if (state === "waiting" || state === "queuing" || state === "queue") {
    return { status: "queued" };
  }

  return { status: "running" };
}

/**
 * Volcengine Ark (豆包 Seedance) — POST create task, GET poll by id.
 * Docs shape matches call_db.sh / contents/generations/tasks.
 */
async function submitArk(input: GenerateInput): Promise<ProviderSubmitResult> {
  const key = env("ARK_API_KEY");
  const base =
    env("ARK_API_BASE") || "https://ark.cn-beijing.volces.com";
  if (!key) throw new Error("ARK_API_KEY missing");
  if (!input.imageUrls[0]) {
    throw new Error("Ark needs at least one reference image");
  }

  const model = env("ARK_VIDEO_MODEL") || "doubao-seedance-2-0-260128";
  const duration = Math.min(15, Math.max(4, input.durationSec || 5));
  const generateAudio = env("ARK_GENERATE_AUDIO") === "true";

  type ArkContentItem =
    | { type: "text"; text: string }
    | {
        type: "image_url";
        image_url: { url: string };
        role: "reference_image";
      };

  const content: ArkContentItem[] = [
    {
      type: "text",
      text: input.promptHint || `${input.effectSlug} trend video`,
    },
    ...input.imageUrls.filter(Boolean).map(
      (url): ArkContentItem => ({
        type: "image_url",
        image_url: { url },
        role: "reference_image",
      }),
    ),
  ];

  const create = await fetch(
    `${base.replace(/\/$/, "")}/api/v3/contents/generations/tasks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        content,
        generate_audio: generateAudio,
        ratio: input.aspectRatio,
        duration,
        watermark: env("ARK_WATERMARK") === "true",
      }),
    },
  );

  const createJson = (await create.json()) as {
    id?: string;
    error?: { code?: string; message?: string };
  };

  if (!create.ok || !createJson.id) {
    throw new Error(
      `Ark createTask failed: ${createJson.error?.message || create.status} ${JSON.stringify(createJson).slice(0, 300)}`,
    );
  }

  return {
    provider: "ark",
    providerJobId: createJson.id,
  };
}

async function pollArk(providerJobId: string): Promise<ProviderPollResult> {
  const key = env("ARK_API_KEY");
  const base =
    env("ARK_API_BASE") || "https://ark.cn-beijing.volces.com";
  if (!key) throw new Error("ARK_API_KEY missing");

  const infoRes = await fetch(
    `${base.replace(/\/$/, "")}/api/v3/contents/generations/tasks/${encodeURIComponent(providerJobId)}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    },
  );
  const info = (await infoRes.json()) as {
    status?: string;
    content?: { video_url?: string };
    error?: { message?: string; code?: string };
  };

  if (!infoRes.ok) {
    return {
      status: "failed",
      message:
        info.error?.message ||
        `Ark poll HTTP ${infoRes.status}`,
    };
  }

  const st = (info.status || "").toLowerCase();
  if (st === "succeeded") {
    const videoUrl = info.content?.video_url;
    if (!videoUrl) {
      return { status: "failed", message: "Ark succeeded but no video_url" };
    }
    return { status: "succeeded", videoUrl };
  }

  if (st === "failed" || st === "cancelled" || st === "expired") {
    return {
      status: "failed",
      message: info.error?.message || `Ark job ${st}`,
    };
  }

  if (st === "queued" || st === "pending") {
    return { status: "queued" };
  }

  return { status: "running" };
}

function submitDemo(input: GenerateInput): ProviderSubmitResult {
  return {
    provider: "demo",
    providerJobId: `demo_${input.effectSlug}_${Date.now()}`,
    demoReadyAt: Date.now() + 2000,
  };
}

function pollDemo(demoReadyAt?: number): ProviderPollResult {
  if (!demoReadyAt || Date.now() < demoReadyAt) {
    return { status: "running" };
  }
  return {
    status: "succeeded",
    videoUrl: DEMO_VIDEO,
    message:
      "Demo mode: set VIDEO_PROVIDER=fal|kie|ark and API keys to render real clips.",
  };
}

async function submitByName(
  provider: string,
  input: GenerateInput,
): Promise<ProviderSubmitResult> {
  if (provider === "fal") return submitFal(input);
  if (provider === "kie") return submitKie(input);
  if (provider === "ark") return submitArk(input);
  return submitDemo(input);
}

/** Submit only — do not wait for the finished video. */
export async function submitVideoJob(
  input: GenerateInput,
): Promise<ProviderSubmitResult> {
  const configured = activeProvider();

  if (configured === "auto") {
    const chosen = resolveAutoProvider(input.hasHumanFace);
    try {
      return await submitByName(chosen, input);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      // Face mis-detect or policy reject: fall back to kie once.
      if (chosen === "ark" && hasKieKey() && isArkFaceReject(message)) {
        return submitKie(input);
      }
      throw e;
    }
  }

  return submitByName(configured, input);
}

/** Single poll tick against the upstream provider. */
export async function pollVideoJob(handle: {
  provider: string;
  providerJobId: string;
  falStatusUrl?: string;
  falResponseUrl?: string;
  demoReadyAt?: number;
}): Promise<ProviderPollResult> {
  if (handle.provider === "fal") return pollFal(handle);
  if (handle.provider === "kie") return pollKie(handle.providerJobId);
  if (handle.provider === "ark") return pollArk(handle.providerJobId);
  return pollDemo(handle.demoReadyAt);
}
