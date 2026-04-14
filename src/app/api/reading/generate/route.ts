import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateComprehensiveReading } from "@/lib/ai/gemini";
import { generateStatScores } from "@/lib/ai/stat-scorer";
import { sanitizeReadingHtml } from "@/lib/ai/sanitize-html";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const userId = session.user.userId;

    // Get user birth info
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("name, birth_date, birth_time, birth_city, birth_lat, birth_lng, gender, timezone, mbti")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다" }, { status: 404 });
    }

    // Create reading row with pending status
    const readingId = uuidv4();
    const { error: insertError } = await supabase.from("readings").insert({
      id: readingId,
      user_id: userId,
      type: "comprehensive",
      status: "pending",
    });

    if (insertError) {
      console.error("Failed to create reading:", insertError);
      return NextResponse.json({ error: "감정 생성에 실패했습니다" }, { status: 500 });
    }

    // Run generation in background
    generateReadingAsync(readingId, user, userId).catch((e) => {
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
  user: {
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
  userId: string,
) {
  const supabase = createServerSupabaseClient();

  try {
    // Set status to generating
    await supabase
      .from("readings")
      .update({ status: "generating" })
      .eq("id", readingId);

    const birthInfo: BirthInfo = {
      name: user.name ?? "",
      birthDate: user.birth_date,
      birthTime: user.birth_time,
      birthCity: user.birth_city,
      birthLat: user.birth_lat,
      birthLng: user.birth_lng,
      gender: user.gender,
      timezone: user.timezone ?? "Asia/Seoul",
    };

    const charts: AllCharts = generateAllCharts(birthInfo);

    // Step 1: Generate comprehensive reading (Gemini Pro)
    const { html: rawHtml, tokensUsed } = await generateComprehensiveReading(
      birthInfo.name,
      charts,
      user.mbti,
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
  } catch (e) {
    console.error(`Reading generation failed for ${readingId}:`, e);

    // Retry once
    try {
      const birthInfo: BirthInfo = {
        name: user.name ?? "",
        birthDate: user.birth_date,
        birthTime: user.birth_time,
        birthCity: user.birth_city,
        birthLat: user.birth_lat,
        birthLng: user.birth_lng,
        gender: user.gender,
        timezone: user.timezone ?? "Asia/Seoul",
      };

      const charts: AllCharts = generateAllCharts(birthInfo);
      const { html: rawHtml, tokensUsed } = await generateComprehensiveReading(
        birthInfo.name,
        charts,
        user.mbti,
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
