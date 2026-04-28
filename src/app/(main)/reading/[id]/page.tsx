import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCharacterPreset } from "@/lib/character/get-preset";
import { getCharacterLevel } from "@/lib/character/get-level";
import {
  formatDayMasterDisplay,
  getCharacterElement,
} from "@/lib/copy/day-master";
import {
  getHeaderTitle,
  getPossessive,
} from "@/lib/copy/character-vocative";
import CharacterHero from "@/components/character/CharacterHero";
import ProfileCard from "@/components/reading/ProfileCard";
import StatGrid from "@/components/reading/StatGrid";
import ReadingAccordion from "@/components/reading/ReadingAccordion";
import CompatibilityAccordion from "@/components/reading/CompatibilityAccordion";
import ReadingCTA from "@/components/reading/ReadingCTA";
import YearlyReadingView from "@/components/reading/YearlyReadingView";
import CategoryReadingView from "@/components/reading/CategoryReadingView";
import type { CategoryType } from "@/components/reading/CategoryReadingView";
import PixelDivider from "@/components/ui/PixelDivider";
import type { StatScores } from "@/lib/ai/stat-scorer";

interface ReadingDetailPageProps {
  params: Promise<{ id: string }>;
}

/** Extract keywords from intro section highlight-box */
function extractKeywords(htmlContent: string): string | undefined {
  const introRegex =
    /<section[^>]*id="intro"[^>]*>[\s\S]*?<\/section>/i;
  const introMatch = htmlContent.match(introRegex);
  if (!introMatch) return undefined;

  const highlightRegex =
    /<div[^>]*class="highlight-box"[^>]*>[\s\S]*?<\/div>/i;
  const highlightMatch = introMatch[0].match(highlightRegex);
  if (!highlightMatch) return undefined;

  // Look for "핵심 키워드:" line
  const keywordRegex =
    /핵심\s*키워드[：:]?\s*<\/strong>\s*([^<]+)/i;
  const keywordMatch = highlightMatch[0].match(keywordRegex);
  if (keywordMatch) return keywordMatch[1].trim();

  return undefined;
}

