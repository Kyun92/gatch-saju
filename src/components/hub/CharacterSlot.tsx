import Image from "next/image";
import Link from "next/link";

type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

interface StatScores {
  health_score: number;
  wealth_score: number;
  love_score: number;
  career_score: number;
  vitality_score: number;
  luck_score: number;
  title?: string;
}

interface CharacterSlotProps {
  character: {
    id: string;
    name: string;
    unlocked: boolean;
    gender: string;
    mbti: string | null;
  };
  element: ElementType;
  level: number;
  dayMaster: string;
  statScores?: StatScores | null;
  characterTitle?: string | null;
}

const ELEMENT_BG: Record<ElementType, string> = {
  wood: "#2e8b4e",
  fire: "#d04040",
  earth: "#a87838",
  metal: "#6878a0",
  water: "#3070c0",
};

const ELEMENT_BG_LIGHT: Record<ElementType, string> = {
  wood: "rgba(46,139,78,0.15)",
  fire: "rgba(208,64,64,0.15)",
  earth: "rgba(168,120,56,0.15)",
  metal: "rgba(104,120,160,0.15)",
  water: "rgba(48,112,192,0.15)",
};

const ELEMENT_LABEL: Record<ElementType, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

const STAT_CONFIG = [
  { key: "health_score" as const, label: "체력", icon: "HP", color: "#d04040" },
  { key: "wealth_score" as const, label: "재물", icon: "GP", color: "#c8a020" },
  { key: "love_score" as const, label: "연애", icon: "LV", color: "#d06890" },
  { key: "career_score" as const, label: "직업", icon: "CR", color: "#6858b8" },
  { key: "vitality_score" as const, label: "활력", icon: "VT", color: "#2e8b4e" },
  { key: "luck_score" as const, label: "행운", icon: "LK", color: "#3070c0" },
] as const;

