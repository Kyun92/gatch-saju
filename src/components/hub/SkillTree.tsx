"use client";

import Link from "next/link";
import CoinSvg from "@/components/ui/CoinSvg";
import {
  COIN_PRICE_DISPLAY,
  formatCoinCount,
} from "@/lib/copy/gacha-terms";

type SkillNodeType =
  | "comprehensive"
  | "yearly"
  | "love"
  | "career"
  | "wealth"
  | "health"
  | "study"
  | "compatibility";

interface SkillNode {
  type: SkillNodeType;
  label: string;
  icon: string;
  description: string;
  prerequisite: SkillNodeType | null;
  comingSoon: boolean;
}

const SKILL_NODES: SkillNode[] = [
  {
    type: "comprehensive",
    label: "종합감정",
    icon: "",
    description: "평생 운명 분석",
    prerequisite: null,
    comingSoon: false,
  },
  {
    type: "yearly",
    label: "년운 분석",
    icon: "",
    description: "올해의 운세 + 12개월",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
  {
    type: "love",
    label: "연애운",
    icon: "",
    description: "이상형·연애패턴·결혼시기",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
  {
    type: "career",
    label: "직업운",
    icon: "",
    description: "적성업종·이직시기",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
  {
    type: "wealth",
    label: "금전운",
    icon: "",
    description: "재물운·투자성향",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
  {
    type: "health",
    label: "건강운",
    icon: "",
    description: "체질·건강관리",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
  {
    type: "study",
    label: "학업운",
    icon: "",
    description: "적성분야·시험운",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
  {
    type: "compatibility",
    label: "궁합 분석",
    icon: "",
    description: "두 운명의 교차점",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
];

type NodeState = "purchased" | "available" | "locked" | "coming-soon";

function getNodeState(
  node: SkillNode,
  purchasedReadings: string[],
  unlocked: boolean
): NodeState {
  if (node.comingSoon) return "coming-soon";
  if (purchasedReadings.includes(node.type)) return "purchased";
  if (node.prerequisite === null) {
    // comprehensive — purchased if unlocked
    return unlocked ? "purchased" : "available";
  }
  // Requires prerequisite (comprehensive 미해금이면 모두 locked, compatibility 포함)
  if (!unlocked) return "locked";
  if (
    node.prerequisite &&
    !purchasedReadings.includes(node.prerequisite) &&
    !(node.prerequisite === "comprehensive" && unlocked)
  ) {
    return "locked";
  }
  return "available";
}

interface SkillTreeProps {
  characterId: string;
  characterName: string;
  unlocked: boolean;
  purchasedReadings: string[];
  /** type → reading ID 맵 (해금된 상품 클릭 시 결과 페이지로 이동) */
  readingIdMap?: Record<string, string>;
}

export default function SkillTree({
  characterId,
  characterName,
  unlocked,
  purchasedReadings,
  readingIdMap = {},
}: SkillTreeProps) {
  const comprehensiveNode = SKILL_NODES[0];
  const subNodes = SKILL_NODES.slice(1);

  return (
    <div className="skill-tree-container">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-[family-name:var(--font-pixel)] text-[0.75rem] text-[#9a7040] tracking-[0.06em]">
          {"심화 특성"}
        </span>
        <span className="skill-tree-header-line flex-1 h-px opacity-40" />
        <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8944c] opacity-70">
          {characterName}
        </span>
      </div>

      {/* Root node — comprehensive (full width) */}
      <SkillNodeCard
        node={comprehensiveNode}
        state={getNodeState(comprehensiveNode, purchasedReadings, unlocked)}
        characterId={characterId}
        isRoot
        readingIdMap={readingIdMap}
      />

      {/* Connector line from root to grid */}
      <div className="flex justify-center h-4">
        <div
          className="skill-tree-connector w-0.5 h-full opacity-50"
          data-state={unlocked ? "active" : "inactive"}
        />
      </div>

      {/* Sub-nodes — 2-column grid */}
      <div className="grid grid-cols-2 gap-2">
        {subNodes.map((node) => (
          <SkillNodeCard
            key={node.type}
            node={node}
            state={getNodeState(node, purchasedReadings, unlocked)}
            characterId={characterId}
            readingIdMap={readingIdMap}
          />
        ))}
      </div>
    </div>
  );
}

function SkillNodeCard({
  node,
  state,
  characterId,
  isRoot = false,
  readingIdMap = {},
}: {
  node: SkillNode;
  state: NodeState;
  characterId: string;
  isRoot?: boolean;
  readingIdMap?: Record<string, string>;
}) {
  const isPurchased = state === "purchased";
  const isAvailable = state === "available";
  const isLocked = state === "locked";
  const isComingSoon = state === "coming-soon";

  // Determine link target
  let href: string | null = null;
  if (node.type === "compatibility" && (isAvailable || isPurchased)) {
    href = `/compatibility`;
  } else if (isPurchased && readingIdMap[node.type]) {
    href = `/reading/${readingIdMap[node.type]}`;
  } else if (isPurchased) {
    href = `/reading?characterId=${characterId}`;
  } else if (isAvailable && node.type === "comprehensive") {
    href = `/reading/new?characterId=${characterId}`;
  } else if (isAvailable) {
    href = `/reading/new?characterId=${characterId}&type=${node.type}`;
  }

  const ariaLabel = `${node.label}: ${
    isPurchased
      ? "해금됨"
      : isAvailable
        ? "구매 가능"
        : isComingSoon
          ? "준비 중"
          : "잠김"
  }`;

  const cardContent = (
    <div
      className={`skill-node relative overflow-hidden transition-[border-color,box-shadow] duration-150 ease-in-out ${
        isAvailable ? "animate-skill-node-pulse" : ""
      } ${isRoot ? "skill-node-root" : "skill-node-leaf"}`}
      data-state={state}
      role="listitem"
      aria-label={ariaLabel}
    >
      {/* Status badge — top right */}
      {isComingSoon && (
        <span className="absolute top-1.5 right-1.5 font-[family-name:var(--font-pixel)] text-[0.5rem] text-[#8a8070] bg-[#ece5d8] px-1.5 py-px border border-[#d4cfc8]">
          준비 중
        </span>
      )}

      {isPurchased && (
        <span className="absolute top-1.5 right-1.5 font-[family-name:var(--font-pixel)] text-[0.5rem] text-white bg-[#c8a020] px-1.5 py-px border border-[#9a7040]">
          CLEAR
        </span>
      )}

      {/* Main content row */}
      <div className={`flex items-center ${isRoot ? "gap-3" : "gap-2"}`}>
        {/* Icon — locked일 때 자물쇠 픽셀 SVG, 그 외엔 node.icon */}
        <span
          className={`shrink-0 skill-node-icon ${
            isRoot ? "skill-node-icon-root" : "skill-node-icon-leaf"
          }`}
        >
          {isLocked ? (
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="skill-node-lock-icon"
            >
              {/* 자물쇠 픽셀 SVG */}
              <rect x="3" y="1" width="8" height="2" fill="#a89878" />
              <rect x="2" y="3" width="2" height="4" fill="#a89878" />
              <rect x="10" y="3" width="2" height="4" fill="#a89878" />
              <rect x="1" y="6" width="12" height="9" fill="#c8c0b0" />
              <rect x="2" y="7" width="10" height="7" fill="#d8d0c0" />
              <rect x="6" y="9" width="2" height="3" fill="#5a4e3c" />
              <rect x="6" y="11" width="2" height="2" fill="#5a4e3c" />
            </svg>
          ) : (
            node.icon
          )}
        </span>

        {/* Label + description */}
        <div className="flex-1 min-w-0">
          <div
            className={`skill-node-label font-[family-name:var(--font-pixel)] leading-[1.2] mb-0.5 ${
              isRoot ? "text-sm" : "text-xs"
            }`}
          >
            {node.label}
          </div>
          <div className="skill-node-desc font-[family-name:var(--font-body)] text-[0.625rem] leading-[1.3]">
            {node.description}
          </div>
        </div>

        {/* 가용 노드: 가격 뱃지 (990원 1차, 코인 보조) */}
        {isAvailable && (
          <span
            className="skill-node-price-badge inline-flex items-center gap-1.5 font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#fce474] px-2 py-[3px] shrink-0 tracking-wider whitespace-nowrap"
            aria-label={`${COIN_PRICE_DISPLAY} (${formatCoinCount(1)}) 사용`}
          >
            <CoinSvg size={12} className="skill-node-coin" />
            {COIN_PRICE_DISPLAY}
          </span>
        )}

        {/* Arrow for purchased */}
        {isPurchased && (
          <span className="font-[family-name:var(--font-pixel)] text-[0.75rem] text-[#b8944c] shrink-0">
            {">"}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="no-underline block"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
