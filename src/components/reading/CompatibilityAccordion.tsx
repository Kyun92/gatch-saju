"use client";

import { useState } from "react";
import ReadingSection from "./ReadingSection";

interface CompatibilityAccordionProps {
  htmlContent: string;
}

const SECTIONS = [
  { id: "compat-summary", icon: "", title: "첫인상과 전체 요약" },
  { id: "compat-saju", icon: "", title: "사주 궁합 분석" },
  { id: "compat-ziwei", icon: "", title: "자미두수 궁합 분석" },
  { id: "compat-western", icon: "", title: "서양점성술 궁합 분석" },
  { id: "compat-synergy", icon: "", title: "강점과 시너지" },
  { id: "compat-conflict", icon: "", title: "갈등 포인트와 극복법" },
  { id: "compat-roadmap", icon: "", title: "관계 발전 로드맵" },
];

function extractSection(htmlContent: string, sectionId: string): string {
  const regex = new RegExp(
    `<section[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?</section>`,
    "i",
  );
  const match = htmlContent.match(regex);
  return match ? match[0] : "";
}

export default function CompatibilityAccordion({
  htmlContent,
}: CompatibilityAccordionProps) {
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
