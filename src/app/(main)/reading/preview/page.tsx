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
import {
  PRIMARY_CTA_PULL,
  PREVIEW_LOCK_HEADLINE,
  PREVIEW_FREE_SUMMARY_FALLBACK,
} from "@/lib/copy/gacha-terms";
import {
  ELEMENT_LABEL,
  formatDayMasterDisplay,
  getCharacterElement,
} from "@/lib/copy/day-master";

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

  // Determine element from dayMaster (결정론)
  const element: ElementType = getCharacterElement(dayMaster, "water");

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

  const characterTitle = (freeStats?.title as string) ?? `${ELEMENT_LABEL[element]} 기운의 모험가`;
  // 클래스 칭호: "깊은 바다 타입의 술사" (한자 노출 없음)
  const dayMasterDisplay = formatDayMasterDisplay(dayMaster) || "운명의 여행자";
  const classTitle = `${dayMasterDisplay}의 술사`;
  const freeSummary = character.free_summary as string | null;
  const avatarUrl = `/characters/${element}-${character.gender}.png`;

  return (
    <div className="bg-[#f5f0e8] flex flex-col">
      <div className="flex-1 w-full mx-auto px-4 py-6 flex flex-col gap-5 max-w-[480px]">
        {/* Character Hero */}
        <PixelFrame variant="accent" className="p-6">
          <CharacterHero
            avatarUrl={avatarUrl}
            dayMaster={dayMasterDisplay}
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

        {/* Summary (legacy 캐릭터는 free_summary가 null일 수 있음 → 폴백 카피) */}
        <PixelFrame className="p-4">
          <p className="font-[family-name:var(--font-body)] text-[0.8125rem] leading-[1.7] text-[#4a3e2c]">
            {freeSummary ?? PREVIEW_FREE_SUMMARY_FALLBACK}
          </p>
        </PixelFrame>

        {/* Blurred locked sections — looks like real reading content */}
        <div className="preview-locked-clip relative overflow-hidden">
          {/* Fake reading content that mimics actual comprehensive reading layout */}
          <div className="preview-locked-blur" aria-hidden="true">
            {LOCKED_SECTIONS.map((section, idx) => (
              <PixelFrame key={section} className={`p-4 ${idx > 0 ? "mt-3" : ""}`}>
                <h3 className="font-[family-name:var(--font-pixel)] text-sm text-[#9a7040] mb-3 border-b border-[#e8e0d0] pb-2">
                  {section}
                </h3>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 + (idx % 2) }).map((_, i) => (
                    <div
                      key={i}
                      className="preview-locked-line h-[0.875rem] bg-[#d8d0c0]"
                      // 동적 props 예외: width %는 idx/i 기반 fake content
                      style={{
                        width: `${95 - i * 8 - ((idx + i) % 3) * 5}%`,
                      }}
                    />
                  ))}
                </div>
              </PixelFrame>
            ))}
          </div>

          {/* Gradient fade overlay */}
          <div
            className="preview-locked-overlay absolute inset-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Capsule machine + CTA — outside blur area, sticky 강조 */}
        <div className="preview-cta-stack flex flex-col items-center gap-3 -mt-10 relative z-10">
          {/* 자물쇠 아이콘 + 잠금 헤드라인 */}
          <div className="flex flex-col items-center gap-2">
            <svg
              width="28"
              height="32"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="preview-lock-icon"
            >
              {/* 픽셀 톤 자물쇠 (16비트 단순화) */}
              <rect x="3" y="1" width="8" height="2" fill="#9a7040" />
              <rect x="2" y="3" width="2" height="4" fill="#9a7040" />
              <rect x="10" y="3" width="2" height="4" fill="#9a7040" />
              <rect x="1" y="6" width="12" height="9" fill="#b8944c" />
              <rect x="2" y="7" width="10" height="7" fill="#d4a965" />
              <rect x="6" y="9" width="2" height="3" fill="#5a4528" />
              <rect x="6" y="11" width="2" height="2" fill="#5a4528" />
            </svg>
            <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#5a4e3c] text-center px-2">
              {PREVIEW_LOCK_HEADLINE}
            </p>
          </div>

          <GachaCapsuleSvg
            size="md"
            className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
          />

          <PullCapsuleButton
            characterId={characterId}
            type="comprehensive"
            label={PRIMARY_CTA_PULL}
          />
        </div>
      </div>
    </div>
  );
}
