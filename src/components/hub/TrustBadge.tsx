type SystemKey = "saju" | "ziwei" | "western";

const SYSTEMS: { key: SystemKey; label: string; sublabel: string }[] = [
  { key: "saju",    label: "四柱", sublabel: "사주팔자" },
  { key: "ziwei",   label: "紫微", sublabel: "자미두수" },
  { key: "western", label: "★",   sublabel: "점성술" },
];

export default function TrustBadge() {
  return (
    <div className="flex flex-col items-center py-8 gap-3">
      {/* 3개 시스템 아이콘 */}
      <div className="flex items-center gap-5">
        {SYSTEMS.map((sys) => (
          <div key={sys.key} className="flex flex-col items-center gap-1">
            <span
              className="system-color font-[family-name:var(--font-pixel)] text-base leading-none"
              data-system={sys.key}
              aria-label={sys.sublabel}
            >
              {sys.label}
            </span>
            <span
              className="system-color font-[family-name:var(--font-body)] text-[0.5625rem] opacity-80"
              data-system={sys.key}
            >
              {sys.sublabel}
            </span>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-[120px] h-px bg-[#d4c4a0]" aria-hidden="true" />

      {/* 설명 텍스트 */}
      <p className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] tracking-[0.04em] text-center">
        정통 운명학 3체계 교차분석
      </p>
    </div>
  );
}
