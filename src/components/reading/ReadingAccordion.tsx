"use client";

import { useState } from "react";
import ReadingSection from "./ReadingSection";

interface ReadingAccordionProps {
  htmlContent: string;
}

const SECTIONS = [
  { id: "saju-analysis", icon: "", title: "사주 분석" },
  { id: "personality", icon: "", title: "성격 분석" },
  { id: "career", icon: "", title: "직업운" },
  { id: "wealth", icon: "", title: "재물운" },
  { id: "relationships", icon: "", title: "연애운" },
  { id: "health", icon: "", title: "건강" },
  { id: "guide", icon: "", title: "개운법" },
  { id: "frank-truth", icon: "", title: "팩폭" },
];

function extractSection(htmlContent: string, sectionId: string): string {
  const regex = new RegExp(
    `<section[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?</section>`,
    "i",
  );
  const match = htmlContent.match(regex);
  return match ? match[0] : "";
}

export default function ReadingAccordion({
  htmlContent,
}: ReadingAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {SECTIONS.map((section) => {
        const sectionHtml = extractSection(htmlContent, section.id);
        if (!sectionHtml) return null;

        const isOpen = openIds.has(section.id);

        return (
          <div key={section.id} className="accordion-item">
            <div
              className="accordion-header"
              data-open={isOpen ? "true" : "false"}
              onClick={() => toggle(section.id)}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
              <span
                className="accordion-indicator"
                data-open={isOpen ? "true" : "false"}
              >
                ▶
              </span>
            </div>
            <div
              className="accordion-content-wrapper"
              data-open={isOpen ? "true" : "false"}
            >
              <div className="accordion-content">
                <div className="p-4">
                  <ReadingSection htmlContent={sectionHtml} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
