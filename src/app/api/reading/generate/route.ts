import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Vercel Hobby 함수 한도. fire-and-forget 백그라운드가 잘리지 않도록 명시.
export const maxDuration = 60;
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
import { INSUFFICIENT_BALANCE_MESSAGE } from "@/lib/copy/gacha-terms";
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

    // 코인 차감 (atomic). 잔액 부족 시 insufficient_coins 예외.
    const { error: spendError } = await supabase.rpc("adjust_user_coins", {
      p_user_id: userId,
      p_delta: -1,
    });

    if (spendError) {
      const isInsufficient = /insufficient_coins/.test(spendError.message ?? "");
      return NextResponse.json(
        {
          error: isInsufficient
            ? INSUFFICIENT_BALANCE_MESSAGE
            : "코인 차감 중 오류가 발생했습니다",
          code: isInsufficient ? "insufficient_balance" : "spend_failed",
        },
        { status: isInsufficient ? 402 : 500 },
      );
    }

    // 차감 이력 기록 (reading_id는 아래 INSERT 성공 후 UPDATE)
    const { data: coinTx, error: txError } = await supabase
      .from("coin_transactions")
      .insert({
        user_id: userId,
        delta: -1,
        reason: "spend",
        note: type,
      })
      .select("id")
      .single();

    if (txError || !coinTx) {
      // 차감은 됐는데 이력 기록 실패 → 롤백
      await supabase.rpc("adjust_user_coins", {
        p_user_id: userId,
        p_delta: 1,
      });
      console.error("Coin transaction log failed:", txError);
      return NextResponse.json(
        { error: "감정 생성 준비 중 오류가 발생했습니다" },
        { status: 500 },
      );
    }

    // 차트 미리 계산 (Edge Function 워커가 readings.charts_data로 받아 사용).
    // compatibility는 두 번째 캐릭터 차트도 함께, yearly는 간지를 합쳐 저장한다.
    const primaryBirthInfo: BirthInfo = {
      name: character.name ?? "",
      birthDate: character.birth_date,
      birthTime: character.birth_time,
      birthCity: character.birth_city,
      birthLat: character.birth_lat,
      birthLng: character.birth_lng,
      gender: character.gender as "male" | "female",
      timezone: character.timezone ?? "Asia/Seoul",
    };
    const primaryCharts = generateAllCharts(primaryBirthInfo);
    const chartsForStorage: AllCharts & {
      _secondary?: AllCharts;
      _yearlyGanZhi?: ReturnType<typeof getYearlyGanZhi>;
    } = { ...primaryCharts };

    if (type === "compatibility" && character2) {
      const secondaryBirthInfo: BirthInfo = {
        name: character2.name ?? "",
        birthDate: character2.birth_date,
        birthTime: character2.birth_time,
        birthCity: character2.birth_city,
        birthLat: character2.birth_lat,
        birthLng: character2.birth_lng,
        gender: character2.gender as "male" | "female",
        timezone: character2.timezone ?? "Asia/Seoul",
      };
      chartsForStorage._secondary = generateAllCharts(secondaryBirthInfo);
    }

    if (type === "yearly" && targetYear) {
      chartsForStorage._yearlyGanZhi = getYearlyGanZhi(
        primaryBirthInfo.birthDate,
        primaryBirthInfo.birthTime,
        primaryBirthInfo.gender,
        targetYear,
      );
    }

    // Create reading row with pending status (charts_data 포함)
    const readingId = uuidv4();
    const { error: insertError } = await supabase.from("readings").insert({
      id: readingId,
      character_id: characterId,
      ...(type === "compatibility" && characterId2 ? { character_id_2: characterId2 } : {}),
      type,
      status: "pending",
      coin_transaction_id: coinTx.id,
      ...(type === "yearly" && targetYear ? { year: targetYear } : {}),
      charts_data: chartsForStorage,
    });

    if (insertError) {
      // 롤백: 차감 취소 + 이력 삭제
      await supabase.rpc("adjust_user_coins", {
        p_user_id: userId,
        p_delta: 1,
      });
      await supabase.from("coin_transactions").delete().eq("id", coinTx.id);
      console.error("Failed to create reading:", insertError);
      return NextResponse.json(
        { error: "감정 생성에 실패했습니다" },
        { status: 500 },
      );
    }

    // 이력에 reading_id 연결
    await supabase
      .from("coin_transactions")
      .update({ reading_id: readingId })
      .eq("id", coinTx.id);

    // 흐름 분기:
    //  - USE_MOCK_READINGS=true (로컬 dev): 기존 fire-and-forget 경로로 mock data 사용.
    //  - 그 외(라이브): Supabase Edge Function 워커에 위임 (60s 한도 우회).
    const useMock =
      process.env.NODE_ENV !== "production" &&
      process.env.USE_MOCK_READINGS === "true";

    if (useMock) {
      // Build generator function based on type (mock 경로 전용)
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

      executeReadingGeneration(
        readingId,
        characterId,
        type,
        generatorFn,
        characterData,
      ).catch((e) => {
        console.error("Background reading generation failed:", e);
      });
    } else {
      // 라이브: Supabase Edge Function 위임
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const workerSecret = process.env.READING_WORKER_SECRET;

      if (!supabaseUrl || !workerSecret) {
        console.error(
          "Reading worker config missing: NEXT_PUBLIC_SUPABASE_URL or READING_WORKER_SECRET",
        );
        await supabase
          .from("readings")
          .update({
            status: "error",
            error_message: "감정 생성 워커가 설정되지 않았습니다",
          })
          .eq("id", readingId);
        await supabase.rpc("adjust_user_coins", { p_user_id: userId, p_delta: 1 });
        return NextResponse.json(
          { error: "감정 생성 시작에 실패했습니다" },
          { status: 500 },
        );
      }

      const workerUrl = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/reading-worker`;
      try {
        const res = await fetch(workerUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${workerSecret}`,
          },
          body: JSON.stringify({ readingId }),
        });
        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          console.error("Edge function rejected:", res.status, errBody);
          await supabase
            .from("readings")
            .update({
              status: "error",
              error_message: "감정 생성 워커 호출에 실패했습니다",
            })
            .eq("id", readingId);
          await supabase.rpc("adjust_user_coins", { p_user_id: userId, p_delta: 1 });
          return NextResponse.json(
            { error: "감정 생성 시작에 실패했습니다" },
            { status: 500 },
          );
        }
      } catch (e) {
        console.error("Edge function call failed:", e);
        await supabase
          .from("readings")
          .update({
            status: "error",
            error_message: "감정 생성 워커 연결에 실패했습니다",
          })
          .eq("id", readingId);
        await supabase.rpc("adjust_user_coins", { p_user_id: userId, p_delta: 1 });
        return NextResponse.json(
          { error: "감정 생성 시작에 실패했습니다" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ readingId });
  } catch (e) {
    console.error("Reading generate error:", e);
    return NextResponse.json(
      { error: "감정 생성 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
