import Link from "next/link";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  price: string | null;
  href: string;
  popular?: boolean;
}

export default function ServiceCard({
  icon,
  title,
  description,
  price,
  href,
  popular = false,
}: ServiceCardProps) {
  return (
    <Link href={href} className="block no-underline" style={{ textDecoration: "none" }}>
      <div
        className={`relative flex items-center gap-3 p-3 transition-opacity hover:opacity-90 ${
          popular ? "pixel-frame-accent" : "pixel-frame"
        }`}
        style={{ cursor: "pointer" }}
      >
        {popular && (
          <span className="service-card-popular-badge">★ 인기</span>
        )}

        {/* 좌측: 아이콘 */}
        <span
          className="flex-shrink-0"
          style={{ fontSize: "1.5rem", lineHeight: 1 }}
          aria-hidden="true"
        >
          {icon}
        </span>

        {/* 중앙: 타이틀 + 설명 */}
        <div className="flex-1 min-w-0">
          <p
            className="leading-tight mb-0.5"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.8125rem",
              color: "#b8883c",
            }}
          >
            {title}
          </p>
          <p
            className="text-sm leading-snug truncate"
            style={{ color: "#4a3e2c", fontSize: "0.75rem" }}
          >
            {description}
          </p>
        </div>

        {/* 우측: 가격 뱃지 */}
        <div className="flex-shrink-0">
          {price === null ? (
            <span
              className="inline-block px-2 py-0.5"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.5625rem",
                color: "#2e8b4e",
                border: "1px solid #2e8b4e",
                backgroundColor: "rgba(46,139,78,0.08)",
                whiteSpace: "nowrap",
              }}
            >
              무료
            </span>
          ) : (
            <span
              className="inline-block px-2 py-0.5"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.5625rem",
                color: "#9a7040",
                border: "1px solid #b8944c",
                backgroundColor: "rgba(154,112,64,0.08)",
                whiteSpace: "nowrap",
              }}
            >
              {price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
