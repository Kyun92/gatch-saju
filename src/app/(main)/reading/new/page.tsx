"use client";

import { Suspense, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import GachaCapsuleSvg from "@/components/ui/GachaCapsuleSvg";
import CoinSvg from "@/components/ui/CoinSvg";
import { motion } from "framer-motion";
import {
  COIN_PRICE_DISPLAY,
  PRIMARY_CTA_PULL,
  CAPSULE_LABEL,
  formatCoinCount,
} from "@/lib/copy/gacha-terms";

export default function NewReadingPage() {
  return (
    <Suspense>
      <NewReadingContent />
    </Suspense>
  );
}

type ReadingType =
  | "comprehensive"
  | "yearly"
  | "compatibility"
  | "love"
  | "career"
  | "wealth"
  | "health"
  | "study";

const READING_CONFIG: Record<
  ReadingType,
  {
    title: string;
    subtitle: string;
    features: string[];
    orderName: string;
    mockKeywords: string[];
  }
> = {
  comprehensive: {
    title: "종합 사주 감정",
    subtitle: "3체계 교차분석 종합 리포트",
    features: [
      "사주명리학 기반 상세 분석",
      "자미두수 궁위 해석",
      "서양 점성술 차트 분석",
      "3체계 교차 종합 리포트",
    ],
    orderName: "갓챠사주 종합감정",
    mockKeywords: ["잠재력 S등급", "전체 운세 요약", "성격 키워드"],
  },
  yearly: {
    title: "년운 분석",
    subtitle: "대운 + 세운 교차분석",
    features: [
      "대운 + 세운 교차 분석",
      "12개월 월운 달력",
      "직업/재물/연애/건강 영역별 운세",
      "올해의 개운법",
    ],
    orderName: "갓챠사주 년운 분석",
    mockKeywords: ["올해의 흐름 A등급", "핵심 기회 시기", "주의점"],
  },
  compatibility: {
    title: "궁합 분석",
    subtitle: "두 사람의 운명 교차분석",
    features: [
      "두 사람의 사주 교차 분석",
      "오행 상생/상극 궁합 해석",
      "연애/결혼/사업 궁합별 점수",
      "관계 개선 개운법",
    ],
    orderName: "갓챠사주 궁합 분석",
    mockKeywords: ["합 일치도 90%", "MBTI 갈등 해결", "소울메이트"],
  },
  love: {
    title: "연애운 분석",
    subtitle: "타고난 연애 기질 심층 분석",
    features: [
      "타고난 연애 기질 + 이상형 분석",
      "연애 패턴 + 갈등/이별 패턴",
      "대운 기반 연애/결혼 최적 시기",
      "3체계 교차 연애 조언",
    ],
    orderName: "갓챠사주 연애운 분석",
    mockKeywords: ["도화살 A등급", "최적의 만남 시기", "연애 성향"],
  },
  career: {
    title: "직업운 분석",
    subtitle: "천직과 커리어 전략",
    features: [
      "타고난 적성 + 능력 분석",
      "구체적 직종 5개 이상 추천",
      "대운 기반 이직/전환 최적 시기",
      "사업 적합성 + 커리어 전략",
    ],
    orderName: "갓챠사주 직업운 분석",
    mockKeywords: ["재물운 S등급", "최고의 직업군", "이직 타이밍"],
  },
  wealth: {
    title: "금전운 분석",
    subtitle: "재물의 흐름과 기회",
    features: [
      "재물 복 구조 + 돈과의 관계",
      "수입원/지출 패턴 분석",
      "대운 기반 재물 기회 시기",
      "투자 성향 + 재테크 조언",
    ],
    orderName: "갓챠사주 금전운 분석",
    mockKeywords: ["편재운 활성화", "재물 획득 방식", "대박 타이밍"],
  },
  health: {
    title: "건강운 분석",
    subtitle: "타고난 체질과 예방법",
    features: [
      "타고난 체질 + 오행 균형 분석",
      "취약 부위 + 장기 건강 예측",
      "계절별/나이대별 예방법",
      "일상 건강 관리 개운법",
    ],
    orderName: "갓챠사주 건강운 분석",
    mockKeywords: ["오행 밸런스 A등급", "생명력의 흐름", "맞춤 예방법"],
  },
  study: {
    title: "학업운 분석",
    subtitle: "학습 스타일과 시험운",
    features: [
      "타고난 학습 스타일 분석",
      "적성 전공/자격증 추천",
      "대운 기반 시험운 시기",
      "최적 공부법 + 집중 시간대",
    ],
    orderName: "갓챠사주 학업운 분석",
    mockKeywords: ["집중력 S등급", "최적의 학습 방식", "합격 기운"],
  },
};

function NewReadingContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const characterId2 = searchParams.get("characterId2");
  const type = (searchParams.get("type") ?? "comprehensive") as ReadingType;
  const yearParam = searchParams.get("year");
  const targetYear = yearParam
    ? parseInt(yearParam, 10)
    : new Date().getFullYear();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = READING_CONFIG[type] ?? READING_CONFIG.comprehensive;

  const handlePull = useCallback(async () => {
    if (!characterId) {
      setError("캐릭터 정보가 없습니다. 홈으로 돌아가 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reading/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId,
          ...(characterId2 ? { characterId2 } : {}),
          type,
          ...(type === "yearly" ? { targetYear } : {}),
        }),
      });

      const data = (await res.json()) as {
        readingId?: string;
        error?: string;
        code?: string;
      };

      if (res.status === 402 || data.code === "insufficient_balance") {
        const qs = searchParams?.toString();
        const returnTo = qs ? `${pathname}?${qs}` : pathname;
        router.push(`/coins?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      if (!res.ok || !data.readingId) {
        setError(data.error ?? "뽑기에 실패했습니다");
        setLoading(false);
        return;
      }

      router.push(`/reading/generating/${data.readingId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "뽑기 요청에 실패했습니다";
      setError(msg);
      setLoading(false);
    }
  }, [characterId, characterId2, type, targetYear, router, pathname, searchParams]);

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center">
      <div
        className="w-full flex-1 mx-auto px-4 py-8 flex flex-col gap-6"
        style={{ maxWidth: "480px" }}
      >
        {/* Section 1: 무료 제공 영역 (결제 전 빌드업: 캡슐 프리뷰) */}
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-[family-name:var(--font-pixel)] text-[#9a7040] mb-6"
          >
            {CAPSULE_LABEL}이 도착했습니다!
          </motion.h2>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            {/* 반투명 효과를 준 캡슐 베이스 */}
            <div className="opacity-80 drop-shadow-[0_12px_12px_rgba(255,215,0,0.3)]">
              <GachaCapsuleSvg size="xl" />
            </div>

            {/* 캡슐 주변에 떠있는 키워드 라벨들 */}
            <div className="absolute inset-x-0 -bottom-2 flex justify-center gap-2 px-2 z-10 flex-wrap">
              {config.mockKeywords.map((keyword, i) => (
                <span 
                  key={i} 
                  className="bg-black/80 text-white text-[0.6rem] px-2 py-1 rounded font-[family-name:var(--font-pixel)] border border-white/20 whitespace-nowrap drop-shadow-md"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="mt-8 px-4 w-full relative">
            {/* 모자이크/블러 처리된 텍스트 이미지 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f5f0e8] z-10" />
            <div className="text-left font-[family-name:var(--font-body)] text-xs text-[#6a5e4c] blur-sm opacity-50 select-none">
              <p className="mb-2">사주 원국에서 돋보이는 가장 강한 기운은...</p>
              <p className="mb-2">MBTI의 특성과 결합되었을 때 이러한 성향은 더욱 구체적으로 발현됩니다. 특히 대운의 흐름 상...</p>
              <p>자미두수 명궁에 위치한 주성의 영향을 받아...</p>
              <p className="mb-2">올해 상반기에는 주의해야 할 점이 몇 가지 존재합니다. 하지만 하반기부터는 재성과 관성이 만나면서...</p>
            </div>
          </div>
        </div>

        {/* Section 2: 결제 팝업 (Paywall - 캡슐 오픈) */}
        <motion.div
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="relative z-20 w-full mt-4"
        >
          <PixelFrame className="p-6 relative bg-white/50 backdrop-blur-sm border-[#e8a825]">
            <div className="flex flex-col items-center text-center gap-4">
              <div>
                <p className="text-[#c8a020] font-[family-name:var(--font-pixel)] text-base mb-1">
                  {CAPSULE_LABEL}을 완전히 열어보시겠어요?
                </p>
                <p className="text-[#8a8070] text-xs font-[family-name:var(--font-body)]">
                  4가지 체계로 분석한 운명의 SSR 리포트
                </p>
              </div>

              {/* 구성 내용 */}
              <div className="w-full bg-white/60 p-3 rounded text-left border border-[#e2d8c3] my-2">
                <div className="grid grid-cols-1 gap-2">
                  {config.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span className="font-[family-name:var(--font-pixel)] text-[0.5rem] text-[#c8a020]">{"*"}</span>
                      <span className="text-[0.7rem] text-[#4a3e2c] font-[family-name:var(--font-body)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm font-[family-name:var(--font-pixel)] text-[#d04040]">
                  {error}
                </p>
              )}

              <div className="w-full mt-2 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handlePull}
                  disabled={loading}
                  className="gacha-coin-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`${PRIMARY_CTA_PULL} ${COIN_PRICE_DISPLAY} (${formatCoinCount(1)})`}
                >
                  <CoinSvg
                    size={24}
                    className={loading ? undefined : "animate-spin-coin"}
                  />
                  <span>
                    {loading
                      ? "뽑는 중..."
                      : `${PRIMARY_CTA_PULL} — ${COIN_PRICE_DISPLAY}`}
                  </span>
                </button>
                <p className="font-[family-name:var(--font-body)] text-[0.625rem] text-[#8a8070]">
                  잔액이 부족하면 충전 페이지로 이동합니다
                </p>
              </div>
            </div>
          </PixelFrame>
        </motion.div>
      </div>
    </div>
  );
}
