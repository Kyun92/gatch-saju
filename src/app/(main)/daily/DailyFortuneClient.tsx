"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import GachaMachine from "@/components/loading/GachaMachine";
import GachaCapsuleOpen from "@/components/loading/GachaCapsuleOpen";
import FortuneTipCard from "@/components/loading/FortuneTipCard";
import overlayStyles from "./DailyOverlay.module.css";

interface DailyFortuneClientProps {
  characterId: string;
  character: {
    name: string;
    mbti: string | null;
    free_summary: string | null;
  };
}

type Stage = "idle" | "generating" | "capsule";

const DAILY_MESSAGES = [
  "별의 움직임을 관찰하는 중...",
  "오늘의 기운을 읽고 있습니다...",
  "운명의 흐름을 해석합니다...",
  "하루의 결을 다듬는 중...",
];

function FullscreenOverlay({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div className={overlayStyles.overlay}>
      {children}
    </div>,
    document.body,
  );
}

export default function DailyFortuneClient({
  characterId,
  character,
}: DailyFortuneClientProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (stage !== "generating") return;
    const id = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DAILY_MESSAGES.length);
    }, 2500);
    return () => clearInterval(id);
  }, [stage]);

  async function handleGetFortune() {
    setStage("generating");
    setError(null);
    setMessageIndex(0);

    try {
      const res = await fetch(`/api/daily?characterId=${encodeURIComponent(characterId)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "운세 생성에 실패했습니다");
      }
      setStage("capsule");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
      setStage("idle");
    }
  }

  const currentMessage = DAILY_MESSAGES[messageIndex];

  return (
    <>
      <PixelFrame variant="default" className="p-6 text-center">
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
          disabled={stage !== "idle"}
        >
          {stage === "idle" ? "오늘의 운세를 확인하세요" : "생성 중..."}
        </PixelButton>
      </PixelFrame>

      {stage === "generating" && (
        <FullscreenOverlay>
          <div className="w-full flex flex-col items-center px-4 py-6 gap-5 max-w-md">
            <GachaMachine message={currentMessage} />

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

            <FortuneTipCard character={character} />

            <p className="text-[0.625rem] font-[family-name:var(--font-pixel)] text-[#a89878] text-center mt-2">
              오늘의 기운은 잠시 후 도착합니다
            </p>
          </div>
        </FullscreenOverlay>
      )}

      {stage === "capsule" && (
        <FullscreenOverlay>
          <GachaCapsuleOpen onComplete={() => window.location.reload()} />
        </FullscreenOverlay>
      )}
    </>
  );
}
