import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CharacterHero from "@/components/character/CharacterHero";
import CharacterActions from "@/components/character/CharacterActions";
import SkillTree from "@/components/hub/SkillTree";
import {
  formatDayMasterDisplay,
  getCharacterElement,
  type Element as ElementType,
} from "@/lib/copy/day-master";

/** 오행별 RPG 클래스 라벨 (한자 노출 없는 비유체 칭호). */
const ELEMENT_CLASS_LABEL: Record<ElementType, string> = {
  wood: "나무 기운의 용사",
  fire: "불꽃 기운의 전사",
  earth: "흙 기운의 현자",
  metal: "쇠 기운의 기사",
  water: "물 기운의 술사",
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
    .select("id, name, birth_date, gender, mbti, unlocked, user_id, is_self")
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

  // element는 dayMaster 결정론 매핑 (fiveElements maxEntry 금지)
  const element: ElementType = getCharacterElement(dayMaster, "water");

  const birthYear = character.birth_date ? new Date(character.birth_date).getFullYear() : 2000;
  const level = new Date().getFullYear() - birthYear;

  // 비유체 메인 + 클래스 칭호 (예: "깊은 바다 타입 · 물 기운의 술사")
  const dayMasterDisplay = formatDayMasterDisplay(dayMaster) || "";
  const classTitle = dayMasterDisplay
    ? `${dayMasterDisplay} · ${ELEMENT_CLASS_LABEL[element]}`
    : ELEMENT_CLASS_LABEL[element];

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
          dayMaster={dayMasterDisplay || character.name}
          level={level}
          classTitle={classTitle}
          characterTitle={latestReading?.character_title ?? character.name}
          element={element}
          mbti={character.mbti ?? null}
        />
      </section>

      {/* 캐릭터 편집/삭제 */}
      <div className="mb-4">
        <CharacterActions
          characterId={character.id}
          characterName={character.name}
          mbti={character.mbti ?? null}
          isSelf={character.is_self}
        />
      </div>

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
