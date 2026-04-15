import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateDailyFortune } from "@/lib/ai/gemini";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const characterId = new URL(request.url).searchParams.get("characterId");
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

    // Check if today's daily reading exists
    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await supabase
      .from("readings")
      .select("id, content, created_at")
      .eq("character_id", characterId)
      .eq("type", "daily")
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .single();

    if (existing) {
      return NextResponse.json({ reading: existing });
    }

    // Generate charts
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

    // TODO: Calculate today's GanZhi properly from lunar-javascript
    const todayGanZhi = {
      yearGanZhi: "乙巳",
      monthGanZhi: "庚辰",
      dayGanZhi: "甲子",
    };

    const { text, tokensUsed } = await generateDailyFortune(
      birthInfo.name,
      charts,
      todayGanZhi,
      character.mbti,
    );

    // Parse score from [SCORE:XX] at the end
    const scoreMatch = text.match(/\[SCORE:(\d+)\]/);
    const dailyScore = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1], 10))) : 50;
    // Remove [SCORE:XX] from content
    const cleanContent = text.replace(/\n?\[SCORE:\d+\]/, "").trim();

    // Save reading
    const { data: reading, error: insertError } = await supabase
      .from("readings")
      .insert({
        character_id: characterId,
        type: "daily",
        status: "complete",
        content: cleanContent,
        stat_scores: { daily_score: dailyScore },
        tokens_used: tokensUsed,
      })
      .select("id, content, stat_scores, created_at")
      .single();

    if (insertError) {
      console.error("Failed to save daily reading:", insertError);
      return NextResponse.json({ error: "저장 중 오류가 발생했습니다" }, { status: 500 });
    }

    return NextResponse.json({ reading });
  } catch (e) {
    console.error("Daily fortune error:", e);
    return NextResponse.json({ error: "일일운세 생성 중 오류가 발생했습니다" }, { status: 500 });
  }
}
