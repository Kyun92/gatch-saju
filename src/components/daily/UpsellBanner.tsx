import Link from "next/link";

export default function UpsellBanner() {
  return (
    <Link href="/reading/new" className="no-underline block">
      <div className="pixel-frame-accent mt-6 p-4 flex items-center gap-3 bg-[rgba(154,112,64,0.04)] cursor-pointer">
        <div className="flex-1 min-w-0">
          <p className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] mb-0.5">
            다음 캡슐도 뽑아볼까?
          </p>
          <p className="text-xs text-[#5a4e3c]">
            이 캐릭터의 종합 감정도 보러가기
          </p>
        </div>
        <span className="font-[family-name:var(--font-pixel)] text-xs text-[#9a7040] shrink-0">
          {"->"}
        </span>
      </div>
    </Link>
  );
}
