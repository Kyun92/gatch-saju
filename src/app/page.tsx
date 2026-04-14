import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HubHeader from "@/components/hub/HubHeader";
import TriSystemSymbol from "@/components/hub/TriSystemSymbol";
import ServiceCard from "@/components/hub/ServiceCard";
import DailyTeaser from "@/components/hub/DailyTeaser";
import TrustBadge from "@/components/hub/TrustBadge";
import CharacterHero from "@/components/character/CharacterHero";

export default async function HubPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const userId = session.user.userId;

  // Fetch user profile
  const { data: user } = await supabase
    .from("users")
    .select("name, birth_date, gender, mbti, profile_complete")
    .eq("id", userId)
    .single();

  if (!user?.profile_complete) redirect("/onboarding");

  // Fetch chart data for element
  const { data: sajuChart } = await supabase
    .from("charts")
    .select("data")
    .eq("user_id", userId)
    .eq("type", "saju")
    .single();

  // Fetch today's daily reading
  const today = new Date().toISOString().split("T")[0];
  const { data: todayReading } = await supabase
    .from("readings")
    .select("content, character_title")
    .eq("user_id", userId)
    .eq("type", "daily")
    .eq("status", "complete")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch reading count (reserved for future rank display)
  await supabase
    .from("readings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "comprehensive")
    .eq("status", "complete");

  // Derive character info
  const sajuData = sajuChart?.data as Record<string, unknown> | null;
  const dayMaster = (sajuData?.dayMaster as string) ?? "";
  const fiveElements = sajuData?.fiveElements as Record<string, number> | null;

  // Determine dominant element
  type ElementType = "wood" | "fire" | "earth" | "metal" | "water";
  const elementMap: Record<string, ElementType> = {
    "木": "wood", "火": "fire", "土": "earth", "金": "metal", "水": "water",
  };
  const elementLabelMap: Record<ElementType, string> = {
    wood: "목(木)의 용사",
    fire: "화(火)의 전사",
    earth: "토(土)의 현자",
    metal: "금(金)의 기사",
    water: "수(水)의 술사",
  };
  let element: ElementType = "water";
  if (fiveElements) {
    const maxEntry = Object.entries(fiveElements).reduce((a, b) => a[1] >= b[1] ? a : b);
    element = elementMap[maxEntry[0]] ?? "water";
  }

  // Calculate age as level
  const birthYear = user.birth_date ? new Date(user.birth_date).getFullYear() : 2000;
  const level = new Date().getFullYear() - birthYear;

  // Character class title derived from element + day master
  const classTitle = dayMaster ? `${dayMaster} · ${elementLabelMap[element]}` : elementLabelMap[element];

  return (
    <div className="hub-bg min-h-screen flex flex-col">
      {/* Header */}
      <HubHeader userName={user.name ?? "모험가"} />

      {/* Main content */}
      <div
        className="flex-1 w-full mx-auto px-4 py-6 flex flex-col gap-0"
        style={{ maxWidth: "480px" }}
      >
        {/* ── 캐릭터 히어로 섹션 ── */}
        <section
          className="pixel-frame-accent flex flex-col items-center py-8 px-4 gap-1"
          style={{ marginBottom: 0 }}
        >
          <CharacterHero
            avatarUrl={`/characters/${element}-${user.gender ?? "male"}.png`}
            dayMaster={dayMaster}
            level={level}
            classTitle={classTitle}
            characterTitle={user.name ?? "모험가"}
            element={element}
            mbti={user.mbti ?? null}
          />
        </section>

        {/* ── 픽셀 구분선 ── */}
        <div className="pixel-divider my-5">3체계 교차분석</div>

        {/* ── 3체계 시각화 섹션 ── */}
        <section className="pixel-frame flex flex-col items-center py-6 px-4 gap-3">
          <TriSystemSymbol size="full" />
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.625rem",
              color: "#8a8070",
              letterSpacing: "0.06em",
            }}
          >
            사주 × 자미두수 × 서양점성술
          </p>
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "#5a4e3c",
              lineHeight: 1.6,
            }}
          >
            세 가지 운명학이 하나로 만나는 곳
          </p>
        </section>

        {/* ── 픽셀 구분선 ── */}
        <div className="pixel-divider my-5">오늘의 운세</div>

        {/* ── 일일운세 티저 ── */}
        <DailyTeaser todayReading={todayReading} />

        {/* ── 픽셀 구분선 ── */}
        <div className="pixel-divider my-5" aria-hidden="true" />

        {/* ── 퀘스트 보드 ── */}
        <section>
          <h2 className="quest-board-title mb-4">퀘스트 보드</h2>
          <div className="flex flex-col gap-3">
            <ServiceCard
              icon="📜"
              title="일일 퀘스트"
              description="매일 새로운 운세를 확인하세요"
              price={null}
              href="/daily"
            />
            <ServiceCard
              icon="⚔️"
              title="종합 사주 감정"
              description="사주 × 자미두수 × 점성술 3체계 AI 교차분석"
              price="990원"
              href="/reading"
              popular
            />
            <ServiceCard
              icon="💕"
              title="궁합 분석"
              description="두 운명의 교차점을 찾아드립니다"
              price="990원"
              href="/compatibility"
            />
          </div>
        </section>

        {/* ── 신뢰 배너 ── */}
        <div className="mt-6">
          <TrustBadge />
        </div>
      </div>
    </div>
  );
}