function StatMiniBar({
  label,
  icon,
  value,
  color,
  locked,
}: {
  label: string;
  icon: string;
  value: number;
  color: string;
  locked: boolean;
}) {
  return (
    <div className="stat-mini" aria-label={`${label}: ${locked ? "잠김" : value}`}>
      <span
        className="stat-mini-icon"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.5rem",
          color: locked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.8)",
          width: "18px",
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {icon}
      </span>
      <div
        className="stat-mini-bar"
        style={{
          height: "6px",
          flex: 1,
          backgroundColor: locked
            ? "rgba(0,0,0,0.15)"
            : "rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="stat-mini-fill"
          style={{
            height: "100%",
            width: locked ? "0%" : `${value}%`,
            backgroundColor: locked ? "transparent" : color,
            transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.5rem",
          color: locked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)",
          width: "20px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {locked ? "??" : value}
      </span>
    </div>
  );
}

export default function CharacterSlot({
  character,
  element,
  level,
  dayMaster,
  statScores,
  characterTitle,
}: CharacterSlotProps) {
  const isUnlocked = character.unlocked;
  const bgColor = isUnlocked ? ELEMENT_BG[element] : "#d4cfc8";
  const avatarUrl = `/characters/${element}-${character.gender}.png`;

  // Title: from prop -> from statScores -> from element
  const displayTitle =
    characterTitle ?? statScores?.title ?? `${ELEMENT_LABEL[element]}의 모험가`;

  return (
    <div
      className="character-slot"
      style={{
        backgroundColor: bgColor,
        padding: "20px",
        border: isUnlocked
          ? `2px solid rgba(255,255,255,0.2)`
          : "2px solid #b8a890",
        boxShadow: isUnlocked
          ? `4px 4px 0px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.1)`
          : "3px 3px 0px rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Element badge - top right */}
      {isUnlocked && (
        <span
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontFamily: "var(--font-pixel)",
            fontSize: "0.5625rem",
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.06em",
          }}
        >
          {ELEMENT_LABEL[element]}
        </span>
      )}

      {/* Top section: Avatar + Info */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "120px",
            height: "120px",
            flexShrink: 0,
            position: "relative",
            border: isUnlocked
              ? "3px solid rgba(255,255,255,0.3)"
              : "3px solid #b8a890",
            backgroundColor: isUnlocked
              ? "rgba(0,0,0,0.1)"
              : "rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <Image
            src={avatarUrl}
            alt={`${character.name} 캐릭터`}
            fill
            style={{
              objectFit: "cover",
              imageRendering: "pixelated",
              opacity: isUnlocked ? 1 : 0.3,
              filter: isUnlocked ? "none" : "grayscale(100%)",
            }}
            sizes="120px"
          />
        </div>

        {/* Info column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + Level */}
          <div style={{ marginBottom: "4px" }}>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.625rem",
                color: isUnlocked
                  ? "rgba(255,255,255,0.7)"
                  : "#8a8070",
              }}
            >
              Lv.{level}
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "1.125rem",
              color: isUnlocked ? "#ffffff" : "#5a4e3c",
              lineHeight: 1.2,
              marginBottom: "4px",
            }}
          >
            {character.name}
          </div>

          {/* Day master + Title */}
          {dayMaster && (
            <div
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.625rem",
                color: isUnlocked
                  ? "rgba(255,255,255,0.7)"
                  : "#8a8070",
                marginBottom: "2px",
              }}
            >
              {dayMaster} · {ELEMENT_LABEL[element]}
            </div>
          )}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              color: isUnlocked
                ? "rgba(255,255,255,0.85)"
                : "#8a8070",
              fontStyle: "italic",
              lineHeight: 1.4,
              marginBottom: "8px",
            }}
          >
            &ldquo;{displayTitle}&rdquo;
          </div>

          {/* MBTI badge */}
          {character.mbti && (
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-pixel)",
                fontSize: "0.5625rem",
                padding: "2px 8px",
                backgroundColor: isUnlocked
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.06)",
                color: isUnlocked ? "#ffffff" : "#6858b8",
                border: isUnlocked
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid #6858b8",
              }}
            >
              {character.mbti}
            </span>
          )}
        </div>
      </div>

      {/* Stat bars -- 2 columns, 3 rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 12px",
          marginTop: "14px",
        }}
      >
        {STAT_CONFIG.map((stat) => (
          <StatMiniBar
            key={stat.key}
            label={stat.label}
            icon={stat.icon}
            value={isUnlocked && statScores ? (statScores[stat.key] ?? 0) : 0}
            color={isUnlocked ? stat.color : "transparent"}
            locked={!isUnlocked}
          />
        ))}
      </div>

      {/* Bottom buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "14px",
        }}
      >
        {isUnlocked ? (
          <>
            <Link
              href={`/daily?characterId=${character.id}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                fontFamily: "var(--font-pixel)",
                fontSize: "0.6875rem",
                color: "#ffffff",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderBottomWidth: "4px",
                padding: "8px 4px",
                textDecoration: "none",
                transition: "background-color 100ms ease",
                cursor: "pointer",
              }}
            >
              {"📜 오늘의 운세"}
            </Link>
            <Link
              href={`/reading?characterId=${character.id}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                fontFamily: "var(--font-pixel)",
                fontSize: "0.6875rem",
                color: ELEMENT_BG[element],
                backgroundColor: "#ffffff",
                border: `2px solid rgba(255,255,255,0.8)`,
                borderBottomWidth: "4px",
                padding: "8px 4px",
                textDecoration: "none",
                transition: "background-color 100ms ease",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {"⚔️ 상세 분석"}
            </Link>
          </>
        ) : (
          <Link
            href={`/reading/new?characterId=${character.id}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontFamily: "var(--font-pixel)",
              fontSize: "0.75rem",
              color: "#ffffff",
              background:
                "linear-gradient(180deg, #d4b070 0%, #b8883c 50%, #9a7040 100%)",
              border: "2px solid #9a7040",
              borderBottomWidth: "4px",
              boxShadow: "0 2px 0 #6b4e28",
              padding: "10px 8px",
              textDecoration: "none",
              textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {"⚔️ 운명의 서를 열다 — 990원"}
          </Link>
        )}
      </div>
    </div>
  );
}
