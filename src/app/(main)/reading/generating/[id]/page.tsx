"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

const PROGRESS_MESSAGES = [
  "운명의 별자리를 해석하는 중...",
  "사주팔자의 기운을 분석합니다...",
  "자미두수의 별을 읽고 있습니다...",
  "서양 점성술 차트를 계산합니다...",
  "세 가지 운명학을 교차 분석 중...",
  "오행의 균형을 탐색합니다...",
  "당신만의 운세를 작성하고 있습니다...",
  "거의 완성되었습니다...",
];

export default function GeneratingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [messageIndex, setMessageIndex] = useState(0);
  const [status, setStatus] = useState<string>("generating");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cycle progress messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Poll status
  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/reading/status/${id}`);
      if (!res.ok) return;

      const data = (await res.json()) as {
        reading?: { status: string; error_message?: string };
      };

      if (data.reading?.status === "complete") {
        setStatus("complete");
        router.push(`/reading/${id}`);
      } else if (data.reading?.status === "error") {
        setStatus("error");
        setErrorMessage(
          data.reading.error_message ?? "알 수 없는 오류가 발생했습니다",
        );
      }
    } catch {
      // Silently retry on network error
    }
  }, [id, router]);

  useEffect(() => {
    const interval = setInterval(pollStatus, 3000);
    // Also poll immediately
    pollStatus();
    return () => clearInterval(interval);
  }, [pollStatus]);

  if (status === "error") {
    return (
      <div className="w-full mx-auto px-4 py-6 flex flex-col items-center justify-center max-w-[768px] min-h-[80vh]">
        <PixelFrame variant="accent" className="p-6 text-center w-full">
          <div className="text-4xl mb-4 font-[family-name:var(--font-pixel)]">
            &#x274C;
          </div>
          <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
            감정 실패
          </h1>
          <p className="text-sm mb-6 text-[#4a3e2c]">
            {errorMessage}
          </p>
          <PixelButton onClick={() => router.push("/reading/new")}>
            다시 시도하기
          </PixelButton>
        </PixelFrame>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-6 flex flex-col items-center justify-center max-w-[768px] min-h-[80vh]">
      <PixelFrame variant="accent" className="p-8 text-center w-full">
        {/* Spinning crystal ball */}
        <div className="text-5xl mb-6 animate-spin-slow font-[family-name:var(--font-pixel)]">
          &#x1F52E;
        </div>

        {/* Title */}
        <h1 className="text-lg mb-2 font-[family-name:var(--font-pixel)] text-[#b8883c]">
          운세를 감정하고 있습니다
        </h1>

        {/* Blinking progress message */}
        <p className="text-sm animate-pulse font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
          {PROGRESS_MESSAGES[messageIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#b8883c] transition-opacity duration-300"
              style={{
                opacity: ((messageIndex + i) % 3) === 0 ? 1 : 0.3,
              }}
            />
          ))}
        </div>

        <p className="text-xs mt-6 text-[#8a8070]">
          약 30초~1분 정도 소요됩니다
        </p>
      </PixelFrame>
    </div>
  );
}
