import Link from "next/link";
import CapsuleFrame, { type Element as ElementType } from "./CapsuleFrame";
import {
  COIN_PRICE_DISPLAY,
  formatCoinCount,
} from "@/lib/copy/gacha-terms";
import { ELEMENT_LABEL } from "@/lib/copy/day-master";

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
  /** 비유체 라벨 (예: "깊은 바다"). 부모에서 `formatDayMasterDisplay`로 변환하여 전달. 없으면 표시 생략. */
  dayMasterLabel?: string;
  statScores?: StatScores | null;
  characterTitle?: string | null;
  /** 본인(메인) 캐릭터 — 골드 라이닝 + "나" 배지로 시각 위계 강조 */
  isSelf?: boolean;
}

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
    <div
      className="stat-mini"
      data-locked={locked ? "true" : "false"}
      aria-label={`${label}: ${locked ? "잠김" : value}`}
    >
      <span className="stat-mini-icon">{icon}</span>
      <div className="stat-mini-bar">
        <div
          className="stat-mini-fill"
          // 동적 값 예외: width/color는 props(value/color)에서만 나오므로 inline 허용
          style={{ width: `${value}%`, ["--stat-color" as string]: color }}
        />
      </div>
      <span className="stat-mini-value">{locked ? "??" : value}</span>
    </div>
  );
}

export default function CharacterSlot({
  character,
  element,
  level,
  dayMasterLabel,
  statScores,
  characterTitle,
  isSelf = false,
}: CharacterSlotProps) {
  const isUnlocked = character.unlocked;
  const hasStats = !!statScores;
  const showColor = isUnlocked || hasStats;
  const avatarUrl = `/characters/${element}-${character.gender}.png`;

  // Title: from prop -> from statScores -> from element
  const displayTitle =
    characterTitle ?? statScores?.title ?? `${ELEMENT_LABEL[element]} 기운의 모험가`;

  return (
    <div
      className="character-slot"
      data-element={showColor ? element : undefined}
      data-unlocked={showColor ? "true" : "false"}
      data-self={isSelf ? "true" : undefined}
    >
      {/* "나" 배지 — 본인 캐릭터 시각 위계 강조 */}
      {isSelf && (
        <span className="self-badge" aria-label="본인 캐릭터">
          나
        </span>
      )}

      {/* Element badge - top right */}
      {showColor && (
        <span
          className="absolute top-2 right-2 font-[family-name:var(--font-pixel)] text-[0.5625rem] tracking-[0.06em] text-white/60"
        >
          {ELEMENT_LABEL[element]} 기운
        </span>
      )}

      {/* Top section: Avatar + Info */}
      <div className="flex items-start gap-4">
        {/* Capsule-framed avatar */}
        <CapsuleFrame
          avatarSrc={avatarUrl}
          avatarAlt={`${character.name} 캐릭터`}
          element={element}
          size="md"
          locked={!showColor}
        />

        {/* Info column */}
        <div className="flex-1 min-w-0">
          {/* Level */}
          <div className="mb-1">
            <span
              className={`font-[family-name:var(--font-pixel)] text-[0.625rem] ${
                showColor ? "text-white/70" : "text-[#8a8070]"
              }`}
            >
              Lv.{level}
            </span>
          </div>

          {/* Name */}
          <div
            className={`font-[family-name:var(--font-pixel)] text-[1.125rem] leading-[1.2] mb-1 ${
              showColor ? "text-white" : "text-[#5a4e3c]"
            }`}
          >
            {character.name}
          </div>

          {/* Day master metaphor + Element */}
          {dayMasterLabel && (
            <div
              className={`font-[family-name:var(--font-pixel)] text-[0.625rem] mb-0.5 ${
                showColor ? "text-white/70" : "text-[#8a8070]"
              }`}
            >
              {dayMasterLabel} · {ELEMENT_LABEL[element]}
            </div>
          )}

          {/* Title */}
          <div
            className={`font-[family-name:var(--font-body)] text-[0.6875rem] italic leading-[1.4] mb-2 ${
              showColor ? "text-white/85" : "text-[#8a8070]"
            }`}
          >
            &ldquo;{displayTitle}&rdquo;
          </div>

          {/* MBTI badge */}
          {character.mbti && (
            <span
              className={
                showColor
                  ? "inline-block font-[family-name:var(--font-pixel)] text-[0.5625rem] px-2 py-0.5 text-white bg-white/20 border border-white/30"
                  : "inline-block font-[family-name:var(--font-pixel)] text-[0.5625rem] px-2 py-0.5 text-[#6858b8] bg-black/5 border border-[#6858b8]"
              }
            >
              {character.mbti}
            </span>
          )}
        </div>
      </div>

      {/* Stat bars — 2 columns, 3 rows */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3.5">
        {STAT_CONFIG.map((stat) => (
          <StatMiniBar
            key={stat.key}
            label={stat.label}
            icon={stat.icon}
            value={statScores ? (statScores[stat.key] ?? 0) : 0}
            color={stat.color}
            locked={!showColor}
          />
        ))}
      </div>

      {/* Bottom buttons */}
      <div className="flex gap-2 mt-3.5">
        {isUnlocked ? (
          <div className="flex gap-2 w-full">
            <Link
              href={`/daily?characterId=${character.id}`}
              className="character-slot-btn character-slot-btn-ghost"
            >
              오늘의 운세
            </Link>
            <Link
              href={`/characters/${character.id}`}
              className="character-slot-btn character-slot-btn-primary"
            >
              심화 특성
            </Link>
          </div>
        ) : (
          <Link
            href={`/reading/preview?characterId=${character.id}`}
            className="character-slot-btn character-slot-btn-gold w-full"
            aria-label={`운명 열기 ${COIN_PRICE_DISPLAY} (${formatCoinCount(1)})`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="character-slot-btn-icon"
            >
              {/* 픽셀 캡슐 아이콘 (16비트 단순화) */}
              <rect x="3" y="1" width="6" height="3" fill="#fff4ed" />
              <rect x="3" y="4" width="6" height="4" fill="#d04040" />
              <rect x="3" y="8" width="6" height="3" fill="#9a3030" />
              <rect x="4" y="2" width="2" height="1" fill="#ffffff" />
            </svg>
            <span>운명 열기</span>
            <span className="character-slot-btn-price">{COIN_PRICE_DISPLAY}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
