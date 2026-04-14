"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/daily": "📜 일일 퀘스트",
  "/reading": "⚔️ 종합 감정",
  "/compatibility": "💕 궁합 분석",
  "/mypage": "👤 마이페이지",
};

export default function SubPageHeader() {
  const pathname = usePathname();

  const title =
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? "";

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #b8944c",
        height: "48px",
      }}
    >
      {/* 좌측: 홈 링크 */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.75rem",
          color: "#9a7040",
          textDecoration: "none",
        }}
      >
        ← 홈
      </Link>

      {/* 중앙: 페이지 타이틀 */}
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.875rem",
          color: "#2c2418",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {title}
      </span>

      {/* 우측: 미니 아바타 예정 */}
      <div style={{ width: "2rem" }} />
    </header>
  );
}
