import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HubHeader from "@/components/hub/HubHeader";
import CharacterSlot from "@/components/hub/CharacterSlot";
import NewCharacterSlot from "@/components/hub/NewCharacterSlot";
import TrustBadge from "@/components/hub/TrustBadge";
import type { ElementType } from "@/lib/character/get-preset";

const HEAVENLY_STEM_ELEMENT: Record<string, ElementType> = {
  "甲": "wood", "乙": "wood",
  "丙": "fire", "丁": "fire",
  "戊": "earth", "己": "earth",
  "庚": "metal", "辛": "metal",
  "壬": "water", "癸": "water",
};

export default async function HubPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const userId = session.user.userId;

  // 1. Fetch all characters for this user
  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, unlocked, gender, mbti, birth_date, is_self")
    .eq("user_id", userId)
    .order("is_self", { ascending: false })
    .order("created_at", { ascending: true });

  // If no characters, redirect to onboarding
  if (!characters || characters.length === 0) redirect("/onboarding");

  // 2. Fetch user name for header
  const { data: user } = await supabase
    .from("users")
    .select("name")
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
    const fiveElements = sajuData?.fiveElements as Record<string, number> | null;

    // Determine element from day master stem
    let element: ElementType = "water";
    if (dayMaster) {
      const stem = dayMaster.charAt(0);
      element = HEAVENLY_STEM_ELEMENT[stem] ?? "water";
    } else if (fiveElements) {
      const maxEntry = Object.entries(fiveElements).reduce((a, b) =>
        a[1] >= b[1] ? a : b
      );
      const elementMap: Record<string, ElementType> = {
        "木": "wood", "火": "fire", "土": "earth", "金": "metal", "水": "water",
      };
      element = elementMap[maxEntry[0]] ?? "water";
    }

    // Calculate level (age)
    const birthYear = char.birth_date
      ? new Date(char.birth_date).getFullYear()
      : 2000;
    const level = new Date().getFullYear() - birthYear;

    // Reading data
    const readingData = readingMap.get(char.id);

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
      dayMaster,
      statScores: readingData?.stat_scores
        ? {
            health_score: readingData.stat_scores.health_score ?? 0,
            wealth_score: readingData.stat_scores.wealth_score ?? 0,
            love_score: readingData.stat_scores.love_score ?? 0,
            career_score: readingData.stat_scores.career_score ?? 0,
            vitality_score: readingData.stat_scores.vitality_score ?? 0,
            luck_score: readingData.stat_scores.luck_score ?? 0,
            title: (readingData.stat_scores as Record<string, unknown>).title as string | undefined,
          }
        : null,
      characterTitle: readingData?.character_title ?? null,
    };
  });

  return (
    <div className="hub-bg min-h-screen flex flex-col">
      {/* Header */}
      <HubHeader userName={user?.name ?? "모험가"} />

      {/* Main content */}
      <div
        className="flex-1 w-full mx-auto px-4 py-5 flex flex-col gap-3"
        style={{ maxWidth: "480px" }}
      >
        {/* Section title */}
        <div className="pixel-divider">캐릭터 선택</div>

        {/* Character slots */}
        {characterSlots.map((slot) => (
          <CharacterSlot
            key={slot.character.id}
            character={slot.character}
            element={slot.element}
            level={slot.level}
            dayMaster={slot.dayMaster}
            statScores={slot.statScores}
            characterTitle={slot.characterTitle}
          />
        ))}

        {/* New character slot */}
        <NewCharacterSlot />

        {/* Trust badge */}
        <TrustBadge />
      </div>
    </div>
  );
}
