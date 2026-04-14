type TriSystemSize = "full" | "medium" | "mini";

interface TriSystemSymbolProps {
  size?: TriSystemSize;
}

const sizeConfig = {
  full: { w: 220, h: 200, r: 70, center: 28, label: "0.75rem", sub: "0.5rem", ai: "0.625rem" },
  medium: { w: 150, h: 136, r: 48, center: 20, label: "0.5625rem", sub: "0.4375rem", ai: "0.4375rem" },
  mini: { w: 100, h: 90, r: 32, center: 14, label: "0.4375rem", sub: "0", ai: "0.375rem" },
} as const;

export default function TriSystemSymbol({ size = "full" }: TriSystemSymbolProps) {
  const cfg = sizeConfig[size];
  const { w, h, r } = cfg;
  const d = r * 2; // diameter

  // 3개 원의 중심 좌표 (삼각형 배치, 충분히 겹치도록)
  // 원 간 중심 거리 = r * 1.1 (직경의 55% → 45% 겹침)
  const gap = r * 1.1;
  const cx = w / 2; // 수평 중심
  const cy = h / 2; // 수직 중심

  // 정삼각형 꼭짓점: 위에 2개, 아래 1개
  const topY = cy - gap * 0.4;
  const bottomY = cy + gap * 0.5;
  const leftX = cx - gap * 0.55;
  const rightX = cx + gap * 0.55;

  const circles = [
    { x: leftX, y: topY, bg: "rgba(154,112,64,0.15)", border: "#9a7040", text: "四柱", sub: "사주" },
    { x: rightX, y: topY, bg: "rgba(104,88,184,0.15)", border: "#6858b8", text: "紫微", sub: "자미두수" },
    { x: cx, y: bottomY, bg: "rgba(48,112,192,0.15)", border: "#3070c0", text: "★", sub: "점성술" },
  ];

  // AI 원: 세 원 중심의 무게중심
  const aiX = (leftX + rightX + cx) / 3;
  const aiY = (topY + topY + bottomY) / 3;

  return (
    <div
      style={{ width: w, height: h, position: "relative", margin: "0 auto" }}
      aria-label="사주, 자미두수, 서양점성술 3체계 교차분석"
    >
      {circles.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: d,
            height: d,
            borderRadius: "50%",
            border: `2px solid ${c.border}`,
            backgroundColor: c.bg,
            left: c.x - r,
            top: c.y - r,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: cfg.label, color: c.border, lineHeight: 1 }}>
            {c.text}
          </span>
          {cfg.sub !== "0" && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: cfg.sub, color: c.border, opacity: 0.8 }}>
              {c.sub}
            </span>
          )}
        </div>
      ))}

      {/* AI 중심 원 */}
      <div
        className="animate-px-glow"
        style={{
          position: "absolute",
          width: cfg.center,
          height: cfg.center,
          borderRadius: "50%",
          left: aiX - cfg.center / 2,
          top: aiY - cfg.center / 2,
          backgroundColor: "#f5f0e8",
          border: "2px solid #9a7040",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          boxShadow: "0 0 8px rgba(154,112,64,0.4)",
        }}
      >
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: cfg.ai, color: "#9a7040" }}>
          AI
        </span>
      </div>
    </div>
  );
}
