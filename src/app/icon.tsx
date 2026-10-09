import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** DuetBooth tab icon: warm booth frame + two portrait ovals. */
export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            borderRadius: 7,
            border: "2px solid #ff6a2b",
            background: "#1d1815",
          }}
        >
          <div
            style={{
              width: 8,
              height: 11,
              borderRadius: 999,
              background: "#f6efe6",
            }}
          />
          <div
            style={{
              width: 8,
              height: 11,
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
