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
        className="absolute z-10 -top-2 left-2 font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#2e8b4e] border border-[#2e8b4e] bg-[#f5f0e8] px-2 py-px"
      >
        무료
      </span>

      {todayReading ? (
        <PixelFrame variant="default" className="p-4 pt-5">
          <p
            className="mb-1 font-[family-name:var(--font-pixel)] text-xs text-[#b8883c]"
          >
            {todayReading.character_title}
          </p>
          <p
            className="mb-3 font-[family-name:var(--font-body)] text-[0.8125rem] text-[#4a3e2c] leading-[1.7]"
          >
            {getFirstTwoLines(todayReading.content)}
          </p>
          <Link
            href="/daily"
            className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] no-underline"
          >
            자세히 보기 →
          </Link>
        </PixelFrame>
      ) : (
        <PixelFrame variant="default" className="p-4 pt-5 flex flex-col items-center gap-3 text-center">
          <p
            className="font-[family-name:var(--font-body)] text-sm text-[#4a3e2c]"
          >
            오늘의 퀘스트가 기다리고 있습니다
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
