"use client";

import Link from "next/link";
import CoinSvg from "@/components/ui/CoinSvg";

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
  // Requires prerequisite
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
        <span
          className="flex-1 h-px opacity-40"
          style={{
            background:
              "linear-gradient(90deg, #b8944c 0%, transparent 100%)",
          }}
        />
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
          className="w-0.5 h-full opacity-50"
          style={{
            backgroundColor: unlocked ? "#b8944c" : "#d4cfc8",
          }}
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

  // Dynamic styles per state — keep inline
  const bgColor = isPurchased
    ? "rgba(200, 160, 32, 0.12)"
    : isAvailable
      ? "#ffffff"
      : "#f5f2ec";

  const borderColor = isPurchased
    ? "#9a7040"
    : isAvailable
      ? "#b8944c"
      : "#d4cfc8";

  const textColor = isPurchased
    ? "#9a7040"
    : isAvailable
      ? "#2c2418"
      : "#b8a890";

  const descColor = isPurchased
    ? "#9a7040"
    : isAvailable
      ? "#8a8070"
      : "#c8c0b0";

  const iconOpacity = isLocked || isComingSoon ? 0.4 : 1;

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

  const cardContent = (
    <div
      className="skill-node relative overflow-hidden transition-[border-color,box-shadow] duration-150 ease-in-out"
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderBottomWidth: isPurchased ? "4px" : isAvailable ? "4px" : "2px",
        boxShadow:
          isPurchased
            ? "3px 3px 0px rgba(154, 112, 64, 0.15)"
            : isAvailable
              ? "3px 3px 0px rgba(0, 0, 0, 0.06)"
              : "none",
        padding: isRoot ? "14px 16px" : "10px 12px",
        opacity: isLocked || isComingSoon ? 0.6 : 1,
        cursor: href ? "pointer" : "default",
      }}
      role="listitem"
      aria-label={`${node.label}: ${
        isPurchased
          ? "해금됨"
          : isAvailable
            ? "구매 가능"
            : isComingSoon
              ? "준비 중"
              : "잠김"
      }`}
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
      <div
        className="flex items-center"
        style={{ gap: isRoot ? "12px" : "8px" }}
      >
        {/* Icon */}
        <span
          className="shrink-0"
          style={{
            fontSize: isRoot ? "1.5rem" : "1.125rem",
            opacity: iconOpacity,
            filter: isLocked || isComingSoon ? "grayscale(80%)" : "none",
          }}
        >
          {isLocked ? "" : node.icon}
        </span>

        {/* Label + description */}
        <div className="flex-1 min-w-0">
          <div
            className="font-[family-name:var(--font-pixel)] leading-[1.2] mb-0.5"
            style={{
              fontSize: isRoot ? "0.875rem" : "0.75rem",
              color: textColor,
            }}
          >
            {node.label}
          </div>
          <div
            className="font-[family-name:var(--font-body)] text-[0.625rem] leading-[1.3]"
            style={{ color: descColor }}
          >
            {node.description}
          </div>
        </div>

        {/* 가용 노드: 코인 1개 뱃지 (아케이드 코인 스타일) */}
        {isAvailable && (
          <span
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#fce474] px-2 py-[3px] shrink-0 tracking-wider whitespace-nowrap"
            style={{
              backgroundColor: "#2b2b36",
              border: "2px solid #111",
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.18), inset -1px -1px 0 rgba(0,0,0,0.5), 0 2px 0 #0a0a0f",
            }}
            aria-label="코인 1개 사용"
          >
            <CoinSvg size={12} className="skill-node-coin" />
            1
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
