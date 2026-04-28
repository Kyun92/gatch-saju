import { splitDailyContentIntoSections } from "@/lib/copy/daily-labels";

interface DailyFortuneSectionsProps {
  content: string;
  className?: string;
}

/**
 * 일일운세 본문을 5개(혹은 그 이하) 섹션 카드로 분리해 렌더링한다.
 *
 * - 헤더가 없는 레거시 plain text는 `splitDailyContentIntoSections`가 단일 섹션으로 폴백.
 * - 인라인 스타일 0건 — Tailwind arbitrary values + globals.css의 pixel-frame-simple 재사용.
 * - 헤딩: 픽셀 폰트 + 골드 액센트, 본문: 본문 폰트 + 다크 텍스트.
 */
export default function DailyFortuneSections({
  content,
  className,
}: DailyFortuneSectionsProps) {
  const sections = splitDailyContentIntoSections(content);
  if (sections.length === 0) return null;

  const wrapperClass = ["flex flex-col gap-3", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {sections.map((section, idx) => (
        <section
          key={`${idx}-${section.heading}`}
          className="pixel-frame-simple px-4 py-3"
        >
          <h3 className="text-xs mb-2 font-[family-name:var(--font-pixel)] text-[#9a7040] tracking-wide">
            {section.heading}
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#2c2418] font-[family-name:var(--font-body)]">
            {section.body}
          </p>
        </section>
      ))}
    </div>
  );
}
