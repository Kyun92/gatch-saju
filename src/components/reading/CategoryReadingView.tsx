"use client";

import PixelFrame from "@/components/ui/PixelFrame";
import ReadingSection from "./ReadingSection";

export type CategoryType = "love" | "career" | "wealth" | "health" | "study";

interface CategoryReadingViewProps {
  content: string;
  category: CategoryType;
  characterName: string;
}

const CATEGORY_SECTIONS: Record<
  CategoryType,
  { id: string; icon: string; title: string }[]
> = {
  love: [
    { id: "love-overview", icon: "💕", title: "연애 종합 분석" },
    { id: "love-pattern", icon: "🌹", title: "연애 패턴" },
    { id: "love-timing", icon: "⏰", title: "연애/결혼 시기" },
    { id: "love-advice", icon: "💌", title: "연애 조언" },
  ],
  career: [
    { id: "career-overview", icon: "💼", title: "직업 종합 분석" },
    { id: "career-fit", icon: "🎯", title: "적성 업종" },
    { id: "career-timing", icon: "⏰", title: "이직/전환 시기" },
    { id: "career-advice", icon: "🚀", title: "직업 조언" },
  ],
  wealth: [
    { id: "wealth-overview", icon: "💰", title: "재물 종합 분석" },
    { id: "wealth-pattern", icon: "💳", title: "재물 패턴" },
    { id: "wealth-timing", icon: "⏰", title: "재물 기회 시기" },
    { id: "wealth-advice", icon: "🏦", title: "재테크 조언" },
  ],
  health: [
    { id: "health-overview", icon: "🏥", title: "건강 종합 분석" },
    { id: "health-weak", icon: "⚠️", title: "취약 부위" },
    { id: "health-prevention", icon: "🛡️", title: "예방법" },
    { id: "health-advice", icon: "🌿", title: "건강 관리 조언" },
  ],
  study: [
    { id: "study-overview", icon: "📚", title: "학업 종합 분석" },
    { id: "study-fit", icon: "🎓", title: "적성 분야" },
    { id: "study-timing", icon: "⏰", title: "시험운 시기" },
    { id: "study-advice", icon: "📝", title: "학습 조언" },
  ],
};

function extractSection(htmlContent: string, sectionId: string): string {
  const regex = new RegExp(
    `<section[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?</section>`,
    "i",
  );
  const match = htmlContent.match(regex);
  return match ? match[0] : "";
}

export default function CategoryReadingView({
  content,
  category,
  characterName,
}: CategoryReadingViewProps) {
  const sections = CATEGORY_SECTIONS[category];
  const hasHtmlSections = /<section[^>]*id=/.test(content);

  if (hasHtmlSections) {
    return (
      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const sectionHtml = extractSection(content, section.id);
          if (!sectionHtml) return null;

          return (
            <PixelFrame key={section.id} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{section.icon}</span>
                <h3 className="font-[family-name:var(--font-pixel)] text-sm text-[#2c2418]">
                  {section.title}
                </h3>
              </div>
              <ReadingSection htmlContent={sectionHtml} />
            </PixelFrame>
          );
        })}
      </div>
    );
  }

  // Fallback: plain text display
  return (
    <PixelFrame className="p-5">
      <div className="text-sm leading-relaxed text-[#2c2418] whitespace-pre-wrap break-keep">
        {content}
      </div>
    </PixelFrame>
  );
}
