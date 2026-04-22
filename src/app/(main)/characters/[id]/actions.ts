"use server";

import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const VALID_MBTI = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
] as const;

export async function updateCharacter(
  characterId: string,
  data: { name: string; mbti: string | null },
) {
  const session = await auth();
  if (!session?.user?.userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createServerSupabaseClient();

  // Ownership check
  const { data: character } = await supabase
    .from("characters")
    .select("id, user_id")
    .eq("id", characterId)
    .eq("user_id", session.user.userId)
    .single();

  if (!character) {
    throw new Error("캐릭터를 찾을 수 없습니다.");
  }

  const name = data.name.trim();
  if (name.length < 1 || name.length > 20) {
    throw new Error("이름은 1~20자로 입력해주세요.");
  }

  const mbti =
    data.mbti && VALID_MBTI.includes(data.mbti as (typeof VALID_MBTI)[number])
      ? data.mbti
      : null;

  const { error } = await supabase
    .from("characters")
    .update({ name, mbti })
    .eq("id", characterId);

  if (error) {
    throw new Error("캐릭터 수정에 실패했습니다.");
  }

  return { success: true };
}

export async function deleteCharacter(characterId: string) {
  const session = await auth();
  if (!session?.user?.userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createServerSupabaseClient();

  // Ownership + is_self check
  const { data: character } = await supabase
    .from("characters")
    .select("id, user_id, is_self")
    .eq("id", characterId)
    .eq("user_id", session.user.userId)
    .single();

  if (!character) {
    throw new Error("캐릭터를 찾을 수 없습니다.");
  }

  if (character.is_self) {
    throw new Error("본인 캐릭터는 삭제할 수 없습니다.");
  }

  const { error } = await supabase
    .from("characters")
    .delete()
    .eq("id", characterId);

  if (error) {
    throw new Error("캐릭터 삭제에 실패했습니다.");
  }

  return { success: true };
}
