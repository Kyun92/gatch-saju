"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/daily", label: "일일", icon: "📜" },
  { href: "/reading", label: "종합", icon: "⚔️" },
  { href: "/compatibility", label: "궁합", icon: "💕" },
  { href: "/mypage", label: "MY", icon: "👤" },
];

export default function PixelNavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pixel-frame"
      style={{
        borderTop: "2px solid #b8944c",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 no-underline"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.625rem",
                color: isActive ? "#c8a020" : "#8a8070",
                textDecoration: "none",
              }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
