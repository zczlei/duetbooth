/** Client-side hotel-lobby booth framing (zero server cost). */

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load preview image"));
    img.src = src;
  });
}

/** Cover-fit draw into a rect (object-fit: cover). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function drawMic(ctx: CanvasRenderingContext2D, cx: number, top: number) {
  const cableLen = top + 72;
  ctx.strokeStyle = "rgba(20, 12, 8, 0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, cableLen);
  ctx.stroke();

  // Mic body
  const micW = 22;
  const micH = 48;
  const micY = cableLen;
  const grad = ctx.createLinearGradient(cx - micW, micY, cx + micW, micY + micH);
  grad.addColorStop(0, "#3a322c");
  grad.addColorStop(0.45, "#8a7a6c");
  grad.addColorStop(1, "#2a221c");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(cx - micW / 2, micY, micW, micH, 8);
  ctx.fill();

  // Grill lines
  ctx.strokeStyle = "rgba(246, 239, 230, 0.35)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    const y = micY + 10 + i * 6;
    ctx.beginPath();
    ctx.moveTo(cx - micW / 2 + 4, y);
    ctx.lineTo(cx + micW / 2 - 4, y);
    ctx.stroke();
  }

  // Capsule ring
  ctx.strokeStyle = "rgba(255, 180, 80, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, micY + micH + 4, 10, 5, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Paint a 16:9 orange booth storyboard with left/right portraits + hanging mic.
 * Returns a PNG data URL suitable for <img>.
 */
export async function renderHotelLobbyStoryboard(
  leftSrc: string,
  rightSrc: string,
): Promise<string> {
  const W = 1280;
  const H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  const [left, right] = await Promise.all([
    loadImage(leftSrc),
    loadImage(rightSrc),
  ]);

  // Booth wash
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#ff7a2e");
  bg.addColorStop(0.35, "#ff5a1a");
  bg.addColorStop(0.7, "#e04812");
  bg.addColorStop(1, "#b83408");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Soft vignette / wall panels
  const vignette = ctx.createRadialGradient(
    W / 2,
    H * 0.45,
    H * 0.15,
    W / 2,
    H * 0.5,
    H * 0.85,
  );
  vignette.addColorStop(0, "rgba(255, 200, 120, 0.18)");
  vignette.addColorStop(1, "rgba(40, 12, 0, 0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Vertical booth seams
  ctx.strokeStyle = "rgba(80, 28, 8, 0.28)";
  ctx.lineWidth = 4;
  for (const x of [W * 0.28, W * 0.5, W * 0.72]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  const padX = 72;
  const padTop = 96;
  const padBottom = 88;
  const gap = 56;
  const slotW = (W - padX * 2 - gap) / 2;
  const slotH = H - padTop - padBottom;
  const leftX = padX;
  const rightX = padX + slotW + gap;
  const slotY = padTop;

  // Portrait frames
  for (const x of [leftX, rightX]) {
    ctx.fillStyle = "rgba(20, 10, 6, 0.22)";
    ctx.beginPath();
    ctx.roundRect(x - 6, slotY - 6, slotW + 12, slotH + 12, 18);
    ctx.fill();
  }

  drawCover(ctx, left, leftX, slotY, slotW, slotH);
  drawCover(ctx, right, rightX, slotY, slotW, slotH);

  // Soft edge blend on portraits
  for (const x of [leftX, rightX]) {
    const edge = ctx.createLinearGradient(x, slotY, x + slotW, slotY);
    edge.addColorStop(0, "rgba(255, 90, 26, 0.35)");
    edge.addColorStop(0.12, "rgba(255, 90, 26, 0)");
    edge.addColorStop(0.88, "rgba(255, 90, 26, 0)");
    edge.addColorStop(1, "rgba(255, 90, 26, 0.35)");
    ctx.fillStyle = edge;
    ctx.fillRect(x, slotY, slotW, slotH);
  }

  drawMic(ctx, W / 2, 0);

  // Side labels
  ctx.font = "600 22px Manrope, system-ui, sans-serif";
  ctx.fillStyle = "rgba(246, 239, 230, 0.92)";
  ctx.textAlign = "center";
  ctx.fillText("LEFT", leftX + slotW / 2, H - 36);
  ctx.fillText("RIGHT", rightX + slotW / 2, H - 36);

  ctx.font = "500 16px Manrope, system-ui, sans-serif";
  ctx.fillStyle = "rgba(246, 239, 230, 0.7)";
  ctx.fillText("Free framing preview · not the final video", W / 2, 36);

  return canvas.toDataURL("image/png");
}
