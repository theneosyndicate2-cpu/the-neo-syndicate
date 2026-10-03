import { ImageResponse } from "next/og";

export const alt = "The Neo Syndicate — Capital. Strategy. Execution.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "radial-gradient(ellipse at 80% 0%, #2a2212 0%, #0a0a0c 55%, #050506 100%)",
          color: "#efede6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "2px solid #c9a961",
              transform: "rotate(45deg)",
            }}
          />
          <div style={{ fontSize: 20, letterSpacing: 10, color: "#c9a961" }}>PRIVATE TRADING &amp; CAPITAL</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: 18, color: "#c9a961" }}>THE</div>
          <div style={{ fontSize: 120, fontWeight: 300, letterSpacing: -3, lineHeight: 1 }}>Neo Syndicate</div>
          <div style={{ marginTop: 30, fontSize: 26, letterSpacing: 12, color: "#b9b7b0" }}>
            CAPITAL. STRATEGY. EXECUTION.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#85847f", letterSpacing: 6 }}>
          <span>XAUUSD · BTCUSD · MARKET INTELLIGENCE</span>
          <span style={{ color: "#e8d5a3" }}>WE KEEP BUILDING.</span>
        </div>
      </div>
    ),
    size,
  );
}
