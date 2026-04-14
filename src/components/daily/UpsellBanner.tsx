import Link from "next/link";

export default function UpsellBanner() {
  return (
    <div
      className="pixel-frame-accent mt-6 p-4 flex items-center gap-3"
      style={{ backgroundColor: "rgba(154,112,64,0.04)" }}
    >
      <span style={{ fontSize: "1.5rem" }} aria-hidden="true">
        ⚔️
      </span>
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.6875rem",
            color: "#9a7040",
            marginBottom: "0.125rem",
          }}
        >
          더 깊이 알고 싶다면?
        </p>
        <p style={{ fontSize: "0.75rem", color: "#5a4e3c" }}>
          3체계 교차분석으로 인생 전체를 감정합니다
        </p>
      </div>
      <Link href="/reading/new">
        <button
          className="pixel-btn pixel-btn-primary px-3 py-2 text-xs flex-shrink-0"
          style={{ fontFamily: "var(--font-pixel)", whiteSpace: "nowrap" }}
        >
          990원
        </button>
      </Link>
    </div>
  );
}
