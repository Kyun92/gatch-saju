"use client";

import { useState } from "react";
import ReadingSection from "./ReadingSection";

interface Tab {
  id: string;
  label: string;
  sectionId: string;
}

const TABS: Tab[] = [
  { id: "intro", label: "요약", sectionId: "intro" },
  { id: "saju", label: "사주", sectionId: "saju-analysis" },
  { id: "personality", label: "성격", sectionId: "personality" },
  { id: "career", label: "직업", sectionId: "career" },
  { id: "wealth", label: "재물", sectionId: "wealth" },
  { id: "love", label: "연애", sectionId: "relationships" },
  { id: "health", label: "건강", sectionId: "health" },
  { id: "guide", label: "개운법", sectionId: "guide" },
  { id: "frank", label: "팩트", sectionId: "frank-truth" },
];

interface ReadingTabNavProps {
  htmlContent: string;
}

export default function ReadingTabNav({ htmlContent }: ReadingTabNavProps) {
  const [activeTab, setActiveTab] = useState("intro");

  // Extract section HTML from full content
  const extractSection = (sectionId: string): string => {
    const regex = new RegExp(
      `<section[^>]*id="${sectionId}"[^>]*>([\\s\\S]*?)</section>`,
      "i",
    );
    const match = htmlContent.match(regex);
    if (match) {
      return match[0];
    }
    return "";
  };

  const activeTabData = TABS.find((t) => t.id === activeTab);
  const sectionHtml = activeTabData
    ? extractSection(activeTabData.sectionId)
    : "";

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex gap-1 overflow-x-auto pb-2 mb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="shrink-0 px-3 py-1.5 text-xs transition-colors"
            style={{
              fontFamily: "var(--font-pixel)",
              color: activeTab === tab.id ? "#b8883c" : "#8a8070",
              backgroundColor:
                activeTab === tab.id
                  ? "rgba(184, 136, 60, 0.12)"
                  : "transparent",
              border:
                activeTab === tab.id
                  ? "2px solid #b8883c"
                  : "2px solid #d4c4a0",
              borderRadius: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {sectionHtml ? (
        <ReadingSection htmlContent={sectionHtml} />
      ) : (
        <div
          className="text-center py-8"
          style={{ fontFamily: "var(--font-pixel)", color: "#8a8070" }}
        >
          해당 섹션 데이터가 없습니다
        </div>
      )}
    </div>
  );
}
