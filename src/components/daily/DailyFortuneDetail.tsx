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
        className="absolute top-2 right-3 pixel-btn-secondary"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.75rem",
          padding: "2px 8px",
          border: "1px solid #d4c4a0",
          background: "#faf7f2",
          color: "#9a7040",
          cursor: "pointer",
          lineHeight: 1.4,
        }}
        aria-label="닫기"
      >
        X
      </button>

      {/* Date label */}
      <p
        className="text-xs mb-1"
        style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
      >
        {year}. {dateLabel}
      </p>

      {/* Title */}
      {title && (
        <h3
          className="text-base mb-3"
          style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
        >
          {title}
        </h3>
      )}

      {/* Content */}
      <div
        className="daily-fortune-content whitespace-pre-wrap"
        style={{ color: "#2c2418" }}
      >
        {content}
      </div>
    </PixelFrame>
  );
}
