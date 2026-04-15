import Link from "next/link";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  price: string | null;
  href: string;
  popular?: boolean;
  colorBar?: "daily" | "reading" | "compat";
}

export default function ServiceCard({
  icon,
  title,
  description,
  price,
  href,
  popular = false,
  colorBar,
}: ServiceCardProps) {
  return (
    <Link href={href} className="block no-underline">
      <div
        className={`relative flex items-center gap-3 p-3 pl-5 transition-opacity hover:opacity-90 cursor-pointer ${
          popular ? "pixel-frame-accent bg-[rgba(154,112,64,0.04)]" : "pixel-frame"
        }`}
      >
        {colorBar && (
          <span className={`service-card-bar service-card-bar-${colorBar}`} />
        )}
        {popular && (
          <span className="service-card-popular-badge">★ 인기</span>
        )}

        {/* 좌측: 아이콘 */}
        <span
          className="flex-shrink-0 text-[1.75rem] leading-none"
          aria-hidden="true"
        >
          {icon}
        </span>

        {/* 중앙: 타이틀 + 설명 */}
        <div className="flex-1 min-w-0">
          <p
            className="leading-tight mb-0.5 font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#b8883c]"
          >
            {title}
          </p>
          <p
            className="leading-snug truncate text-xs text-[#4a3e2c]"
          >
            {description}
          </p>
        </div>

        {/* 우측: 가격 뱃지 */}
        <div className="flex-shrink-0">
          {price === null ? (
            <span
              className="inline-block px-3 py-1 font-[family-name:var(--font-pixel)] text-[0.625rem] text-white bg-[#2e8b4e] border-2 border-[#1e7a3e] whitespace-nowrap"
            >
              무료
            </span>
          ) : (
            <span
              className="inline-block px-3 py-1 font-[family-name:var(--font-pixel)] text-[0.625rem] text-white bg-[#9a7040] border-2 border-[#7a5830] whitespace-nowrap"
            >
              {price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
