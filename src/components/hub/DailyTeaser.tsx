import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

interface DailyTodayReading {
  content: string;
  character_title: string;
}

interface DailyTeaserProps {
  todayReading: DailyTodayReading | null;
}

function getFirstTwoLines(text: string): string {
  // Strip HTML tags if present
  const stripped = text.replace(/<[^>]*>/g, "");
  const lines = stripped.split(/[\n。！？.!?]/).filter((l) => l.trim().length > 0);
  return lines.slice(0, 2).join(" ").trim().slice(0, 80) + (stripped.length > 80 ? "…" : "");
}

export default function DailyTeaser({ todayReading }: DailyTeaserProps) {
  return (
    <div className="relative">
      {/* 무료 뱃지 */}
      <span
        className="absolute z-10"
        style={{
          top: -8,
          left: 8,
          fontFamily: "var(--font-pixel)",
          fontSize: "0.5625rem",
          color: "#2e8b4e",
          border: "1px solid #2e8b4e",
          backgroundColor: "#f5f0e8",
          padding: "2px 8px",
        }}
      >
        무료
      </span>

      {todayReading ? (
        <PixelFrame variant="default" className="p-4 pt-5">
          <p
            className="mb-1"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.75rem",
              color: "#b8883c",
            }}
          >
            {todayReading.character_title}
          </p>
          <p
            className="mb-3 leading-relaxed"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "#4a3e2c",
              lineHeight: 1.7,
            }}
          >
            {getFirstTwoLines(todayReading.content)}
          </p>
          <Link
            href="/daily"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.6875rem",
              color: "#9a7040",
              textDecoration: "none",
            }}
          >
            자세히 보기 →
          </Link>
        </PixelFrame>
      ) : (
        <PixelFrame variant="default" className="p-4 pt-5 flex flex-col items-center gap-3 text-center">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "#4a3e2c",
            }}
          >
            📜 오늘의 퀘스트가 기다리고 있습니다
          </p>
          <Link href="/daily">
            <PixelButton variant="primary" size="sm">
              운세 확인하기
            </PixelButton>
          </Link>
        </PixelFrame>
      )}
    </div>
  );
}
