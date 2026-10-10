"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EffectDefinition } from "@/lib/effects";
import { detectHumanFaceInBlobUrls } from "@/lib/detect-face";
import { renderHotelLobbyStoryboard } from "@/lib/storyboard";

type Props = {
  effect: EffectDefinition;
};

type JobStatus = "queued" | "running" | "succeeded" | "failed";

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function VideoGenerator({ effect }: Props) {
  const [templateId, setTemplateId] = useState(effect.templates[0]?.id || "");
  const [files, setFiles] = useState<(File | null)[]>(
    Array.from({ length: effect.subjects }, () => null),
  );
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array.from({ length: effect.subjects }, () => null),
  );
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [storyboardUrl, setStoryboardUrl] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [providerNote, setProviderNote] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [needCredits, setNeedCredits] = useState(false);
  const pollCancel = useRef(false);

  const storyboardPreview = effect.preview?.mode === "storyboard";
  const template = useMemo(
    () => effect.templates.find((t) => t.id === templateId) || effect.templates[0],
    [effect.templates, templateId],
  );

  async function refreshCredits() {
    try {
      const res = await fetch("/api/wallet", { cache: "no-store" });
      const data = await res.json();
      if (typeof data.credits === "number") setCredits(data.credits);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    refreshCredits();
    return () => {
      pollCancel.current = true;
    };
  }, []);

  function onPick(index: number, fileList: FileList | null) {
    const file = fileList?.[0] || null;
    setFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    setPreviews((prev) => {
      const next = [...prev];
      if (prev[index]?.startsWith("blob:")) URL.revokeObjectURL(prev[index]!);
      next[index] = file ? URL.createObjectURL(file) : null;
      return next;
    });
    setStoryboardUrl(null);
  }

  async function onPreviewFraming() {
    setError(null);
    const left = previews[0];
    const right = previews[1];
    if (!left || !right) {
      setError("Upload both photos to preview framing.");
      return;
    }
    setPreviewing(true);
    try {
      const url = await renderHotelLobbyStoryboard(left, right);
      setStoryboardUrl(url);
      setVideoUrl(null);
      setProviderNote("Framing preview ready — no credit used.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preview failed");
    } finally {
      setPreviewing(false);
    }
  }

  async function pollUntilDone(jobId: string) {
    // ~5 min at 3s interval
    for (let i = 0; i < 100; i++) {
      if (pollCancel.current) return;
      await sleep(i === 0 ? 1200 : 3000);

      const res = await fetch(`/api/jobs/${jobId}`, { cache: "no-store" });
      const data = await res.json();
      if (typeof data.credits === "number") setCredits(data.credits);

      if (!res.ok) {
        throw new Error(data.message || data.error || "Job poll failed");
      }

      const status = data.status as JobStatus;
      setJobStatus(status);

      if (status === "succeeded") {
        setVideoUrl(data.videoUrl || null);
        setStoryboardUrl(null);
        setProviderNote(
          data.message?.startsWith("Demo mode")
            ? data.message
            : "Your video is ready. Download it below.",
        );
        return;
      }

      if (status === "failed") {
        throw new Error(data.message || "Generation failed");
      }

      setProviderNote(
        status === "queued" ? "Waiting in queue…" : "Rendering your video…",
      );
    }
    throw new Error("Timed out waiting for video. Your credit was kept if the job later succeeds — contact support with your job id.");
  }

  async function onGenerate() {
    setError(null);
    setVideoUrl(null);
    setProviderNote(null);
    setNeedCredits(false);
    setJobStatus(null);
    pollCancel.current = false;

    if (files.some((f) => !f)) {
      setError(`Please upload ${effect.subjects} photo(s).`);
      return;
    }

    setLoading(true);
    try {
      const imageUrls = await Promise.all(
        files.filter(Boolean).map((f) => fileToDataUrl(f as File)),
      );
      const hasHumanFace = await detectHumanFaceInBlobUrls(previews);

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          effectSlug: effect.slug,
          templateId: template?.id,
          imageUrls,
          hasHumanFace,
        }),
      });

      const data = await res.json();
      if (typeof data.credits === "number") setCredits(data.credits);

      if (!res.ok) {
        if (data.code === "NO_CREDITS" || res.status === 402) {
          setNeedCredits(true);
        }
        throw new Error(data.message || data.error || "Could not start job");
      }

      const jobId = data.id as string;
      if (!jobId) throw new Error("No job id returned");

      setJobStatus((data.status as JobStatus) || "queued");
      const routeHint =
        typeof data.routedProvider === "string"
          ? ` via ${data.routedProvider}`
          : "";
      setProviderNote(`Job submitted${routeHint}. Rendering…`);
      await pollUntilDone(jobId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setJobStatus("failed");
    } finally {
      setLoading(false);
      refreshCredits();
    }
  }

  const statusLabel =
    jobStatus === "queued"
      ? "Queued…"
      : jobStatus === "running"
        ? "Rendering…"
        : loading
          ? "Starting…"
          : null;

  const unlockLabel =
    statusLabel ||
    `Unlock ${effect.durationSec}s video — 1 credit ($4.90)`;

  return (
    <section
      className="generator"
      style={{ ["--effect-accent" as string]: effect.accent }}
    >
      <div className="generator-grid">
        <div className="panel upload-panel">
          <p className="eyebrow">Create</p>
          <h2>Upload photos</h2>
          <p className="muted">
            {effect.subjects === 2
              ? "Upload one clear photo per person. Left and right stay in place."
              : "Upload one clear portrait. Even lighting works best."}
          </p>
          <p className="credits-inline">
            Balance:{" "}
            <strong>
              {credits === null
                ? "…"
                : `${credits} credit${credits === 1 ? "" : "s"}`}
            </strong>
            {" · "}
            <a href="#pricing">Buy credits</a>
            {" · "}
            Sign in with Google to keep credits across devices
          </p>

          <div className="upload-row">
            {Array.from({ length: effect.subjects }).map((_, index) => (
              <label key={index} className="upload-card">
                {previews[index] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previews[index] || ""} alt={`Subject ${index + 1}`} />
                ) : (
                  <span>
                    {effect.subjects === 2
                      ? index === 0
                        ? "Left subject"
                        : "Right subject"
                      : "Portrait"}
                    <small>JPG / PNG / WebP · max 5MB</small>
                  </span>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => onPick(index, e.target.files)}
                />
              </label>
            ))}
          </div>

          <div className="template-list">
            {effect.templates.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === templateId ? "template active" : "template"}
                onClick={() => setTemplateId(item.id)}
              >
                <strong>{item.name}</strong>
                <span>{item.blurb}</span>
              </button>
            ))}
          </div>

          {storyboardPreview ? (
            <div className="action-row">
              <button
                type="button"
                className="ghost-btn"
                disabled={previewing || loading}
                onClick={onPreviewFraming}
              >
                {previewing
                  ? "Building preview…"
                  : effect.preview?.label || "Preview framing free"}
              </button>
              <button
                type="button"
                className="primary-btn"
                disabled={loading || previewing}
                onClick={onGenerate}
              >
                {unlockLabel}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="primary-btn"
              disabled={loading}
              onClick={onGenerate}
            >
              {statusLabel ||
                `Generate ${effect.durationSec}s ${effect.aspectRatio} video (1 credit)`}
            </button>
          )}

          {storyboardPreview && effect.preview?.note ? (
            <p className="note preview-note">{effect.preview.note}</p>
          ) : null}

          {error ? <p className="error">{error}</p> : null}
          {needCredits ? (
            <p className="note">
              <a href="#pricing">Buy a pack below</a> to unlock generation.
            </p>
          ) : null}
          {providerNote ? <p className="note">{providerNote}</p> : null}
        </div>

        <div className="panel preview-panel">
          <p className="eyebrow">
            {storyboardUrl && !videoUrl ? "Framing preview" : "Preview"}
          </p>
          <h2>
            {storyboardUrl && !videoUrl
              ? "Booth layout (free)"
              : template?.name || "Output"}
          </h2>
          <div
            className={
              effect.aspectRatio === "9:16" ? "stage vertical" : "stage wide"
            }
          >
            {videoUrl ? (
              <video src={videoUrl} controls playsInline autoPlay loop />
            ) : storyboardUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="stage-storyboard"
                src={storyboardUrl}
                alt="Free hotel lobby framing preview"
              />
            ) : (
              <div className="stage-empty">
                <p>
                  {loading
                    ? statusLabel || "Working…"
                    : previewing
                      ? "Building free framing preview…"
                      : storyboardPreview
                        ? "Your framing preview will appear here."
                        : "Your video will appear here."}
                </p>
                <p className="muted">
                  {loading
                    ? "This page polls job status every few seconds."
                    : storyboardPreview
                      ? "Upload two photos, then press Preview framing free — no credit used."
                      : "Upload photos and press generate to start."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
