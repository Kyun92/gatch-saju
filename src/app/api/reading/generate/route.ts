import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateComprehensiveReading, generateCompatibilityReading, generateCategoryReading } from "@/lib/ai/gemini";
import { generateYearlyReading } from "@/lib/ai/gemini";
import type { CategoryType } from "@/lib/ai/gemini";
import { getYearlyGanZhi } from "@/lib/charts/saju";
import { generateAllCharts } from "@/lib/charts";
import {
  executeReadingGeneration,
  type CharacterData,
} from "@/lib/reading/generate-reading";
import type { BirthInfo, AllCharts } from "@/lib/charts/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = (await request.json()) as {
      characterId: string;
      characterId2?: string;
      type?: "comprehensive" | "yearly" | "compatibility" | "love" | "career" | "wealth" | "health" | "study";
      targetYear?: number;
    };

    const { characterId, characterId2, type = "comprehensive", targetYear } = body;

    if (!characterId) {
      return NextResponse.json(
        { error: "캐릭터 ID가 필요합니다" },
        { status: 400 },
      );
    }

    if (type === "yearly" && !targetYear) {
      return NextResponse.json(
        { error: "년운 분석에는 대상 연도가 필요합니다" },
        { status: 400 },
      );
    }

    if (type === "compatibility" && !characterId2) {
      return NextResponse.json(
        { error: "궁합 분석에는 두 번째 캐릭터가 필요합니다" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();
    const userId = session.user.userId;

    // Get character birth info + ownership check
    const { data: character, error: characterError } = await supabase
      .from("characters")
      .select(
        "id, name, birth_date, birth_time, birth_city, birth_lat, birth_lng, gender, timezone, mbti, unlocked",
      )
      .eq("id", characterId)
      .eq("user_id", userId)
      .single();

    if (characterError || !character) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    // Unlock gate: non-comprehensive types require unlocked character
    if (type !== "comprehensive" && !character.unlocked) {
      return NextResponse.json(
        { error: "종합감정을 먼저 받아야 합니다" },
        { status: 403 },
      );
    }

    // For compatibility: fetch + validate second character
    let character2: typeof character | null = null;
    if (type === "compatibility" && characterId2) {
      const { data: char2, error: char2Error } = await supabase
        .from("characters")
        .select(
          "id, name, birth_date, birth_time, birth_city, birth_lat, birth_lng, gender, timezone, mbti, unlocked",
        )
        .eq("id", characterId2)
        .eq("user_id", userId)
        .single();

      if (char2Error || !char2) {
        return NextResponse.json({ error: "두 번째 캐릭터 권한 없음" }, { status: 403 });
      }

      if (!char2.unlocked) {
        return NextResponse.json(
          { error: "두 번째 캐릭터도 종합감정을 먼저 받아야 합니다" },
          { status: 403 },
        );
      }

      character2 = char2;
    }

    // Create reading row with pending status
    const readingId = uuidv4();
    const { error: insertError } = await supabase.from("readings").insert({
      id: readingId,
      character_id: characterId,
      ...(type === "compatibility" && characterId2 ? { character_id_2: characterId2 } : {}),
      type,
      status: "pending",
      ...(type === "yearly" && targetYear ? { year: targetYear } : {}),
    });

    if (insertError) {
      console.error("Failed to create reading:", insertError);
      return NextResponse.json(
        { error: "감정 생성에 실패했습니다" },
        { status: 500 },
      );
    }

    // Build generator function based on type
    const characterData: CharacterData = {
      name: character.name,
      birth_date: character.birth_date,
      birth_time: character.birth_time,
      birth_city: character.birth_city,
      birth_lat: character.birth_lat,
      birth_lng: character.birth_lng,
      gender: character.gender,
      timezone: character.timezone,
      mbti: character.mbti,
    };

    let generatorFn: (
      birthInfo: BirthInfo,
      charts: AllCharts,
    ) => Promise<{ content: string; tokensUsed: number }>;

    if (type === "compatibility" && character2) {
      generatorFn = async (birthInfo: BirthInfo, charts: AllCharts) => {
        // Build second character's charts
        const birthInfo2: BirthInfo = {
          name: character2!.name ?? "",
          birthDate: character2!.birth_date,
          birthTime: character2!.birth_time,
          birthCity: character2!.birth_city,
          birthLat: character2!.birth_lat,
          birthLng: character2!.birth_lng,
          gender: character2!.gender as "male" | "female",
          timezone: character2!.timezone ?? "Asia/Seoul",
        };
        const charts2 = generateAllCharts(birthInfo2);

        const { html, tokensUsed } = await generateCompatibilityReading(
          birthInfo.name,
          charts,
          birthInfo2.name,
          charts2,
          character.mbti,
          character2!.mbti,
        );
        return { content: html, tokensUsed };
      };
    } else if (type === "yearly") {
      generatorFn = async (birthInfo: BirthInfo, charts: AllCharts) => {
        const yearlyGanZhi = getYearlyGanZhi(
          birthInfo.birthDate,
          birthInfo.birthTime,
          birthInfo.gender,
          targetYear!,
        );
        const { html, tokensUsed } = await generateYearlyReading(
          birthInfo.name,
          charts,
          targetYear!,
          yearlyGanZhi,
          character.mbti,
        );
        return { content: html, tokensUsed };
      };
    } else if (["love", "career", "wealth", "health", "study"].includes(type)) {
      const categoryType = type as CategoryType;
      generatorFn = async (birthInfo: BirthInfo, charts: AllCharts) => {
        const { html, tokensUsed } = await generateCategoryReading(
          categoryType,
          birthInfo.name,
          charts,
          character.mbti,
        );
        return { content: html, tokensUsed };
      };
    } else {
      generatorFn = async (birthInfo: BirthInfo, charts: AllCharts) => {
        const { html, tokensUsed } = await generateComprehensiveReading(
          birthInfo.name,
          charts,
          character.mbti,
        );
        return { content: html, tokensUsed };
      };
    }

    // Run generation in background
    executeReadingGeneration(
      readingId,
      characterId,
      type,
      generatorFn,
      characterData,
    ).catch((e) => {
      console.error("Background reading generation failed:", e);
    });

    return NextResponse.json({ readingId });
  } catch (e) {
    console.error("Reading generate error:", e);
    return NextResponse.json(
      { error: "감정 생성 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
