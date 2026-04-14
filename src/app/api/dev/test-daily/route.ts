import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateDailyFortune } from "@/lib/ai/gemini";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";

/** Dev-only: 인증 없이 일일운세 생성 테스트 */
export async function GET(request: NextRequest) {
  const characterId = new URL(request.url).searchParams.get("characterId");
  if (!characterId) {
    return NextResponse.json({ error: "characterId 필요" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // 캐릭터 조회
  const { data: character, error } = await supabase
    .from("characters")
    .select("name, birth_date, birth_time, birth_city, birth_lat, birth_lng, gender, timezone, mbti")
    .eq("id", characterId)
    .single();

  if (error || !character) {
    return NextResponse.json({ error: "캐릭터 없음", detail: error }, { status: 404 });
  }

  // 차트 생성
  const birthInfo: BirthInfo = {
    name: character.name ?? "",
    birthDate: character.birth_date,
    birthTime: character.birth_time,
    birthCity: character.birth_city,
    birthLat: character.birth_lat,
    birthLng: character.birth_lng,
    gender: character.gender as "male" | "female",
    timezone: character.timezone ?? "Asia/Seoul",
  };

  const charts: AllCharts = generateAllCharts(birthInfo);

  // 오늘의 간지 (hardcoded for now)
  const todayGanZhi = {
    yearGanZhi: "乙巳",
    monthGanZhi: "庚辰",
    dayGanZhi: "甲子",
  };

  // Gemini Flash 호출
  try {
    const { text, tokensUsed } = await generateDailyFortune(
      birthInfo.name,
      charts,
      todayGanZhi,
      character.mbti,
    );

    console.log("[test-daily] fortune length:", text.length, "tokens:", tokensUsed);
    console.log("[test-daily] fortune full text:", text);

    return new Response(JSON.stringify({
      success: true,
      character: character.name,
      tokensUsed,
      fortuneLength: text.length,
      fortune: text,
    }), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    return NextResponse.json({
      error: "Gemini 호출 실패",
      detail: e instanceof Error ? e.message : String(e),
    }, { status: 500 });
  }
}
