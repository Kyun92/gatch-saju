"use server";

import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateAllCharts } from "@/lib/charts";
import { getCityInfo } from "@/lib/data/cities";
// redirect is handled client-side

const VALID_MBTI = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
] as const;

interface OnboardingData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  gender: "male" | "female";
  mbti: string | null;
  isSelf?: boolean;
}

export async function createCharacter(data: OnboardingData) {
  const session = await auth();
  if (!session?.user?.userId) {
    throw new Error("인증이 필요합니다.");
  }

  const userId = session.user.userId;
  console.log("[onboarding] userId:", userId);
  const supabase = createServerSupabaseClient();
  const cityInfo = getCityInfo(data.birthCity);

  if (!cityInfo) {
    throw new Error("유효하지 않은 도시입니다.");
  }

  const mbtiValue =
    data.mbti && VALID_MBTI.includes(data.mbti as (typeof VALID_MBTI)[number])
      ? data.mbti
      : null;

  // Insert character
  const { data: character, error: charError } = await supabase
    .from("characters")
    .insert({
      user_id: userId,
      name: data.name,
      birth_date: data.birthDate,
      birth_time: data.birthTime,
      birth_city: data.birthCity,
      birth_lat: cityInfo.lat,
      birth_lng: cityInfo.lng,
      gender: data.gender,
      timezone: cityInfo.timezone,
      mbti: mbtiValue,
      is_self: data.isSelf ?? true,
      unlocked: false,
    })
    .select("id")
    .single();

  if (charError) {
    console.error("[onboarding] character insert error:", charError);
    throw new Error("캐릭터 생성에 실패했습니다.");
  }
  console.log("[onboarding] character created:", character.id);

  // Generate all charts
  const charts = generateAllCharts({
    name: data.name,
    birthDate: data.birthDate,
    birthTime: data.birthTime,
    birthCity: data.birthCity,
    birthLat: cityInfo.lat,
    birthLng: cityInfo.lng,
    gender: data.gender,
    timezone: cityInfo.timezone,
  });

  console.log("[onboarding] charts generated:", Object.keys(charts));

  // Insert charts with character_id
  const chartEntries = [
    { character_id: character.id, type: "saju", data: charts.saju },
    { character_id: character.id, type: "ziwei", data: charts.ziwei },
    { character_id: character.id, type: "western", data: charts.western },
  ];

  for (const entry of chartEntries) {
    const { error: insertError } = await supabase
      .from("charts")
      .insert(entry);
    if (insertError) {
      console.error("[onboarding] chart insert error:", entry.type, insertError);
    }
  }
  console.log("[onboarding] charts saved, done");
  return { success: true };
}
