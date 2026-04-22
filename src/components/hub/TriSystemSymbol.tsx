type TriSystemSize = "full" | "medium" | "mini";

interface TriSystemSymbolProps {
  size?: TriSystemSize;
}

const sizeConfig = {
  full: { w: 220, h: 200, r: 70, center: 28, label: "0.75rem", sub: "0.5rem", core: "0.875rem" },
  medium: { w: 150, h: 136, r: 48, center: 20, label: "0.5625rem", sub: "0.4375rem", core: "0.625rem" },
  mini: { w: 100, h: 90, r: 32, center: 14, label: "0.4375rem", sub: "0", core: "0.5rem" },
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

  // 중심 원: 세 원의 무게중심 (3체계 교차점)
  const coreX = (leftX + rightX + cx) / 3;
  const coreY = (topY + topY + bottomY) / 3;

  return (
    <div
      className="relative mx-auto"
      style={{ width: w, height: h }}
      aria-label="사주, 자미두수, 서양점성술 3체계 교차분석"
    >
      {circles.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 flex flex-col items-center justify-center gap-0.5"
          style={{
            width: d,
            height: d,
            borderColor: c.border,
            backgroundColor: c.bg,
            left: c.x - r,
            top: c.y - r,
          }}
        >
          <span className="font-[family-name:var(--font-pixel)] leading-none" style={{ fontSize: cfg.label, color: c.border }}>
            {c.text}
          </span>
          {cfg.sub !== "0" && (
            <span className="font-[family-name:var(--font-body)] opacity-80" style={{ fontSize: cfg.sub, color: c.border }}>
              {c.sub}
            </span>
          )}
        </div>
      ))}

      {/* 중심 원 — 3체계 교차점 */}
      <div
        className="animate-px-glow absolute rounded-full bg-[#f5f0e8] border-2 border-[#9a7040] flex items-center justify-center z-[2] shadow-[0_0_8px_rgba(154,112,64,0.4)]"
        style={{
          width: cfg.center,
          height: cfg.center,
          left: coreX - cfg.center / 2,
          top: coreY - cfg.center / 2,
        }}
      >
        <span className="font-[family-name:var(--font-pixel)] text-[#9a7040]" style={{ fontSize: cfg.core }}>
          命
        </span>
      </div>
    </div>
  );
}