export default async function ReadingDetailPage({
  params,
}: ReadingDetailPageProps) {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  // Fetch reading
  const { data: reading, error } = await supabase
    .from("readings")
    .select(
      "id, status, content, stat_scores, character_title, charts_data, created_at, character_id, character_id_2, type, year",
    )
    .eq("id", id)
    .single();

  if (error || !reading) {
    redirect("/reading");
  }

  // Verify ownership via character
  const { data: character } = await supabase
    .from("characters")
    .select("id, user_id, name, birth_date, birth_time, gender, mbti, is_self")
    .eq("id", reading.character_id)
    .single();

  if (!character || character.user_id !== session.user.userId) {
    redirect("/");
  }

  // If still generating, redirect to generating page
  if (reading.status === "generating" || reading.status === "pending") {
    redirect(`/reading/generating/${id}`);
  }

  // If failed, show error
  if (reading.status === "error") {
    return (
      <div className="w-full mx-auto px-4 py-6 text-center max-w-[768px] min-h-screen">
        <h1 className="text-xl mb-4 font-[family-name:var(--font-pixel)] text-[#d04040]">
          감정 실패
        </h1>
        <p className="text-sm text-[#4a3e2c]">
          운세 감정 중 오류가 발생했습니다. 다시 시도해주세요.
        </p>
      </div>
    );
  }

  const chartsData = reading.charts_data as {
    saju?: { dayMaster?: string };
  } | null;
  const dayMaster = chartsData?.saju?.dayMaster ?? "";
  const gender = (character.gender as "male" | "female") ?? "male";
  const preset = dayMaster ? getCharacterPreset(dayMaster, gender) : null;
  const level = character.birth_date
    ? getCharacterLevel(character.birth_date)
    : 1;

  const statScores = (reading.stat_scores ?? {
    health_score: 50,
    wealth_score: 50,
    love_score: 50,
    career_score: 50,
    vitality_score: 50,
    luck_score: 50,
    title: "운명의 여행자",
  }) as StatScores;

  const element = preset?.element ?? getCharacterElement(dayMaster, "water");
  const avatarUrl = `/characters/${element}-${gender}.png`;
  // 비유체 메인 + 한자 괄호 보조 (CLAUDE.md "한자 괄호 보조만" 규칙)
  const dayMasterDisplay =
    formatDayMasterDisplay(dayMaster, { showHanja: true }) || "운명의 여행자";
  const htmlContent = reading.content ?? "";
  const keywords = extractKeywords(htmlContent);
  const readingType = (reading.type as string) ?? "comprehensive";
  const readingYear = (reading.year as number) ?? new Date().getFullYear();

  // 호칭 분기 — 외곽 헤더만 본인/타인 분기. LLM HTML 본문(reading.content)은 변경하지 않는다.
  const characterName = character.name ?? "모험자";
  const isSelf = character.is_self ?? false;
  const vocative = { name: characterName, is_self: isSelf };
  const possessive = getPossessive(vocative);

  // Compatibility reading layout
  if (readingType === "compatibility") {
    // Fetch second character if available
    let character2Name = "상대방";
    let character2IsSelf = false;
    let character2Element: string = "water";
    let character2Gender: "male" | "female" = "male";
    let character2Level = 1;

    if (reading.character_id_2) {
      const { data: char2 } = await supabase
        .from("characters")
        .select("id, name, birth_date, gender, is_self")
        .eq("id", reading.character_id_2)
        .single();

      if (char2) {
        character2Name = char2.name ?? "상대방";
        character2IsSelf = char2.is_self ?? false;
        character2Gender = (char2.gender as "male" | "female") ?? "male";
        character2Level = char2.birth_date
          ? getCharacterLevel(char2.birth_date)
          : 1;

        // Get second character's element from charts
        const { data: chart2 } = await supabase
          .from("charts")
          .select("data")
          .eq("character_id", char2.id)
          .eq("type", "saju")
          .single();

        if (chart2) {
          const chart2Data = chart2.data as { dayMaster?: string };
          const dm2 = chart2Data?.dayMaster ?? "";
          character2Element = getCharacterElement(dm2, "water");
        }
      }
    }

    // 궁합 호칭 — 본인+타인 vs 타인+타인 분기
    const compatLabel = isSelf
      ? `당신 & ${character2Name}님`
      : character2IsSelf
        ? `당신 & ${characterName}님`
        : `${characterName}님 & ${character2Name}님`;

    return (
      <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-[family-name:var(--font-pixel)] text-[#b8883c]">
            궁합 감정서
          </h1>
          <p className="text-sm mt-2 font-[family-name:var(--font-pixel)] text-[#8a8070]">
            {compatLabel}
          </p>
        </div>

        {/* VS Layout */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 border-2 border-[#b8944c] flex items-center justify-center bg-[#faf7f2]">
              <img
                src={`/characters/${element}-${gender}.png`}
                alt={character.name ?? ""}
                className="w-14 h-14 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <span className="text-xs font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
              {character.name ?? "모험자"}
            </span>
            <span className="text-[0.625rem] font-[family-name:var(--font-pixel)] text-[#8a8070]">
              Lv.{level}
            </span>
          </div>

          <span className="text-2xl font-[family-name:var(--font-pixel)] text-[#d04040]">
            VS
          </span>

          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 border-2 border-[#b8944c] flex items-center justify-center bg-[#faf7f2]">
              <img
                src={`/characters/${character2Element}-${character2Gender}.png`}
                alt={character2Name}
                className="w-14 h-14 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <span className="text-xs font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
              {character2Name}
            </span>
            <span className="text-[0.625rem] font-[family-name:var(--font-pixel)] text-[#8a8070]">
              Lv.{character2Level}
            </span>
          </div>
        </div>

        <PixelDivider label="궁합 상세" className="my-6" />

        {/* Compatibility accordion */}
        <CompatibilityAccordion htmlContent={htmlContent} />

        {/* CTA */}
        <ReadingCTA />

        <div className="h-16" />
      </div>
    );
  }

  // Yearly reading layout
  if (readingType === "yearly") {
    return (
      <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-[family-name:var(--font-pixel)] text-[#b8883c]">
            {readingYear}년 운세 감정서
          </h1>
          <p className="text-sm mt-2 font-[family-name:var(--font-pixel)] text-[#8a8070]">
            {getHeaderTitle(vocative, "년운 분석")}
          </p>
        </div>

        {/* 캐릭터 히어로 */}
        <CharacterHero
          avatarUrl={avatarUrl}
          dayMaster={dayMasterDisplay}
          level={level}
          classTitle={preset?.className ?? "운명의 여행자"}
          characterTitle={reading.character_title ?? statScores.title}
          element={element}
          mbti={character.mbti}
        />

        <div className="mt-6" />

        {/* 프로필 카드 */}
        <ProfileCard
          name={character.name ?? "모험자"}
          birthDate={character.birth_date ?? "-"}
          birthTime={character.birth_time}
          gender={gender}
          dayMaster={dayMasterDisplay}
          mbti={character.mbti}
        />

        <PixelDivider label={`${readingYear}년 운세`} className="my-6" />

        {/* 년운 전용 뷰 */}
        <YearlyReadingView
          content={htmlContent}
          year={readingYear}
          characterName={character.name ?? "모험자"}
        />

        {/* 하단 CTA */}
        <ReadingCTA />

        {/* 하단 네비 공간 확보 */}
        <div className="h-16" />
      </div>
    );
  }

  // Category reading layout (love/career/wealth/health/study)
  const CATEGORY_TYPES = ["love", "career", "wealth", "health", "study"];
  const CATEGORY_TITLES: Record<string, string> = {
    love: "연애운 감정서",
    career: "직업운 감정서",
    wealth: "금전운 감정서",
    health: "건강운 감정서",
    study: "학업운 감정서",
  };

  if (CATEGORY_TYPES.includes(readingType)) {
    return (
      <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-[family-name:var(--font-pixel)] text-[#b8883c]">
            {CATEGORY_TITLES[readingType] ?? "운세 감정서"}
          </h1>
          <p className="text-sm mt-2 font-[family-name:var(--font-pixel)] text-[#8a8070]">
            {`${possessive} 특화 분석`}
          </p>
        </div>

        {/* 캐릭터 히어로 */}
        <CharacterHero
          avatarUrl={avatarUrl}
          dayMaster={dayMasterDisplay}
          level={level}
          classTitle={preset?.className ?? "운명의 여행자"}
          characterTitle={reading.character_title ?? statScores.title}
          element={element}
          mbti={character.mbti}
        />

        <div className="mt-6" />

        {/* 프로필 카드 */}
        <ProfileCard
          name={character.name ?? "모험자"}
          birthDate={character.birth_date ?? "-"}
          birthTime={character.birth_time}
          gender={gender}
          dayMaster={dayMasterDisplay}
          mbti={character.mbti}
        />

        <PixelDivider label={CATEGORY_TITLES[readingType] ?? "상세 감정"} className="my-6" />

        {/* 카테고리 전용 뷰 */}
        <CategoryReadingView
          content={htmlContent}
          category={readingType as CategoryType}
          characterName={character.name ?? "모험자"}
        />

        {/* 하단 CTA */}
        <ReadingCTA />

        {/* 하단 네비 공간 확보 */}
        <div className="h-16" />
      </div>
    );
  }

  // Comprehensive reading layout (default)
  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-[family-name:var(--font-pixel)] text-[#b8883c]">
          종합 운세 감정서
        </h1>
      </div>

      {/* 캐릭터 히어로 */}
      <CharacterHero
        avatarUrl={avatarUrl}
        dayMaster={dayMasterDisplay}
        level={level}
        classTitle={preset?.className ?? "운명의 여행자"}
        characterTitle={reading.character_title ?? statScores.title}
        element={element}
        mbti={character.mbti}
        keywords={keywords}
      />

      <div className="mt-6" />

      {/* 프로필 카드 */}
      <ProfileCard
        name={character.name ?? "모험자"}
        birthDate={character.birth_date ?? "-"}
        birthTime={character.birth_time}
        gender={gender}
        dayMaster={dayMasterDisplay}
        mbti={character.mbti}
      />

      <PixelDivider label="능력치" className="my-6" />

      {/* 스탯 그리드 */}
      <StatGrid statScores={statScores} />

      <PixelDivider label="상세 감정" className="my-6" />

      {/* 아코디언 */}
      <ReadingAccordion htmlContent={htmlContent} />

      {/* 하단 CTA */}
      <ReadingCTA />

      {/* 하단 네비 공간 확보 */}
      <div className="h-16" />
    </div>
  );
}
