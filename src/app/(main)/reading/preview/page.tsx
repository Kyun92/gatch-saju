import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CharacterHero from "@/components/character/CharacterHero";
import StatGrid from "@/components/reading/StatGrid";
import PixelFrame from "@/components/ui/PixelFrame";
import GachaCapsuleSvg from "@/components/ui/GachaCapsuleSvg";
import PullCapsuleButton from "@/components/reading/PullCapsuleButton";
import type { ElementType } from "@/lib/character/get-preset";
import type { StatScores } from "@/lib/ai/stat-scorer";

const HEAVENLY_STEM_ELEMENT: Record<string, ElementType> = {
  "甲": "wood", "乙": "wood",
  "丙": "fire", "丁": "fire",
  "戊": "earth", "己": "earth",
  "庚": "metal", "辛": "metal",
  "壬": "water", "癸": "water",
};

const ELEMENT_LABEL: Record<ElementType, string> = {
  wood: "목(木)", fire: "화(火)", earth: "토(土)",
  metal: "금(金)", water: "수(水)",
};

const LOCKED_SECTIONS = [
  "사주 원국 분석",
  "오행 균형도",
  "일주 심층 해석",
  "성격 심층 분석",
  "직업운 · 재물운",
  "연애운 · 인간관계",
  "건강 · 개운법",
];

export default async function ReadingPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ characterId?: string }>;
}) {
  const { characterId } = await searchParams;
  if (!characterId) redirect("/");

  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();

  // Fetch character with ownership check
  const { data: character } = await supabase
    .from("characters")
    .select("id, name, unlocked, gender, mbti, birth_date, user_id, free_stat_scores, free_summary")
    .eq("id", characterId)
    .eq("user_id", session.user.userId)
    .single();

  if (!character) redirect("/");

  // Already unlocked → go to skill tree
  if (character.unlocked) redirect(`/characters/${characterId}`);

  // Fetch saju chart for element/dayMaster
  const { data: sajuChart } = await supabase
    .from("charts")
    .select("data")
    .eq("character_id", characterId)
    .eq("type", "saju")
    .single();

  const sajuData = sajuChart?.data as Record<string, unknown> | null;
  const dayMaster = (sajuData?.dayMaster as string) ?? "";

  // Determine element
  let element: ElementType = "water";
  if (dayMaster) {
    element = HEAVENLY_STEM_ELEMENT[dayMaster.charAt(0)] ?? "water";
  }

  // Calculate level (age)
  const birthYear = character.birth_date
    ? new Date(character.birth_date).getFullYear()
    : 2000;
  const level = new Date().getFullYear() - birthYear;

  // Free stats
  const freeStats = character.free_stat_scores as Record<string, unknown> | null;
  const statScores: StatScores | null = freeStats
    ? {
        health_score: (freeStats.health_score as number) ?? 50,
        wealth_score: (freeStats.wealth_score as number) ?? 50,
        love_score: (freeStats.love_score as number) ?? 50,
        career_score: (freeStats.career_score as number) ?? 50,
        vitality_score: (freeStats.vitality_score as number) ?? 50,
        luck_score: (freeStats.luck_score as number) ?? 50,
        title: (freeStats.title as string) ?? "운명의 여행자",
      }
    : null;

  const characterTitle = (freeStats?.title as string) ?? `${ELEMENT_LABEL[element]}의 모험가`;
  const classTitle = `${dayMaster} · ${ELEMENT_LABEL[element]}의 술사`;
  const freeSummary = character.free_summary as string | null;
  const avatarUrl = `/characters/${element}-${character.gender}.png`;

  return (
    <div className="bg-[#f5f0e8] flex flex-col">
      <div className="flex-1 w-full mx-auto px-4 py-6 flex flex-col gap-5 max-w-[480px]">
        {/* Character Hero */}
        <PixelFrame variant="accent" className="p-6">
          <CharacterHero
            avatarUrl={avatarUrl}
            dayMaster={dayMaster}
            level={level}
            classTitle={classTitle}
            characterTitle={characterTitle}
            element={element}
            mbti={character.mbti}
          />
        </PixelFrame>

        {/* Stat Grid */}
        {statScores && (
          <PixelFrame className="p-4">
            <div className="pixel-divider mb-3">능력치</div>
            <StatGrid statScores={statScores} />
          </PixelFrame>
        )}

        {/* Summary */}
        {freeSummary && (
          <PixelFrame className="p-4">
            <p className="font-[family-name:var(--font-body)] text-[0.8125rem] leading-[1.7] text-[#4a3e2c]">
              {freeSummary}
            </p>
          </PixelFrame>
        )}

        {/* Blurred locked sections — looks like real reading content */}
        <div className="relative overflow-hidden" style={{ maxHeight: "280px" }}>
          {/* Fake reading content that mimics actual comprehensive reading layout */}
          <div style={{ filter: "blur(5px)", userSelect: "none" }} aria-hidden="true">
            {LOCKED_SECTIONS.map((section, idx) => (
              <PixelFrame key={section} className={`p-4 ${idx > 0 ? "mt-3" : ""}`}>
                <h3 className="font-[family-name:var(--font-pixel)] text-sm text-[#9a7040] mb-3 border-b border-[#e8e0d0] pb-2">
                  {section}
                </h3>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 + (idx % 2) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[0.875rem] bg-[#d8d0c0]"
                      style={{
                        width: `${95 - (i * 8) - ((idx + i) % 3) * 5}%`,
                        borderRadius: "2px",
                      }}
                    />
                  ))}
                </div>
              </PixelFrame>
            ))}
          </div>

          {/* Gradient fade overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(245,240,232,0) 0%, rgba(245,240,232,0.2) 30%, rgba(245,240,232,0.8) 65%, rgba(245,240,232,1) 100%)",
            }}
          />
        </div>

        {/* Capsule machine + CTA — outside blur area */}
        <div className="flex flex-col items-center gap-4 -mt-8 relative z-10">
          <GachaCapsuleSvg size="md" className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" />

          <span className="font-[family-name:var(--font-pixel)] text-xs text-[#8a8070]">
            캡슐 속 당신의 운명을 확인하세요
          </span>

          <PullCapsuleButton
            characterId={characterId}
            type="comprehensive"
            label="운명 캡슐 뽑기"
          />
        </div>
      </div>
    </div>
  );
}
