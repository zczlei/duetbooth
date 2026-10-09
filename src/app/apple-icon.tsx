import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen / Apple touch icon for DuetBooth. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14110f",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            borderRadius: 32,
            border: "8px solid #ff6a2b",
            background: "#1d1815",
          }}
        >
          <div
            style={{
              width: 40,
              height: 56,
              borderRadius: 999,
              background: "#f6efe6",
            }}
          />
          <div
            style={{
              width: 40,
              height: 56,
              borderRadius: 999,
              background: "#f6efe6",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
