"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGE_TITLES: [string, string][] = [
  ["/characters/new", "새 캐릭터 추가"],
  ["/characters/", "심화 특성"],
  ["/daily", "일일 퀘스트"],
  ["/reading/preview", "종합 분석"],
  ["/reading", "종합 감정"],
  ["/compatibility", "궁합 분석"],
  ["/mypage", "마이페이지"],
  ["/coins/success", "충전 완료"],
  ["/coins/fail", "결제 실패"],
  ["/coins", "코인 충전"],
];

export default function SubPageHeader() {
  const pathname = usePathname();

  const title =
    PAGE_TITLES.find(([key]) => pathname.startsWith(key))?.[1] ?? "";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 bg-white border-b-2 border-[#b8944c] h-12">
      {/* 좌측: 홈 링크 */}
      <Link
        href="/"
        className="font-[family-name:var(--font-pixel)] text-xs text-[#9a7040] no-underline"
      >
        ← 홈
      </Link>

      {/* 중앙: 페이지 타이틀 */}
      <span className="font-[family-name:var(--font-pixel)] text-sm text-[#2c2418] absolute left-1/2 -translate-x-1/2">
        {title}
      </span>

      {/* 우측: 미니 아바타 예정 */}
      <div className="w-8" />
    </header>
  );
}
