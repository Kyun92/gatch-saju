import DailyCalendar from "@/components/daily/DailyCalendar";
import PixelFrame from "@/components/ui/PixelFrame";

/** Dev preview — 캘린더 UI 확인용 */
export default function DevDailyPage() {
  const today = new Date().toISOString().split("T")[0];
  const month = today.slice(0, 7); // "2026-04"

  // 한 달 꽉 채운 더미 데이터 (랜덤 점수)
  const titles = ["대길의 날", "활기찬 에너지", "조용한 성찰", "풍요의 기운", "도전의 날", "인연의 날", "성장의 날", "깊은 사색", "빛나는 하루", "새로운 시작"];
  const contents = [
    "깊은 물 기운(壬水)이 나무를 키우는 날이에요.",
    "불꽃 기운(火)이 활발한 날입니다.",
    "대지 기운(土)이 안정감을 가져다주는 하루입니다.",
    "쇠 기운(金)이 강해지는 날입니다.",
    "물 기운(水)과 나무 기운(木)이 조화를 이루는 날이에요.",
  ];
  // seeded pseudo-random for consistent SSR
  function seededRandom(seed: number) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

  const fortuneDates: Record<string, { id: string; title: string | null; content: string; score: number }> = {};
  const daysInMonth = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${month}-${String(d).padStart(2, "0")}`;
    const r = seededRandom(d * 7 + 42);
    const score = Math.round(20 + r * 80); // 20~100 range
    fortuneDates[dateKey] = {
      id: String(d),
      title: titles[d % titles.length],
      content: contents[d % contents.length],
      score,
    };
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      <div
        className="w-full mx-auto px-4 py-6 flex flex-col gap-4"
        style={{ maxWidth: "480px" }}
      >
        <h1
          className="text-xl"
          style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
        >
          📜 오늘의 퀘스트
        </h1>
        <p className="text-sm" style={{ color: "#8a8070" }}>
          임승균님의 일일 운세 | INFP
        </p>

        {/* 오늘의 운세 (더미) */}
        <PixelFrame variant="accent" className="p-5">
          <h2
            className="text-lg mb-3"
            style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
          >
            오늘의 운세
          </h2>
          <div className="whitespace-pre-wrap" style={{ color: "#2c2418", lineHeight: 1.7 }}>
            {fortuneDates[today]?.content ?? "아직 운세를 확인하지 않았습니다."}
          </div>
        </PixelFrame>

        {/* 캘린더 */}
        <DailyCalendar
          characterId="dummy-id"
          fortuneDates={fortuneDates}
          initialMonth={month}
        />
      </div>
    </div>
  );
}
