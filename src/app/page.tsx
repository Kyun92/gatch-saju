import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import HubHeader from "@/components/hub/HubHeader";
import CharacterSlot from "@/components/hub/CharacterSlot";
import TrustBadge from "@/components/hub/TrustBadge";
import CollectionCounter from "@/components/hub/CollectionCounter";
import { COPY } from "@/lib/copy/gacha-terms";
import type { ElementType } from "@/lib/character/get-preset";
import {
  formatDayMasterDisplay,
  getCharacterElement,
} from "@/lib/copy/day-master";

export default async function HubPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const userId = session.user.userId;

  // 1. Fetch all characters for this user
  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, unlocked, gender, mbti, birth_date, is_self, free_stat_scores, free_summary")
    .eq("user_id", userId)
    .order("is_self", { ascending: false })
    .order("created_at", { ascending: true });

  // If no characters, redirect to onboarding
  if (!characters || characters.length === 0) redirect("/onboarding");

  // 2. Fetch user name + coin balance for header
  const { data: user } = await supabase
    .from("users")
    .select("name, coins")
    .eq("id", userId)
    .single();

  // 3. Fetch saju chart data for each character
  const characterIds = characters.map((c) => c.id);
  const { data: charts } = await supabase
    .from("charts")
    .select("character_id, data")
    .in("character_id", characterIds)
    .eq("type", "saju");

  const chartMap = new Map<string, Record<string, unknown>>();
  if (charts) {
    for (const chart of charts) {
      chartMap.set(chart.character_id, chart.data as Record<string, unknown>);
    }
  }

  // 4. Fetch latest completed comprehensive readings for unlocked characters
  const unlockedIds = characters.filter((c) => c.unlocked).map((c) => c.id);
  const readingMap = new Map<
    string,
    { stat_scores: Record<string, number> | null; character_title: string | null }
  >();

  if (unlockedIds.length > 0) {
    const { data: readings } = await supabase
      .from("readings")
      .select("character_id, stat_scores, character_title")
      .in("character_id", unlockedIds)
      .eq("type", "comprehensive")
      .eq("status", "complete")
      .order("created_at", { ascending: false });

    if (readings) {
      for (const reading of readings) {
        // Only keep the latest reading per character
        if (!readingMap.has(reading.character_id)) {
          readingMap.set(reading.character_id, {
            stat_scores: reading.stat_scores as Record<string, number> | null,
            character_title: reading.character_title,
          });
        }
      }
    }
  }

  // Build display data for each character
  const characterSlots = characters.map((char) => {
    const sajuData = chartMap.get(char.id);
    const dayMaster = (sajuData?.dayMaster as string) ?? "";

    // Determine element from day master (결정론) — fallback "water"
    const element: ElementType = getCharacterElement(dayMaster, "water");
    const dayMasterLabel = formatDayMasterDisplay(dayMaster, {
      useShortLabel: true,
    });

    // Calculate level (age)
    const birthYear = char.birth_date
      ? new Date(char.birth_date).getFullYear()
      : 2000;
    const level = new Date().getFullYear() - birthYear;

    // Reading data (unlocked characters) or free stats (locked characters)
    const readingData = readingMap.get(char.id);
    const freeStats = char.free_stat_scores as Record<string, unknown> | null;

    const statScores = readingData?.stat_scores
      ? {
          health_score: readingData.stat_scores.health_score ?? 0,
          wealth_score: readingData.stat_scores.wealth_score ?? 0,
          love_score: readingData.stat_scores.love_score ?? 0,
          career_score: readingData.stat_scores.career_score ?? 0,
          vitality_score: readingData.stat_scores.vitality_score ?? 0,
          luck_score: readingData.stat_scores.luck_score ?? 0,
          title: (readingData.stat_scores as Record<string, unknown>).title as string | undefined,
        }
      : freeStats
        ? {
            health_score: (freeStats.health_score as number) ?? 0,
            wealth_score: (freeStats.wealth_score as number) ?? 0,
            love_score: (freeStats.love_score as number) ?? 0,
            career_score: (freeStats.career_score as number) ?? 0,
            vitality_score: (freeStats.vitality_score as number) ?? 0,
            luck_score: (freeStats.luck_score as number) ?? 0,
            title: freeStats.title as string | undefined,
          }
        : null;

    return {
      character: {
        id: char.id,
        name: char.name,
        unlocked: char.unlocked,
        gender: char.gender,
        mbti: char.mbti,
      },
      element,
      level,
      dayMasterLabel,
      statScores,
      characterTitle: readingData?.character_title ?? (freeStats?.title as string | null) ?? null,
      isSelf: char.is_self ?? false,
    };
  });

  return (
    <div className="hub-bg min-h-screen flex flex-col">
      {/* Header */}
      <HubHeader userName={user?.name ?? "플레이어"} balance={user?.coins ?? 0} />

      {/* Main content */}
      <div className="flex-1 w-full mx-auto px-4 py-5 flex flex-col gap-3 max-w-[480px]">
        {/* Section title + 컬렉션 카운터 */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="arcade-heading">{COPY.collection.title}</span>
          <CollectionCounter count={characterSlots.length} />
        </div>

        {/* Character slots */}
        {characterSlots.map((slot) => (
          <CharacterSlot
            key={slot.character.id}
            character={slot.character}
            element={slot.element}
            level={slot.level}
            dayMasterLabel={slot.dayMasterLabel}
            statScores={slot.statScores}
            characterTitle={slot.characterTitle}
            isSelf={slot.isSelf}
          />
        ))}

        {/* New character slot — 허브 전용 라이트 톤 (mypage는 별도) */}
        <Link
          href="/characters/new"
          className="hub-add-character no-underline"
          aria-label="새 캐릭터 추가"
        >
          <span className="hub-add-character-icon">＋</span>
          <span>가족·친구 추가</span>
        </Link>

        {/* Trust badge */}
        <TrustBadge />
      </div>
    </div>
  );
}
