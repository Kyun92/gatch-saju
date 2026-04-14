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
    <Link href={href} className="block no-underline" style={{ textDecoration: "none" }}>
      <div
        className={`relative flex items-center gap-3 p-3 pl-5 transition-opacity hover:opacity-90 ${
          popular ? "pixel-frame-accent" : "pixel-frame"
        }`}
        style={{
          cursor: "pointer",
          backgroundColor: popular ? "rgba(154,112,64,0.04)" : undefined,
        }}
      >
        {colorBar && (
          <span className={`service-card-bar service-card-bar-${colorBar}`} />
        )}
        {popular && (
          <span className="service-card-popular-badge">★ 인기</span>
        )}

        {/* 좌측: 아이콘 */}
        <span
          className="flex-shrink-0"
          style={{ fontSize: "1.75rem", lineHeight: 1 }}
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
              className="inline-block px-3 py-1"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.625rem",
                color: "#ffffff",
                backgroundColor: "#2e8b4e",
                border: "2px solid #1e7a3e",
                whiteSpace: "nowrap",
              }}
            >
              무료
            </span>
          ) : (
            <span
              className="inline-block px-3 py-1"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.625rem",
                color: "#ffffff",
                backgroundColor: "#9a7040",
                border: "2px solid #7a5830",
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
