import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateStatScores } from "@/lib/ai/stat-scorer";
import { sanitizeReadingHtml } from "@/lib/ai/sanitize-html";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";

export interface CharacterData {
  name: string | null;
  birth_date: string;
  birth_time: string;
  birth_city: string;
  birth_lat: number;
  birth_lng: number;
  gender: "male" | "female";
  timezone: string | null;
  mbti: string | null;
}

export async function executeReadingGeneration(
  readingId: string,
  characterId: string,
  type: "comprehensive" | "yearly",
  generatorFn: (
    birthInfo: BirthInfo,
    charts: AllCharts,
  ) => Promise<{ content: string; tokensUsed: number }>,
  character: CharacterData,
): Promise<void> {
  const supabase = createServerSupabaseClient();

  const attempt = async () => {
    // 1. status = "generating"
    await supabase
      .from("readings")
      .update({ status: "generating" })
      .eq("id", readingId);

    // 2. birthInfo + charts
    const birthInfo: BirthInfo = {
      name: character.name ?? "",
      birthDate: character.birth_date,
      birthTime: character.birth_time,
      birthCity: character.birth_city,
      birthLat: character.birth_lat,
      birthLng: character.birth_lng,
      gender: character.gender,
      timezone: character.timezone ?? "Asia/Seoul",
    };

    const charts: AllCharts = generateAllCharts(birthInfo);

    // 3. generatorFn 호출
    const { content: rawHtml, tokensUsed } = await generatorFn(
      birthInfo,
      charts,
    );

    // 4-5. stat scores + sanitize (comprehensive만)
    let statScores = null;
    let characterTitle = null;
    let sanitizedHtml = rawHtml;

    if (type === "comprehensive") {
      const chartsSummary = JSON.stringify(
        {
          saju: {
            fourPillars: charts.saju.fourPillars,
            dayMaster: charts.saju.dayMaster,
            fiveElements: charts.saju.fiveElements,
            tenGods: charts.saju.tenGods,
          },
        },
        null,
        2,
      );
      statScores = await generateStatScores(rawHtml, chartsSummary);
      characterTitle = statScores.title;
      sanitizedHtml = sanitizeReadingHtml(rawHtml);
    } else {
      sanitizedHtml = sanitizeReadingHtml(rawHtml);
    }

    // 6. status = "complete"
    await supabase
      .from("readings")
      .update({
        status: "complete",
        content: sanitizedHtml,
        stat_scores: statScores,
        character_title: characterTitle,
        tokens_used: tokensUsed,
        charts_data: charts,
      })
      .eq("id", readingId);

    // Unlock character after successful comprehensive reading
    if (type === "comprehensive") {
      await supabase
        .from("characters")
        .update({ unlocked: true })
        .eq("id", characterId);
    }
  };

  try {
    await attempt();
  } catch (e) {
    console.error(`Reading generation failed for ${readingId}:`, e);

    // Retry once
    try {
      await attempt();
    } catch (retryError) {
      console.error(`Retry also failed for ${readingId}:`, retryError);
      await supabase
        .from("readings")
        .update({
          status: "error",
          error_message:
            "감정 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        })
        .eq("id", readingId);
    }
  }
}
