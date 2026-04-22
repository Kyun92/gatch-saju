"use client";

import PixelFrame from "@/components/ui/PixelFrame";
import ReadingSection from "./ReadingSection";

interface YearlyReadingViewProps {
  content: string;
  year: number;
  characterName: string;
}

const YEARLY_SECTIONS = [
  { id: "yearly-summary", icon: "", title: "올해의 운세 요약" },
  { id: "yearly-career", icon: "", title: "직업/사업운" },
  { id: "yearly-wealth", icon: "", title: "재물/금전운" },
  { id: "yearly-love", icon: "", title: "연애/인간관계" },
  { id: "yearly-health", icon: "", title: "건강/컨디션" },
  { id: "yearly-monthly", icon: "", title: "12개월 월별 운세" },
  { id: "yearly-tips", icon: "", title: "올해의 개운법" },
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
  year: _year,
  characterName: _characterName,
}: YearlyReadingViewProps) {
  // Check if content has HTML sections (structured output)
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

  // Fallback: plain text display with whitespace-pre-wrap
  return (
    <PixelFrame className="p-5">
      <div className="text-sm leading-relaxed text-[#2c2418] whitespace-pre-wrap break-keep">
        {content}
      </div>
    </PixelFrame>
  );
}
