import Link from "next/link";

export default function SamplePreview() {
  return (
    <div className="pixel-frame-accent p-5 mt-6">
      <p
        className="text-center mb-3"
        style={{ fontFamily: "var(--font-pixel)", fontSize: "0.75rem", color: "#9a7040" }}
      >
        종합 감정 미리보기
      </p>

      {/* Blurred sample stats */}
      <div className="blur-preview mb-4" aria-hidden="true">
        <div className="flex flex-col gap-2">
          {[
            { label: "종합운", value: 82, color: "#c8a020" },
            { label: "연애운", value: 65, color: "#d06890" },
            { label: "재물운", value: 74, color: "#2e8b4e" },
            { label: "건강운", value: 90, color: "#3070c0" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "0.625rem",
                  color: "#8a8070",
                  width: "3.5rem",
                }}
              >
                {stat.label}
              </span>
              <div className="stat-bar-track flex-1">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "0.625rem",
                  color: stat.color,
                  width: "1.5rem",
                  textAlign: "right",
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link href="/reading/new" className="block">
        <button
          className="pixel-btn pixel-btn-primary w-full py-3 text-sm"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          내 스탯 확인하기 — 990원
        </button>
      </Link>
    </div>
  );
}
