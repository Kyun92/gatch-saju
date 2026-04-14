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
}

export async function completeOnboarding(data: OnboardingData) {
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

  // Update user profile
  const { error: updateError } = await supabase
    .from("users")
    .update({
      name: data.name,
      birth_date: data.birthDate,
      birth_time: data.birthTime,
      birth_city: data.birthCity,
      birth_lat: cityInfo.lat,
      birth_lng: cityInfo.lng,
      gender: data.gender,
      timezone: cityInfo.timezone,
      mbti: mbtiValue,
      profile_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    console.error("[onboarding] update error:", updateError);
    throw new Error("프로필 저장에 실패했습니다.");
  }
  console.log("[onboarding] profile updated");

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
  // Upsert charts
  const chartEntries = [
    { user_id: userId, type: "saju", data: charts.saju },
    { user_id: userId, type: "ziwei", data: charts.ziwei },
    { user_id: userId, type: "western", data: charts.western },
  ];

  for (const entry of chartEntries) {
    const { error: upsertError } = await supabase
      .from("charts")
      .upsert(entry, { onConflict: "user_id,type" });
    if (upsertError) {
      console.error("[onboarding] chart upsert error:", entry.type, upsertError);
    }
  }
  console.log("[onboarding] charts saved, done");
  return { success: true };
}
