"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import GachaMachine from "@/components/loading/GachaMachine";
import GachaCapsuleOpen from "@/components/loading/GachaCapsuleOpen";

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
      } else if (data.reading?.status === "error") {
        setStatus("error");
        setErrorMessage(
          data.reading.error_message ?? "알 수 없는 오류가 발생했습니다",
        );
      }
    } catch {
      // Silently retry on network error
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(pollStatus, 3000);
    pollStatus();
    return () => clearInterval(interval);
  }, [pollStatus]);

  // 에러 상태
  if (status === "error") {
    return (
      <div className="w-full mx-auto px-4 py-6 flex flex-col items-center justify-center max-w-[768px] min-h-[80vh]">
        <PixelFrame variant="accent" className="p-6 text-center w-full">
          <div className="text-4xl mb-4 font-[family-name:var(--font-pixel)] text-[#d04040]">
            X
          </div>
          <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
            감정 실패
          </h1>
          <p className="text-sm mb-6 text-[#4a3e2c]">
            {errorMessage}
          </p>
          <PixelButton onClick={() => router.push("/")}>
            홈으로 돌아가기
          </PixelButton>
        </PixelFrame>
      </div>
    );
  }

  // 생성 완료 → 캡슐 오픈 연출
  if (status === "complete") {
    return (
      <div className="w-full mx-auto flex flex-col items-center justify-center min-h-screen bg-[#f5f0e8]">
        <GachaCapsuleOpen onComplete={() => router.push(`/reading/${id}`)} />
      </div>
    );
  }

  // 생성 중 → 갓챠 머신
  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center min-h-screen bg-[#f5f0e8]">
      <GachaMachine message={PROGRESS_MESSAGES[messageIndex]} />
    </div>
  );
}
