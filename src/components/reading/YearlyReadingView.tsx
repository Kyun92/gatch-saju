"use client";

import PixelFrame from "@/components/ui/PixelFrame";
import PixelDivider from "@/components/ui/PixelDivider";
import ReadingSection from "./ReadingSection";

interface YearlyReadingViewProps {
  content: string;
  year: number;
  characterName: string;
}

const YEARLY_SECTIONS = [
  { id: "big-picture", icon: "🌅", title: "올해의 큰 그림" },
  { id: "decadal", icon: "🔮", title: "대운 흐름 분석" },
  { id: "yearly-fortune", icon: "📅", title: "올해 세운 상세" },
  { id: "career", icon: "💼", title: "직업/재물 운세" },
  { id: "relationships", icon: "💕", title: "인간관계/연애 운세" },
  { id: "health", icon: "🌿", title: "건강/생활 운세" },
  { id: "monthly", icon: "📆", title: "12개월 월운 달력" },
  { id: "fortune-tips", icon: "🍀", title: "올해의 개운법" },
];

function extractSection(htmlContent: string, sectionId: string): string {
  const regex = new RegExp(
    `<section[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?</section>`,
    "i",
  );
  const match = htmlContent.match(regex);
  return match ? match[0] : "";
}

export default function YearlyReadingView({
  content,
  year,
  characterName,
}: YearlyReadingViewProps) {
  // Check if content has HTML sections (structured output from AI)
  const hasHtmlSections = /<section[^>]*id=/.test(content);

  if (hasHtmlSections) {
    return (
      <div className="flex flex-col gap-4">
        {YEARLY_SECTIONS.map((section) => {
          const sectionHtml = extractSection(content, section.id);
          if (!sectionHtml) return null;

          return (
            <PixelFrame key={section.id} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: "1.1rem" }}>{section.icon}</span>
                <h3
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "0.875rem",
                    color: "#2c2418",
                  }}
                >
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

  // Fallback: plain text display with whitespace-pre-wrap
  return (
    <PixelFrame className="p-5">
      <div
        className="text-sm leading-relaxed"
        style={{
          color: "#2c2418",
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
        }}
      >
        {content}
      </div>
    </PixelFrame>
  );
}
