"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

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
    icon: string;
    features: string[];
    orderName: string;
  }
> = {
  comprehensive: {
    title: "운명의 서를 펼치다",
    subtitle: "종합 사주 감정",
    icon: "",
    features: [
      "사주명리학 기반 상세 분석",
      "자미두수 궁위 해석",
      "서양 점성술 차트 분석",
      "AI 종합 감정 리포트",
    ],
    orderName: "갓챠사주 종합감정",
  },
  yearly: {
    title: "올해의 운명을 읽다",
    subtitle: "년운 분석",
    icon: "",
    features: [
      "대운 + 세운 교차 분석",
      "12개월 월운 달력",
      "직업/재물/연애/건강 영역별 운세",
      "올해의 개운법",
    ],
    orderName: "갓챠사주 년운 분석",
  },
  compatibility: {
    title: "운명의 궁합을 읽다",
    subtitle: "궁합 분석",
    icon: "",
    features: [
      "두 사람의 사주 교차 분석",
      "오행 상생/상극 궁합 해석",
      "연애/결혼/사업 궁합별 점수",
      "관계 개선 개운법",
    ],
    orderName: "갓챠사주 궁합 분석",
  },
  love: {
    title: "사랑의 별자리를 읽다",
    subtitle: "연애운 특화 분석",
    icon: "",
    features: [
      "타고난 연애 기질 + 이상형 분석",
      "연애 패턴 + 갈등/이별 패턴",
      "대운 기반 연애/결혼 최적 시기",
      "3체계 교차 연애 조언",
    ],
    orderName: "갓챠사주 연애운 분석",
  },
  career: {
    title: "천직을 찾아서",
    subtitle: "직업운 특화 분석",
    icon: "",
    features: [
      "타고난 적성 + 능력 분석",
      "구체적 직종 5개 이상 추천",
      "대운 기반 이직/전환 최적 시기",
      "사업 적합성 + 커리어 전략",
    ],
    orderName: "갓챠사주 직업운 분석",
  },
  wealth: {
    title: "재물의 흐름을 읽다",
    subtitle: "금전운 특화 분석",
    icon: "",
    features: [
      "재물 복 구조 + 돈과의 관계",
      "수입원/지출 패턴 분석",
      "대운 기반 재물 기회 시기",
      "투자 성향 + 재테크 조언",
    ],
    orderName: "갓챠사주 금전운 분석",
  },
  health: {
    title: "몸과 마음의 지도",
    subtitle: "건강운 특화 분석",
    icon: "",
    features: [
      "타고난 체질 + 오행 균형 분석",
      "취약 부위 + 장기 건강 예측",
      "계절별/나이대별 예방법",
      "일상 건강 관리 개운법",
    ],
    orderName: "갓챠사주 건강운 분석",
  },
  study: {
    title: "배움의 길을 밝히다",
    subtitle: "학업운 특화 분석",
    icon: "",
    features: [
      "타고난 학습 스타일 분석",
      "적성 전공/자격증 추천",
      "대운 기반 시험운 시기",
      "최적 공부법 + 집중 시간대",
    ],
    orderName: "갓챠사주 학업운 분석",
  },
};

function NewReadingContent() {
  const router = useRouter();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentRef = useRef<any>(null);

  const config = READING_CONFIG[type] ?? READING_CONFIG.comprehensive;

  const handlePayment = useCallback(async () => {
    if (!characterId) {
      setError("캐릭터 정보가 없습니다. 홈으로 돌아가 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // SDK 동적 로드
      if (!paymentRef.current) {
        const { loadTossPayments } = await import(
          "@tosspayments/tosspayments-sdk"
        );
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          setError("결제 설정이 누락되었습니다");
          setLoading(false);
          return;
        }
        const tossPayments = await loadTossPayments(clientKey);
        paymentRef.current = tossPayments.payment({
          customerKey: "ANONYMOUS",
        });
      }

      const orderId = `GACHA_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      // 메타데이터를 successUrl에 포함
      const meta = new URLSearchParams({
        characterId,
        type,
        ...(characterId2 ? { characterId2 } : {}),
        ...(type === "yearly" ? { targetYear: String(targetYear) } : {}),
      });

      await paymentRef.current.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: 990 },
        orderId,
        orderName: config.orderName,
        successUrl: `${window.location.origin}/reading/new/success?${meta.toString()}`,
        failUrl: `${window.location.origin}/reading/new/fail`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "결제 요청에 실패했습니다";
      if (!msg.includes("USER_CANCEL") && !msg.includes("PAY_PROCESS_CANCELED")) {
        setError(msg);
      }
      setLoading(false);
    }
  }, [characterId, characterId2, type, targetYear, config.orderName]);

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
      <h1 className="text-xl mb-6 font-[family-name:var(--font-pixel)] text-[#b8883c]">
        {`${config.icon} ${config.title}`}
      </h1>

      <PixelFrame variant="accent" className="p-6">
        <div className="text-center">
          <div className="mb-6">
            <p className="text-sm mb-2 font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
              {type === "yearly"
                ? `${targetYear}년 ${config.subtitle}`
                : config.subtitle}
            </p>
            <p className="text-3xl font-[family-name:var(--font-pixel)] text-[#c8a020]">
              990원
            </p>
          </div>

          <div className="mb-6 text-left">
            <div className="flex flex-col gap-2">
              {config.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-[#2c2418]"
                >
                  <span className="text-[#2e8b4e] font-[family-name:var(--font-pixel)]">
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm mb-4 font-[family-name:var(--font-pixel)] text-[#d04040]">
              {error}
            </p>
          )}

          <PixelButton
            size="lg"
            className="w-full"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "결제 진행 중..." : "990원 결제하기"}
          </PixelButton>
        </div>
      </PixelFrame>
    </div>
  );
}
