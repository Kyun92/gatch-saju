import { getCharacterPreset } from "@/lib/character/get-preset";
import CharacterHero from "@/components/character/CharacterHero";
import ProfileCard from "@/components/reading/ProfileCard";
import StatGrid from "@/components/reading/StatGrid";
import ReadingAccordion from "@/components/reading/ReadingAccordion";
import ReadingCTA from "@/components/reading/ReadingCTA";
import PixelDivider from "@/components/ui/PixelDivider";
import type { StatScores } from "@/lib/ai/stat-scorer";
import { READING_HTML_KIMHS } from "@/lib/data/sample-reading-kimhs";

// ─── 김현성 실데이터 ──────────────────────────────────

const USER = {
  name: "김현성",
  birthDate: "1993-02-23",
  birthTime: "10:30",
  birthCity: "서울",
  gender: "male" as const,
  mbti: "ENTJ",
};

const DAY_MASTER = "乙";
const PRESET = getCharacterPreset(DAY_MASTER, USER.gender);

const STAT_SCORES: StatScores = {
  health_score: 52,
  wealth_score: 78,
  love_score: 60,
  career_score: 92,
  vitality_score: 65,
  luck_score: 70,
  title: "벨벳 철권",
};

// ─── 페이지 ─────────────────────────────────────────

export default function DevReadingPage() {
  return (
    <div
      className="w-full mx-auto px-4 py-6"
      style={{ maxWidth: "768px", minHeight: "100vh" }}
    >
      {/* 헤더 */}
      <div className="text-center mb-6">
        <p
          className="text-xs mb-1"
          style={{ fontFamily: "var(--font-pixel)", color: "#8a8070" }}
        >
          2026.04.14 김현성 종합 사주감정
        </p>
        <h1
          className="text-xl"
          style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
        >
          종합 운세 감정서
        </h1>
      </div>

      {/* 캐릭터 히어로 */}
      <CharacterHero
        avatarUrl={`/characters/${PRESET?.element ?? "wood"}-${USER.gender}.png`}
        dayMaster="乙木"
        level={33}
        classTitle={PRESET?.className ?? "숲의 궁수"}
        characterTitle={STAT_SCORES.title}
        element={PRESET?.element ?? "wood"}
        mbti={USER.mbti}
        keywords="벨벳 장갑의 철권 · 직관하는 전략가 · 대기만성의 황제"
      />

      <div className="mt-6" />

      {/* 프로필 카드 */}
      <ProfileCard
        name={USER.name}
        birthDate={USER.birthDate}
        birthTime={USER.birthTime}
        gender={USER.gender}
        dayMaster="乙木"
        mbti={USER.mbti}
      />

      {/* 능력치 */}
      <PixelDivider label="능력치" className="my-6" />
      <StatGrid statScores={STAT_SCORES} />

      {/* 상세 감정 */}
      <PixelDivider label="상세 감정" className="my-6" />
      <ReadingAccordion htmlContent={READING_HTML_KIMHS} />

      {/* 하단 CTA */}
      <ReadingCTA readingId="dev-preview" characterName="임승균" />

      <div className="h-16" />
    </div>
  );
}
