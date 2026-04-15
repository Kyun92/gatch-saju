import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CharacterHero from "@/components/character/CharacterHero";
import SkillTree from "@/components/hub/SkillTree";

type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

const ELEMENT_MAP: Record<string, ElementType> = {
  "木": "wood", "火": "fire", "土": "earth", "金": "metal", "水": "water",
};

const ELEMENT_LABEL: Record<ElementType, string> = {
  wood: "목(木)의 용사", fire: "화(火)의 전사", earth: "토(土)의 현자",
  metal: "금(金)의 기사", water: "수(水)의 술사",
};

interface CharacterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const { id: characterId } = await params;
  const supabase = createServerSupabaseClient();

  // 캐릭터 조회 + 소유권 확인
  const { data: character } = await supabase
    .from("characters")
    .select("id, name, birth_date, gender, mbti, unlocked, user_id")
    .eq("id", characterId)
    .single();

  if (!character || character.user_id !== session.user.userId) redirect("/");

  // 사주 차트 (element 계산)
  const { data: sajuChart } = await supabase
    .from("charts")
    .select("data")
    .eq("character_id", characterId)
    .eq("type", "saju")
    .single();

  const sajuData = sajuChart?.data as Record<string, unknown> | null;
  const dayMaster = (sajuData?.dayMaster as string) ?? "";
  const fiveElements = sajuData?.fiveElements as Record<string, number> | null;

  let element: ElementType = "water";
  if (fiveElements) {
    const maxEntry = Object.entries(fiveElements).reduce((a, b) => a[1] >= b[1] ? a : b);
    element = ELEMENT_MAP[maxEntry[0]] ?? "water";
  }

  const birthYear = character.birth_date ? new Date(character.birth_date).getFullYear() : 2000;
  const level = new Date().getFullYear() - birthYear;
  const classTitle = dayMaster ? `${dayMaster} · ${ELEMENT_LABEL[element]}` : ELEMENT_LABEL[element];

  // 구매한 reading 타입 목록 + 최신 reading ID
  const { data: readings } = await supabase
    .from("readings")
    .select("id, type")
    .eq("character_id", characterId)
    .eq("status", "complete")
    .order("created_at", { ascending: false });

  const purchasedReadings = [...new Set((readings ?? []).map((r) => r.type))];
  // type → 최신 reading ID 맵
  const readingIdMap: Record<string, string> = {};
  for (const r of readings ?? []) {
    if (!readingIdMap[r.type]) readingIdMap[r.type] = r.id;
  }

  // 최신 종합감정 칭호
  const { data: latestReading } = await supabase
    .from("readings")
    .select("character_title")
    .eq("character_id", characterId)
    .eq("type", "comprehensive")
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div
      className="w-full mx-auto px-4 py-6"
      style={{ maxWidth: "480px", minHeight: "100vh" }}
    >
      {/* 캐릭터 히어로 */}
      <section
        className={`element-bg-${element} flex flex-col items-center py-6 px-4 gap-1`}
        style={{ marginBottom: "16px", border: "2px solid" }}
      >
        <CharacterHero
          avatarUrl={`/characters/${element}-${character.gender}.png`}
          dayMaster={dayMaster}
          level={level}
          classTitle={classTitle}
          characterTitle={latestReading?.character_title ?? character.name}
          element={element}
          mbti={character.mbti ?? null}
        />
      </section>

      {/* 스킬트리 */}
      <SkillTree
        characterId={character.id}
        characterName={character.name}
        unlocked={character.unlocked}
        purchasedReadings={purchasedReadings}
        readingIdMap={readingIdMap}
      />
    </div>
  );
}
