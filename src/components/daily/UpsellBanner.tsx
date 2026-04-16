import Link from "next/link";

export default function UpsellBanner() {
  return (
    <div className="pixel-frame-accent mt-6 p-4 flex items-center gap-3 bg-[rgba(154,112,64,0.04)]">
      <span className="text-2xl" aria-hidden="true">
        
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] mb-0.5">
          더 깊이 알고 싶다면?
        </p>
        <p className="text-xs text-[#5a4e3c]">
          3체계 교차분석으로 인생 전체를 감정합니다
        </p>
      </div>
      <Link href="/reading/new">
        <button className="pixel-btn pixel-btn-primary px-3 py-2 text-xs shrink-0 font-[family-name:var(--font-pixel)] whitespace-nowrap">
          990원
        </button>
      </Link>
    </div>
  );
}
