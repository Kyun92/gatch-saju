"use client";

import { useState } from "react";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import GachaMachine from "@/components/loading/GachaMachine";
import GachaCapsuleOpen from "@/components/loading/GachaCapsuleOpen";

interface DailyFortuneClientProps {
  characterId: string;
}

type Stage = "idle" | "generating" | "capsule";

const DAILY_MESSAGES = [
  "별의 움직임을 관찰하는 중...",
  "오늘의 기운을 읽고 있습니다...",
  "운명의 흐름을 해석합니다...",
  "당신의 하루를 점치는 중...",
];

export default function DailyFortuneClient({ characterId }: DailyFortuneClientProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  async function handleGetFortune() {
    setStage("generating");
    setError(null);

    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DAILY_MESSAGES.length);
    }, 2500);

    try {
      const res = await fetch(`/api/daily?characterId=${encodeURIComponent(characterId)}`);
      clearInterval(msgInterval);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "운세 생성에 실패했습니다");
      }
      setStage("capsule");
    } catch (e) {
      clearInterval(msgInterval);
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
      setStage("idle");
    }
  }

  if (stage === "generating") {
    return (
      <div className="w-full mx-auto flex flex-col items-center justify-center min-h-screen fixed inset-0 z-50 bg-[#f5f0e8]">
        <GachaMachine message={DAILY_MESSAGES[messageIndex]} />
      </div>
    );
  }

  if (stage === "capsule") {
    return (
      <div className="w-full mx-auto flex flex-col items-center justify-center min-h-screen fixed inset-0 z-50 bg-[#f5f0e8]">
        <GachaCapsuleOpen onComplete={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <PixelFrame variant="default" className="p-6 text-center">
      <div
        className="text-4xl mb-4"
        role="img"
        aria-label="scroll"
      >

      </div>
      <p className="text-sm mb-6 font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
        오늘의 운세가 아직 열리지 않았습니다
      </p>
      {error && (
        <p className="text-sm mb-4 font-[family-name:var(--font-pixel)] text-[#d04040]">
          {error}
        </p>
      )}
      <PixelButton
        onClick={handleGetFortune}
        size="lg"
      >
        오늘의 운세를 확인하세요
      </PixelButton>
    </PixelFrame>
  );
}
