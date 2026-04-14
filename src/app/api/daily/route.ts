import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { generateDailyFortune } from "@/lib/ai/gemini";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";

export async function GET() {
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

    // Check if today's daily reading exists
    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await supabase
      .from("readings")
      .select("id, content, created_at")
      .eq("user_id", userId)
      .eq("type", "daily")
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .single();

    if (existing) {
      return NextResponse.json({ reading: existing });
    }

    // Generate charts
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
      user.mbti,
    );

    // Save reading
    const { data: reading, error: insertError } = await supabase
      .from("readings")
      .insert({
        user_id: userId,
        type: "daily",
        status: "complete",
        content: text,
        tokens_used: tokensUsed,
      })
      .select("id, content, created_at")
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
