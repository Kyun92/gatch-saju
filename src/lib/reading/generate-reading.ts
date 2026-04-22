import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateStatScores } from "@/lib/ai/stat-scorer";
import { sanitizeReadingHtml } from "@/lib/ai/sanitize-html";
import { MOCK_READINGS, MOCK_STAT_SCORES } from "@/lib/reading/mock-data";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";

/**
 * Mock 모드 활성화 여부
 * .env.local에 USE_MOCK_READINGS=true 설정 시 Gemini 호출 대신 mock 데이터 사용
 *
 * 프로덕션(NODE_ENV === "production")에서는 env 값과 무관하게 강제 false.
 * 실수로 프로덕션 env에 해당 플래그가 주입돼도 실결제 → mock 데이터 참사 방지.
 */
const USE_MOCK =
  process.env.NODE_ENV !== "production" &&
  process.env.USE_MOCK_READINGS === "true";

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
  type: "comprehensive" | "yearly" | "compatibility" | "love" | "career" | "wealth" | "health" | "study",
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

    // ──────────────────────────────────────────
    // Mock 모드: Gemini 호출 없이 즉시 완료
    // ──────────────────────────────────────────
    if (USE_MOCK) {
      console.info(`[MOCK] Reading ${readingId} (${type}) — using mock data`);

      // 실제 로딩 느낌을 위해 2초 딜레이
      await new Promise((r) => setTimeout(r, 2000));

      const mockContent = MOCK_READINGS[type] ?? MOCK_READINGS.comprehensive;
      const isCmp = type === "comprehensive";

      await supabase
        .from("readings")
        .update({
          status: "complete",
          content: mockContent,
          stat_scores: isCmp ? MOCK_STAT_SCORES : null,
          character_title: isCmp ? MOCK_STAT_SCORES.title : null,
          tokens_used: 0,
        })
        .eq("id", readingId);

      if (isCmp) {
        await supabase
          .from("characters")
          .update({ unlocked: true })
          .eq("id", characterId);
      }
      return;
    }

    // ──────────────────────────────────────────
    // Live 모드: Gemini API 호출
    // ──────────────────────────────────────────

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

    // 4-5. stat scores + sanitize (comprehensive only)
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
