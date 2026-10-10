import { NextResponse } from "next/server";
import { getEffect } from "@/lib/effects";
import { createJob, publicJobView } from "@/lib/jobs";
import { submitVideoJob } from "@/lib/video-provider";
import {
  consumeCredit,
  getOrCreateWalletId,
  getWalletBalance,
  refundCredit,
} from "@/lib/wallet";

type Body = {
  effectSlug?: string;
  templateId?: string;
  imageUrls?: string[];
  /** From client FaceDetector; used when VIDEO_PROVIDER=auto */
  hasHumanFace?: boolean | null;
};

/**
 * Create a generation job and return immediately.
 * Client should poll GET /api/jobs/[id].
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const effect = body.effectSlug ? getEffect(body.effectSlug) : undefined;
  if (!effect) {
    return NextResponse.json({ error: "Unknown effect slug" }, { status: 404 });
  }

  const template =
    effect.templates.find((t) => t.id === body.templateId) ||
    effect.templates[0];

  const imageUrls = (body.imageUrls || []).filter(Boolean);
  if (imageUrls.length < effect.subjects) {
    return NextResponse.json(
      {
        error: `This effect needs ${effect.subjects} photo(s). Got ${imageUrls.length}.`,
      },
      { status: 400 },
    );
  }

  const totalChars = imageUrls.reduce((n, u) => n + u.length, 0);
  if (totalChars > 8_000_000) {
    return NextResponse.json(
      { error: "Images too large. Compress or upload to a CDN first." },
      { status: 413 },
    );
  }

  const walletId = await getOrCreateWalletId();
  const spent = await consumeCredit(walletId);
  if (!spent.ok) {
    return NextResponse.json(
      {
        error: "No credits left",
        message: "Buy a video pack to generate. Credits never expire.",
        credits: spent.credits,
        code: "NO_CREDITS",
      },
      { status: 402 },
    );
  }

  try {
    const submitted = await submitVideoJob({
      effectSlug: effect.slug,
      templateId: template.id,
      promptHint: template.promptHint,
      imageUrls: imageUrls.slice(0, effect.subjects),
      aspectRatio: effect.aspectRatio,
      durationSec: effect.durationSec,
      hasHumanFace:
        typeof body.hasHumanFace === "boolean" ? body.hasHumanFace : null,
    });

    const job = await createJob({
      walletId,
      provider: submitted.provider,
      providerJobId: submitted.providerJobId,
      status: "queued",
      effectSlug: effect.slug,
      templateId: template.id,
      falStatusUrl: submitted.falStatusUrl,
      falResponseUrl: submitted.falResponseUrl,
      demoReadyAt: submitted.demoReadyAt,
      message: "Job queued. Poll for status.",
    });

    return NextResponse.json(
      {
        ...publicJobView(job),
        credits: spent.credits,
        routedProvider: submitted.provider,
      },
      { status: 202 },
    );
  } catch (e) {
    const credits = await refundCredit(walletId);
    return NextResponse.json(
      {
        error: "Submit failed",
        message:
          (e instanceof Error ? e.message : "Could not start generation") +
          ". Credit refunded.",
        credits,
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  const walletId = await getOrCreateWalletId();
  const credits = await getWalletBalance(walletId);
  return NextResponse.json({
    ok: true,
    hint: "POST to create a job, then GET /api/jobs/[id] to poll.",
    credits,
  });
}
