"use client";

import PixelFrame from "@/components/ui/PixelFrame";

interface DailyFortuneDetailProps {
  date: string; // "2026-04-14"
  title: string | null;
  content: string;
  onClose: () => void;
}

export default function DailyFortuneDetail({
  date,
  title,
  content,
  onClose,
}: DailyFortuneDetailProps) {
  const [year, month, day] = date.split("-");
  const dateLabel = `${Number(month)}월 ${Number(day)}일`;

  return (
    <PixelFrame variant="accent" className="p-4 mt-3 relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-3 pixel-btn-secondary font-[family-name:var(--font-pixel)] text-xs px-2 py-0.5 border border-[#d4c4a0] bg-[#faf7f2] text-[#9a7040] cursor-pointer leading-snug"
        aria-label="닫기"
      >
        X
      </button>

      {/* Date label */}
      <p className="text-xs mb-1 font-[family-name:var(--font-pixel)] text-[#b8883c]">
        {year}. {dateLabel}
      </p>

      {/* Title */}
      {title && (
        <h3 className="text-base mb-3 font-[family-name:var(--font-pixel)] text-[#9a7040]">
          {title}
        </h3>
      )}

      {/* Content */}
      <div className="daily-fortune-content whitespace-pre-wrap text-[#2c2418]">
        {content}
      </div>
    </PixelFrame>
  );
}
