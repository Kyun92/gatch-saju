"use client";

import { Suspense, useState } from "react";
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

const READING_CONFIG = {
  comprehensive: {
    title: "운명의 서를 펼치다",
    subtitle: "종합 사주 감정",
    features: [
      "사주명리학 기반 상세 분석",
      "자미두수 궁위 해석",
      "서양 점성술 차트 분석",
      "AI 종합 감정 리포트",
    ],
    buttonLabel: "감정받기",
    loadingLabel: "감정 시작 중...",
  },
  yearly: {
    title: "올해의 운명을 읽다",
    subtitle: "년운 분석",
    features: [
      "대운 + 세운 교차 분석",
      "12개월 월운 달력",
      "직업/재물/연애/건강 영역별 운세",
      "올해의 개운법",
    ],
    buttonLabel: "년운 분석받기",
    loadingLabel: "년운 분석 시작 중...",
  },
} as const;

function NewReadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const type = (searchParams.get("type") ?? "comprehensive") as
    | "comprehensive"
    | "yearly";
  const yearParam = searchParams.get("year");
  const targetYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = READING_CONFIG[type] ?? READING_CONFIG.comprehensive;

  async function handleGenerate() {
    if (!characterId) {
      setError("캐릭터 정보가 없습니다. 홈으로 돌아가 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = { characterId, type };
      if (type === "yearly") {
        body.targetYear = targetYear;
      }

      const res = await fetch("/api/reading/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "감정 생성에 실패했습니다");
      }

      router.push(`/reading/generating/${data.readingId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
      <h1 className="text-xl mb-6 font-[family-name:var(--font-pixel)] text-[#b8883c]">
        {type === "yearly" ? `📅 ${config.title}` : `⚔️ ${config.title}`}
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
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? config.loadingLabel : config.buttonLabel}
          </PixelButton>
          <p className="text-xs mt-3 text-[#8a8070]">
            결제 연동 전 테스트 모드 (무료)
          </p>
        </div>
      </PixelFrame>
    </div>
  );
}
