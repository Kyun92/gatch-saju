import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCharacterPreset } from "@/lib/character/get-preset";
import { getCharacterLevel } from "@/lib/character/get-level";
import CharacterHero from "@/components/character/CharacterHero";
import ProfileCard from "@/components/reading/ProfileCard";
import StatGrid from "@/components/reading/StatGrid";
import ReadingAccordion from "@/components/reading/ReadingAccordion";
import ReadingCTA from "@/components/reading/ReadingCTA";
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
      "id, status, content, stat_scores, character_title, charts_data, created_at",
    )
    .eq("id", id)
    .eq("user_id", session.user.userId)
    .single();

  if (error || !reading) {
    redirect("/reading");
  }

  // If still generating, redirect to generating page
  if (reading.status === "generating" || reading.status === "pending") {
    redirect(`/reading/generating/${id}`);
  }

  // If failed, show error
  if (reading.status === "error") {
    return (
      <div
        className="w-full mx-auto px-4 py-6 text-center"
        style={{ maxWidth: "768px", minHeight: "100vh" }}
      >
        <h1
          className="text-xl mb-4"
          style={{ fontFamily: "var(--font-pixel)", color: "#d04040" }}
        >
          감정 실패
        </h1>
        <p className="text-sm" style={{ color: "#4a3e2c" }}>
          운세 감정 중 오류가 발생했습니다. 다시 시도해주세요.
        </p>
      </div>
    );
  }

  // Fetch user for birth info
  const { data: user } = await supabase
    .from("users")
    .select("name, birth_date, birth_time, gender, mbti")
    .eq("id", session.user.userId)
    .single();

  const chartsData = reading.charts_data as {
    saju?: { dayMaster?: string };
  } | null;
  const dayMaster = chartsData?.saju?.dayMaster ?? "壬";
  const gender = (user?.gender as "male" | "female") ?? "male";
  const preset = getCharacterPreset(dayMaster, gender);
  const level = user?.birth_date
    ? getCharacterLevel(user.birth_date)
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

  const avatarUrl = `/characters/${preset?.element ?? "water"}-${gender}.png`;
  const dayMasterDisplay = `${dayMaster}${preset?.element === "wood" ? "木" : preset?.element === "fire" ? "火" : preset?.element === "earth" ? "土" : preset?.element === "metal" ? "金" : "水"}`;
  const htmlContent = reading.content ?? "";
  const keywords = extractKeywords(htmlContent);

  return (
    <div
      className="w-full mx-auto px-4 py-6"
      style={{ maxWidth: "768px", minHeight: "100vh" }}
    >
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h1
          className="text-xl"
          style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
        >
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
        element={preset?.element ?? "water"}
        mbti={user?.mbti}
        keywords={keywords}
      />

      <div className="mt-6" />

      {/* 프로필 카드 */}
      <ProfileCard
        name={user?.name ?? "모험자"}
        birthDate={user?.birth_date ?? "-"}
        birthTime={user?.birth_time}
        gender={gender}
        dayMaster={dayMasterDisplay}
        mbti={user?.mbti}
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
