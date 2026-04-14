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

function NewReadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
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
        body: JSON.stringify({ characterId }),
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
    <div
      className="w-full mx-auto px-4 py-6"
      style={{ maxWidth: "768px", minHeight: "100vh" }}
    >
      <h1
        className="text-xl mb-6"
        style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
      >
        ⚔️ 운명의 서를 펼치다
      </h1>

      <PixelFrame variant="accent" className="p-6">
        <div className="text-center">
          <div className="mb-6">
            <p
              className="text-sm mb-2"
              style={{ fontFamily: "var(--font-pixel)", color: "#4a3e2c" }}
            >
              종합 사주 감정
            </p>
            <p
              className="text-3xl"
              style={{ fontFamily: "var(--font-pixel)", color: "#c8a020" }}
            >
              990원
            </p>
          </div>

          <div className="mb-6 text-left">
            <div className="flex flex-col gap-2">
              {[
                "사주명리학 기반 상세 분석",
                "자미두수 궁위 해석",
                "서양 점성술 차트 분석",
                "AI 종합 감정 리포트",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "#2c2418" }}
                >
                  <span style={{ color: "#2e8b4e", fontFamily: "var(--font-pixel)" }}>
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p
              className="text-sm mb-4"
              style={{ fontFamily: "var(--font-pixel)", color: "#d04040" }}
            >
              {error}
            </p>
          )}

          <PixelButton
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "감정 시작 중..." : "감정받기"}
          </PixelButton>
          <p className="text-xs mt-3" style={{ color: "#8a8070" }}>
            결제 연동 전 테스트 모드 (무료)
          </p>
        </div>
      </PixelFrame>
    </div>
  );
}
