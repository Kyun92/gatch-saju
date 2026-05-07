import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateDailyFortune } from "@/lib/ai/gemini";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";

/**
 * Dev-only: 인증 없이 일일운세 생성 테스트.
 *
 * 보안 가드 (이중):
 *   1) production NODE_ENV에서는 즉시 404 (middleware의 DEV_ONLY_PATHS 차단과 별도 방어선)
 *   2) NextAuth 세션 + 캐릭터 소유권 검증 — 다른 dev 계정의 캐릭터 무단 조회 차단
 */
export async function GET(request: NextRequest) {
  // 1차 가드: production에서 절대 노출 금지
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2차 가드: 인증 + 소유권
  const session = await auth();
  if (!session?.user?.userId) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const characterId = new URL(request.url).searchParams.get("characterId");
  if (!characterId) {
    return NextResponse.json({ error: "characterId 필요" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // 캐릭터 조회 + 소유권 검증
  const { data: character, error } = await supabase
    .from("characters")
    .select(
      "name, birth_date, birth_time, birth_city, birth_lat, birth_lng, gender, timezone, mbti, user_id",
    )
    .eq("id", characterId)
    .single();

  if (error || !character) {
    return NextResponse.json({ error: "캐릭터 없음" }, { status: 404 });
  }

  if (character.user_id !== session.user.userId) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
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

    return new Response(
      JSON.stringify({
        success: true,
        character: character.name,
        tokensUsed,
        fortuneLength: text.length,
        fortune: text,
      }),
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (e) {
    console.error("[test-daily] Gemini error:", e);
    return NextResponse.json(
      { error: "일일운세 생성 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
