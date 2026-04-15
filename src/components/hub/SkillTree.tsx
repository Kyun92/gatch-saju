"use client";

import Link from "next/link";

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
    icon: "⚔️",
    description: "평생 운명 분석",
    prerequisite: null,
    comingSoon: false,
  },
  {
    type: "yearly",
    label: "년운 분석",
    icon: "📅",
    description: "올해의 운세 + 12개월",
    prerequisite: "comprehensive",
    comingSoon: false,
  },
  {
    type: "love",
    label: "연애운",
    icon: "💕",
    description: "이상형·연애패턴·결혼시기",
    prerequisite: "comprehensive",
    comingSoon: true,
  },
  {
    type: "career",
    label: "직업운",
    icon: "💼",
    description: "적성업종·이직시기",
    prerequisite: "comprehensive",
    comingSoon: true,
  },
  {
    type: "wealth",
    label: "금전운",
    icon: "💰",
    description: "재물운·투자성향",
    prerequisite: "comprehensive",
    comingSoon: true,
  },
  {
    type: "health",
    label: "건강운",
    icon: "🏥",
    description: "체질·건강관리",
    prerequisite: "comprehensive",
    comingSoon: true,
  },
  {
    type: "study",
    label: "학업운",
    icon: "📚",
    description: "적성분야·시험운",
    prerequisite: "comprehensive",
    comingSoon: true,
  },
  {
    type: "compatibility",
    label: "궁합 분석",
    icon: "💑",
    description: "두 운명의 교차점",
    prerequisite: "comprehensive",
    comingSoon: true,
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
}

export default function SkillTree({
  characterId,
  characterName,
  unlocked,
  purchasedReadings,
}: SkillTreeProps) {
  const comprehensiveNode = SKILL_NODES[0];
  const subNodes = SKILL_NODES.slice(1);

  return (
    <div className="skill-tree-container">
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.75rem",
            color: "#9a7040",
            letterSpacing: "0.06em",
          }}
        >
          {"⚔️ 심화 특성"}
        </span>
        <span
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(90deg, #b8944c 0%, transparent 100%)",
            opacity: 0.4,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.5625rem",
            color: "#b8944c",
            opacity: 0.7,
          }}
        >
          {characterName}
        </span>
      </div>

      {/* Root node — comprehensive (full width) */}
      <SkillNodeCard
        node={comprehensiveNode}
        state={getNodeState(comprehensiveNode, purchasedReadings, unlocked)}
        characterId={characterId}
        isRoot
      />

      {/* Connector line from root to grid */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "16px",
        }}
      >
        <div
          style={{
            width: "2px",
            height: "100%",
            backgroundColor: unlocked ? "#b8944c" : "#d4cfc8",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Sub-nodes — 2-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        {subNodes.map((node) => (
          <SkillNodeCard
            key={node.type}
            node={node}
            state={getNodeState(node, purchasedReadings, unlocked)}
            characterId={characterId}
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
}: {
  node: SkillNode;
  state: NodeState;
  characterId: string;
  isRoot?: boolean;
}) {
  const isPurchased = state === "purchased";
  const isAvailable = state === "available";
  const isLocked = state === "locked";
  const isComingSoon = state === "coming-soon";

  // Determine styles per state
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

  const borderWidth = isPurchased ? "2px" : "2px";

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
  if (isPurchased && node.type === "comprehensive") {
    href = `/reading?characterId=${characterId}`;
  } else if (isPurchased) {
    href = `/reading/${node.type}?characterId=${characterId}`;
  } else if (isAvailable && node.type === "comprehensive") {
    href = `/reading/new?characterId=${characterId}`;
  } else if (isAvailable) {
    href = `/reading/new?characterId=${characterId}&type=${node.type}`;
  }

  const cardContent = (
    <div
      className="skill-node"
      style={{
        backgroundColor: bgColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderBottomWidth: isPurchased ? "4px" : isAvailable ? "4px" : "2px",
        boxShadow:
          isPurchased
            ? "3px 3px 0px rgba(154, 112, 64, 0.15)"
            : isAvailable
              ? "3px 3px 0px rgba(0, 0, 0, 0.06)"
              : "none",
        padding: isRoot ? "14px 16px" : "10px 12px",
        position: "relative",
        overflow: "hidden",
        opacity: isLocked || isComingSoon ? 0.6 : 1,
        cursor: href ? "pointer" : "default",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
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
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            fontFamily: "var(--font-pixel)",
            fontSize: "0.5rem",
            color: "#8a8070",
            backgroundColor: "#ece5d8",
            padding: "1px 6px",
            border: "1px solid #d4cfc8",
          }}
        >
          준비 중
        </span>
      )}

      {isPurchased && (
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            fontFamily: "var(--font-pixel)",
            fontSize: "0.5rem",
            color: "#ffffff",
            backgroundColor: "#c8a020",
            padding: "1px 6px",
            border: "1px solid #9a7040",
          }}
        >
          CLEAR
        </span>
      )}

      {/* Main content row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isRoot ? "12px" : "8px",
        }}
      >
        {/* Icon */}
        <span
          style={{
            fontSize: isRoot ? "1.5rem" : "1.125rem",
            opacity: iconOpacity,
            flexShrink: 0,
            filter: isLocked || isComingSoon ? "grayscale(80%)" : "none",
          }}
        >
          {isLocked ? "🔒" : node.icon}
        </span>

        {/* Label + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: isRoot ? "0.875rem" : "0.75rem",
              color: textColor,
              lineHeight: 1.2,
              marginBottom: "2px",
            }}
          >
            {node.label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.625rem",
              color: descColor,
              lineHeight: 1.3,
            }}
          >
            {node.description}
          </div>
        </div>

        {/* Price badge for available nodes */}
        {isAvailable && (
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.625rem",
              color: "#ffffff",
              background:
                "linear-gradient(180deg, #d4b070 0%, #b8883c 50%, #9a7040 100%)",
              padding: "3px 8px",
              border: "1px solid #9a7040",
              flexShrink: 0,
              textShadow: "0 1px 1px rgba(0,0,0,0.15)",
            }}
          >
            990원
          </span>
        )}

        {/* Arrow for purchased */}
        {isPurchased && (
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.75rem",
              color: "#b8944c",
              flexShrink: 0,
            }}
          >
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
        style={{ textDecoration: "none", display: "block" }}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
