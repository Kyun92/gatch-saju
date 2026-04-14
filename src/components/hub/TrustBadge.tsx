const SYSTEMS = [
  { label: "四柱", sublabel: "사주팔자", color: "#9a7040" },
  { label: "紫微", sublabel: "자미두수", color: "#6858b8" },
  { label: "★", sublabel: "점성술", color: "#3070c0" },
] as const;

export default function TrustBadge() {
  return (
    <div className="flex flex-col items-center py-8 gap-3">
      {/* 3개 시스템 아이콘 */}
      <div className="flex items-center gap-5">
        {SYSTEMS.map((sys) => (
          <div key={sys.label} className="flex flex-col items-center gap-1">
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "1rem",
                color: sys.color,
                lineHeight: 1,
              }}
              aria-label={sys.sublabel}
            >
              {sys.label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.5625rem",
                color: sys.color,
                opacity: 0.8,
              }}
            >
              {sys.sublabel}
            </span>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div
        style={{
          width: 120,
          height: 1,
          backgroundColor: "#d4c4a0",
        }}
        aria-hidden="true"
      />

      {/* 설명 텍스트 */}
      <p
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.625rem",
          color: "#8a8070",
          letterSpacing: "0.04em",
          textAlign: "center",
        }}
      >
        정통 운명학 기반 AI 교차분석
      </p>
    </div>
  );
}
