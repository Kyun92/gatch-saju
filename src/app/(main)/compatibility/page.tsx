import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import CompatibilitySelector from "./CompatibilitySelector";
import type { ElementType } from "@/lib/character/get-preset";

const HEAVENLY_STEM_ELEMENT: Record<string, ElementType> = {
  "\u7532": "wood", "\u4E59": "wood",
  "\u4E19": "fire", "\u4E01": "fire",
  "\u620A": "earth", "\u5DF1": "earth",
  "\u5E9A": "metal", "\u8F9B": "metal",
  "\u58EC": "water", "\u7678": "water",
};

export interface CharacterOption {
  id: string;
  name: string;
  gender: "male" | "female";
  element: ElementType;
  level: number;
  unlocked: boolean;
}

export default async function CompatibilityPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const userId = session.user.userId;

  // Fetch all characters
  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, unlocked, gender, birth_date")
    .eq("user_id", userId)
    .order("is_self", { ascending: false })
    .order("created_at", { ascending: true });

  if (!characters || characters.length === 0) redirect("/onboarding");

  // Need at least 2 unlocked characters
  const characterIds = characters.map((c) => c.id);

  // Fetch saju charts for element
  const { data: charts } = await supabase
    .from("charts")
    .select("character_id, data")
    .in("character_id", characterIds)
    .eq("type", "saju");

  const chartMap = new Map<string, Record<string, unknown>>();
  if (charts) {
    for (const chart of charts) {
      chartMap.set(chart.character_id, chart.data as Record<string, unknown>);
    }
  }

  const characterOptions: CharacterOption[] = characters.map((char) => {
    const sajuData = chartMap.get(char.id);
    const dayMaster = (sajuData?.dayMaster as string) ?? "";
    let element: ElementType = "water";
    if (dayMaster) {
      const stem = dayMaster.charAt(0);
      element = HEAVENLY_STEM_ELEMENT[stem] ?? "water";
    }

    const birthYear = char.birth_date
      ? new Date(char.birth_date).getFullYear()
      : 2000;
    const level = new Date().getFullYear() - birthYear;

    return {
      id: char.id,
      name: char.name,
      gender: char.gender as "male" | "female",
      element,
      level,
      unlocked: char.unlocked,
    };
  });

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
      <h1 className="text-xl mb-6 font-[family-name:var(--font-pixel)] text-[#b8883c]">
        {"💑 궁합 분석"}
      </h1>

      <CompatibilitySelector characters={characterOptions} />
    </div>
  );
}
