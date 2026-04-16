import type { StatScores } from "@/lib/ai/stat-scorer";

interface StatGridProps {
  statScores: StatScores;
}

const STATS: {
  icon: string;
  label: string;
  key: keyof Omit<StatScores, "title">;
  color: string;
}[] = [
  { icon: "", label: "생명력", key: "vitality_score", color: "#d04040" },
  { icon: "", label: "재물운", key: "wealth_score", color: "#3070c0" },
  { icon: "", label: "연애운", key: "love_score", color: "#d06890" },
  { icon: "", label: "직업운", key: "career_score", color: "#6858b8" },
  { icon: "", label: "건강", key: "health_score", color: "#2e8b4e" },
  { icon: "", label: "행운", key: "luck_score", color: "#c8a020" },
];

export default function StatGrid({ statScores }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STATS.map((stat) => {
        const value = statScores[stat.key];
        const isGlow = value >= 80;
        const percent = Math.max(0, Math.min(value, 100));

        return (
          <div
            key={stat.key}
            className={`stat-mini-card ${isGlow ? "stat-mini-card-glow" : ""}`}
          >
            {/* Icon + big number */}
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span style={{ fontSize: "1rem" }}>{stat.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "1.5rem",
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
            </div>

            {/* Label */}
            <div
              className="mb-2"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.7rem",
                color: "#8a8070",
              }}
            >
              {stat.label}
            </div>

            {/* Compact stat bar */}
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill"
                style={{
                  width: `${percent}%`,
                  backgroundColor: stat.color,
                }}
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={stat.label}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
