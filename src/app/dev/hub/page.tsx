import HubHeader from "@/components/hub/HubHeader";
import TriSystemSymbol from "@/components/hub/TriSystemSymbol";
import ServiceCard from "@/components/hub/ServiceCard";
import DailyTeaser from "@/components/hub/DailyTeaser";
import TrustBadge from "@/components/hub/TrustBadge";
import CharacterHero from "@/components/character/CharacterHero";

/** Dev preview — 인증 없이 허브 UI 확인용 */
export default function DevHubPage() {
  return (
    <div className="hub-bg min-h-screen flex flex-col">
      <HubHeader userName="임승균" />

      <div
        className="flex-1 w-full mx-auto px-4 py-6 flex flex-col gap-0"
        style={{ maxWidth: "480px" }}
      >
        {/* 캐릭터 히어로 */}
        <section
          className="pixel-frame-accent flex flex-col items-center py-8 px-4 gap-1"
          style={{ marginBottom: 0 }}
        >
          <CharacterHero
            avatarUrl="/characters/metal-male.png"
            dayMaster="壬"
            level={34}
            classTitle="壬 · 수(水)의 술사"
            characterTitle="임승균"
            element="metal"
            mbti="INFP"
          />
        </section>

        {/* 구분선 */}
        <div className="pixel-divider my-5">3체계 교차분석</div>

        {/* 3체계 시각화 */}
        <section className="pixel-frame flex flex-col items-center py-6 px-4 gap-3">
          <TriSystemSymbol size="full" />
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.625rem",
              color: "#8a8070",
              letterSpacing: "0.06em",
            }}
          >
            사주 × 자미두수 × 서양점성술
          </p>
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "#5a4e3c",
              lineHeight: 1.6,
            }}
          >
            세 가지 운명학이 하나로 만나는 곳
          </p>
        </section>

        {/* 구분선 */}
        <div className="pixel-divider my-5">오늘의 운세</div>

        {/* 일일운세 티저 */}
        <DailyTeaser todayReading={null} />

        {/* 구분선 */}
        <div className="pixel-divider my-5" aria-hidden="true" />

        {/* 퀘스트 보드 */}
        <section>
          <h2 className="quest-board-title mb-4">퀘스트 보드</h2>
          <div className="flex flex-col gap-3">
            <ServiceCard
              icon="📜"
              title="일일 퀘스트"
              description="매일 새로운 운세를 확인하세요"
              price={null}
              href="/daily"
            />
            <ServiceCard
              icon="⚔️"
              title="종합 사주 감정"
              description="사주 × 자미두수 × 점성술 3체계 AI 교차분석"
              price="990원"
              href="/reading"
              popular
            />
            <ServiceCard
              icon="💕"
              title="궁합 분석"
              description="두 운명의 교차점을 찾아드립니다"
              price="990원"
              href="/compatibility"
            />
          </div>
        </section>

        {/* 신뢰 배너 */}
        <div className="mt-6">
          <TrustBadge />
        </div>
      </div>
    </div>
  );
}
