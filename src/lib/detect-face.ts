/**
 * Best-effort human-face detection in the browser (Chrome Shape Detection API).
 * Returns: true = face found, false = none, null = detector unavailable.
 */
export async function detectHumanFaceInBlobUrls(
  blobUrls: (string | null | undefined)[],
): Promise<boolean | null> {
  const FaceDetectorCtor = (
    globalThis as unknown as {
      FaceDetector?: new (opts?: {
        fastMode?: boolean;
        maxDetectedFaces?: number;
      }) => { detect: (image: ImageBitmap) => Promise<unknown[]> };
    }
  ).FaceDetector;

  if (!FaceDetectorCtor) return null;

  const detector = new FaceDetectorCtor({
    fastMode: true,
    maxDetectedFaces: 4,
  });

  for (const url of blobUrls) {
    if (!url) continue;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      try {
        const faces = await detector.detect(bitmap);
        if (faces.length > 0) return true;
      } finally {
        bitmap.close();
      }
    } catch {
      // Ignore per-image failures; try the rest.
    }
  }

  return false;
}
