import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateComprehensiveReading } from "@/lib/ai/gemini";
import { generateStatScores } from "@/lib/ai/stat-scorer";
import { sanitizeReadingHtml } from "@/lib/ai/sanitize-html";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { characterId } = (await request.json()) as { characterId: string };
    if (!characterId) {
      return NextResponse.json({ error: "캐릭터 ID가 필요합니다" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const userId = session.user.userId;

    // Get character birth info + ownership check
    const { data: character, error: characterError } = await supabase
      .from("characters")
      .select("id, name, birth_date, birth_time, birth_city, birth_lat, birth_lng, gender, timezone, mbti")
      .eq("id", characterId)
      .eq("user_id", userId)
      .single();

    if (characterError || !character) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    // Create reading row with pending status
    const readingId = uuidv4();
    const { error: insertError } = await supabase.from("readings").insert({
      id: readingId,
      character_id: characterId,
      type: "comprehensive",
      status: "pending",
    });

    if (insertError) {
      console.error("Failed to create reading:", insertError);
      return NextResponse.json({ error: "감정 생성에 실패했습니다" }, { status: 500 });
    }

    // Run generation in background
    generateReadingAsync(readingId, character, characterId).catch((e) => {
      console.error("Background reading generation failed:", e);
    });

    return NextResponse.json({ readingId });
  } catch (e) {
    console.error("Reading generate error:", e);
    return NextResponse.json({ error: "감정 생성 중 오류가 발생했습니다" }, { status: 500 });
  }
}

async function generateReadingAsync(
  readingId: string,
  character: {
    name: string | null;
    birth_date: string;
    birth_time: string;
    birth_city: string;
    birth_lat: number;
    birth_lng: number;
    gender: "male" | "female";
    timezone: string | null;
    mbti: string | null;
  },
  characterId: string,
) {
  const supabase = createServerSupabaseClient();

  try {
    // Set status to generating
    await supabase
      .from("readings")
      .update({ status: "generating" })
      .eq("id", readingId);

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

    // Step 1: Generate comprehensive reading (Gemini Pro)
    const { html: rawHtml, tokensUsed } = await generateComprehensiveReading(
      birthInfo.name,
      charts,
      character.mbti,
    );

    // Step 2: Generate stat scores (Gemini Flash, separate call)
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

    const statScores = await generateStatScores(rawHtml, chartsSummary);

    // Sanitize HTML
    const sanitizedHtml = sanitizeReadingHtml(rawHtml);

    // Save completed reading
    await supabase
      .from("readings")
      .update({
        status: "complete",
        content: sanitizedHtml,
        stat_scores: statScores,
        character_title: statScores.title,
        tokens_used: tokensUsed,
        charts_data: charts,
      })
      .eq("id", readingId);

    // Unlock character after successful reading
    await supabase.from("characters").update({ unlocked: true }).eq("id", characterId);
  } catch (e) {
    console.error(`Reading generation failed for ${readingId}:`, e);

    // Retry once
    try {
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
      const { html: rawHtml, tokensUsed } = await generateComprehensiveReading(
        birthInfo.name,
        charts,
        character.mbti,
      );

      const chartsSummary = JSON.stringify(
        {
          saju: {
            fourPillars: charts.saju.fourPillars,
            dayMaster: charts.saju.dayMaster,
            fiveElements: charts.saju.fiveElements,
          },
        },
        null,
        2,
      );

      const statScores = await generateStatScores(rawHtml, chartsSummary);
      const sanitizedHtml = sanitizeReadingHtml(rawHtml);

      await supabase
        .from("readings")
        .update({
          status: "complete",
          content: sanitizedHtml,
          stat_scores: statScores,
          character_title: statScores.title,
          tokens_used: tokensUsed,
          charts_data: charts,
        })
        .eq("id", readingId);

      // Unlock character after successful retry
      await supabase.from("characters").update({ unlocked: true }).eq("id", characterId);
    } catch (retryError) {
      console.error(`Retry also failed for ${readingId}:`, retryError);
      // 내부 에러 상세는 서버 로그에만 남기고, 사용자에게는 일반 메시지만 노출
      await supabase
        .from("readings")
        .update({
          status: "error",
          error_message: "감정 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        })
        .eq("id", readingId);
    }
  }
}
