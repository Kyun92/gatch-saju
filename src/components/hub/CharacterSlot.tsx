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
        className="stat-mini-icon font-[family-name:var(--font-pixel)] text-[0.5rem] w-[18px] shrink-0 text-right"
        style={{
          color: locked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.8)",
        }}
      >
        {icon}
      </span>
      <div
        className="stat-mini-bar h-1.5 flex-1 relative overflow-hidden"
        style={{
          backgroundColor: locked
            ? "rgba(0,0,0,0.15)"
            : "rgba(255,255,255,0.2)",
        }}
      >
        <div
          className="stat-mini-fill h-full transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: locked ? "0%" : `${value}%`,
            backgroundColor: locked ? "transparent" : color,
          }}
        />
      </div>
      <span
        className="font-[family-name:var(--font-pixel)] text-[0.5rem] w-5 text-right shrink-0"
        style={{
          color: locked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)",
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
      className="character-slot p-5 relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        border: isUnlocked
          ? `2px solid rgba(255,255,255,0.2)`
          : "2px solid #b8a890",
        boxShadow: isUnlocked
          ? `4px 4px 0px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.1)`
          : "3px 3px 0px rgba(0,0,0,0.08)",
      }}
    >
      {/* Element badge - top right */}
      {isUnlocked && (
        <span
          className="absolute top-2 right-2 font-[family-name:var(--font-pixel)] text-[0.5625rem] tracking-[0.06em]"
          style={{
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {ELEMENT_LABEL[element]}
        </span>
      )}

      {/* Top section: Avatar + Info */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-[120px] h-[120px] shrink-0 relative overflow-hidden"
          style={{
            border: isUnlocked
              ? "3px solid rgba(255,255,255,0.3)"
              : "3px solid #b8a890",
            backgroundColor: isUnlocked
              ? "rgba(0,0,0,0.1)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <Image
            src={avatarUrl}
            alt={`${character.name} 캐릭터`}
            fill
            className="object-cover [image-rendering:pixelated]"
            style={{
              opacity: isUnlocked ? 1 : 0.3,
              filter: isUnlocked ? "none" : "grayscale(100%)",
            }}
            sizes="120px"
          />
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-0">
          {/* Name + Level */}
          <div className="mb-1">
            <span
              className="font-[family-name:var(--font-pixel)] text-[0.625rem]"
              style={{
                color: isUnlocked
                  ? "rgba(255,255,255,0.7)"
                  : "#8a8070",
              }}
            >
              Lv.{level}
            </span>
          </div>
          <div
            className="font-[family-name:var(--font-pixel)] text-[1.125rem] leading-[1.2] mb-1"
            style={{
              color: isUnlocked ? "#ffffff" : "#5a4e3c",
            }}
          >
            {character.name}
          </div>

          {/* Day master + Title */}
          {dayMaster && (
            <div
              className="font-[family-name:var(--font-pixel)] text-[0.625rem] mb-0.5"
              style={{
                color: isUnlocked
                  ? "rgba(255,255,255,0.7)"
                  : "#8a8070",
              }}
            >
              {dayMaster} · {ELEMENT_LABEL[element]}
            </div>
          )}
          <div
            className="font-[family-name:var(--font-body)] text-[0.6875rem] italic leading-[1.4] mb-2"
            style={{
              color: isUnlocked
                ? "rgba(255,255,255,0.85)"
                : "#8a8070",
            }}
          >
            &ldquo;{displayTitle}&rdquo;
          </div>

          {/* MBTI badge */}
          {character.mbti && (
            <span
              className="inline-block font-[family-name:var(--font-pixel)] text-[0.5625rem] px-2 py-0.5"
              style={{
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
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3.5">
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
      <div className="flex gap-2 mt-3.5">
        {isUnlocked ? (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex gap-2">
              <Link
                href={`/daily?characterId=${character.id}`}
                className="flex-1 flex items-center justify-center gap-1 font-[family-name:var(--font-pixel)] text-[0.6875rem] text-white no-underline cursor-pointer transition-colors duration-100"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderBottomWidth: "4px",
                  padding: "8px 4px",
                }}
              >
                {"📜 오늘의 운세"}
              </Link>
              <Link
                href={`/characters/${character.id}`}
                className="flex-1 flex items-center justify-center gap-1 font-[family-name:var(--font-pixel)] text-[0.6875rem] bg-white font-bold no-underline cursor-pointer transition-colors duration-100"
                style={{
                  color: ELEMENT_BG[element],
                  border: "2px solid rgba(255,255,255,0.8)",
                  borderBottomWidth: "4px",
                  padding: "8px 4px",
                }}
              >
                {"🌟 심화 특성"}
              </Link>
            </div>
          </div>
        ) : (
          <Link
            href={`/reading/new?characterId=${character.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 font-[family-name:var(--font-pixel)] text-[0.75rem] text-white no-underline cursor-pointer tracking-[0.04em]"
            style={{
              background:
                "linear-gradient(180deg, #d4b070 0%, #b8883c 50%, #9a7040 100%)",
              border: "2px solid #9a7040",
              borderBottomWidth: "4px",
              boxShadow: "0 2px 0 #6b4e28",
              padding: "10px 8px",
              textShadow: "0 1px 1px rgba(0,0,0,0.2)",
            }}
          >
            {"⚔️ 운명의 서를 열다 — 990원"}
          </Link>
        )}
      </div>
    </div>
  );
}
