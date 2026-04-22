"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import GachaMachine from "@/components/loading/GachaMachine";
import GachaCapsuleOpen from "@/components/loading/GachaCapsuleOpen";
import LoadingProgress from "@/components/loading/LoadingProgress";
import FortuneTipCard from "@/components/loading/FortuneTipCard";

/**
 * 현재 단계(0~3)에 따라 머신 위에 표시할 1줄 상태 메시지.
 * 깜빡임 없이 부드럽게 페이드 전환된다.
 */
const STATUS_MESSAGES = [
  "사주팔자의 기둥을 세우는 중...",
  "자미두수 12궁에 별을 배치하는 중...",
  "서양 점성술 차트를 계산하는 중...",
  "세 체계를 교차 해석하는 중...",
];

function statusMessageByProgress(progress: number): string {
  if (progress < 20) return STATUS_MESSAGES[0];
  if (progress < 45) return STATUS_MESSAGES[1];
  if (progress < 70) return STATUS_MESSAGES[2];
  return STATUS_MESSAGES[3];
}

type CharacterSummary = {
  name: string;
  mbti: string | null;
  free_summary: string | null;
};

export default function GeneratingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [status, setStatus] = useState<string>("generating");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterSummary | null>(null);

  // 진행 메시지를 progress와 동기화하기 위해 로컬 progress 추적 (UI용 근사값)
  const [uiProgress, setUiProgress] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const interval = setInterval(() => {
      if (status === "complete") {
        setUiProgress(100);
        return;
      }
      const elapsed = Date.now() - started;
      const expected = 120_000;
      if (elapsed < expected) {
        setUiProgress((elapsed / expected) * 95);
      } else {
        const overflow = elapsed - expected;
        const slow = 4 * (1 - Math.exp(-overflow / 40_000));
        setUiProgress(Math.min(99, 95 + slow));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [status]);

  // Poll status
  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/reading/status/${id}`);
      if (!res.ok) return;

      const data = (await res.json()) as {
        reading?: { status: string; error_message?: string };
        character?: CharacterSummary | null;
      };

      if (data.character && !character) {
        setCharacter(data.character);
      }

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
  }, [id, character]);

  useEffect(() => {
    // 첫 호출은 다음 tick에 예약 — effect body에서 setState를 직접 유발하지 않도록
    const kickoff = setTimeout(pollStatus, 0);
    const interval = setInterval(pollStatus, 3000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
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

  const currentMessage = statusMessageByProgress(uiProgress);

  // 생성 중 → 머신 + 진행도 + 체크리스트 + 팁카드
  return (
    <div className="w-full mx-auto flex flex-col items-center min-h-screen bg-[#f5f0e8] px-4 py-6 gap-5">
      {/* 가챠 머신 (흔들림 + 캡슐 바운스) */}
      <GachaMachine message={currentMessage} />

      {/* 현재 단계 메시지 페이드 전환 (머신 자체 message prop은 정적으로 두고, 시각적으로 한 번 더 강조) */}
      <div className="w-full max-w-sm min-h-[1.5rem] text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="font-[family-name:var(--font-body)] text-xs text-[#6a5e4c]"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 진행도 + 체크리스트 */}
      <LoadingProgress complete={status === "complete"} />

      {/* 팁 카드 로테이션 (개인화 + 상식 믹스) */}
      <FortuneTipCard character={character} />

      {/* 하단 안내 */}
      <p className="text-[0.625rem] font-[family-name:var(--font-pixel)] text-[#a89878] text-center mt-2 pb-4">
        감정에는 평균 1~2분 소요돼요. 창을 닫아도 생성은 계속됩니다.
      </p>
    </div>
  );
}
