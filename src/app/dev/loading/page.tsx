"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GachaMachine from "@/components/loading/GachaMachine";
import GachaCapsuleOpen from "@/components/loading/GachaCapsuleOpen";
import LoadingProgress from "@/components/loading/LoadingProgress";
import FortuneTipCard from "@/components/loading/FortuneTipCard";
import PixelButton from "@/components/ui/PixelButton";

const MESSAGES = [
  "운명의 별자리를 해석하는 중...",
  "사주팔자의 기운을 분석합니다...",
  "자미두수의 별을 읽고 있습니다...",
  "세 가지 운명학을 교차 분석 중...",
];

const MOCK_CHARACTER = {
  name: "이지연",
  mbti: "ISFJ",
  free_summary: "불꽃 수호자 — 조용하지만 꺼지지 않는 촛불",
};

function statusMessageByProgress(progress: number): string {
  if (progress < 20) return "사주팔자의 기둥을 세우는 중...";
  if (progress < 45) return "자미두수 12궁에 별을 배치하는 중...";
  if (progress < 70) return "서양 점성술 차트를 계산하는 중...";
  return "세 체계를 교차 해석하는 중...";
}

type View = "machine" | "capsule" | "fullset" | "done";

export default function DevLoadingPage() {
  const [view, setView] = useState<View>("fullset");
  const [msgIdx, setMsgIdx] = useState(0);
  const [fakeComplete, setFakeComplete] = useState(false);

  // fullset 뷰용 ui progress (generating 페이지와 동일한 로직)
  const [uiProgress, setUiProgress] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => {
      if (fakeComplete) {
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
    return () => clearInterval(id);
  }, [fakeComplete]);

  const currentMessage = statusMessageByProgress(uiProgress);

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      {/* 상단 컨트롤 */}
      <div className="flex flex-wrap gap-2 p-4 justify-center border-b-2 border-[#b8944c] bg-white">
        <PixelButton
          variant={view === "fullset" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("fullset")}
        >
          풀세트(신규)
        </PixelButton>
        <PixelButton
          variant={view === "machine" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("machine")}
        >
          머신만(구버전)
        </PixelButton>
        <PixelButton
          variant={view === "capsule" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("capsule")}
        >
          캡슐 오픈
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setView("machine");
            setMsgIdx((i) => (i + 1) % MESSAGES.length);
          }}
        >
          메시지 변경
        </PixelButton>
        {view === "fullset" && (
          <PixelButton
            variant={fakeComplete ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFakeComplete((v) => !v)}
          >
            {fakeComplete ? "100% 리셋" : "완료 시뮬"}
          </PixelButton>
        )}
      </div>

      {/* 뷰 */}
      <div className="flex-1 flex flex-col items-center justify-start">
        {view === "machine" && (
          <div className="flex items-center justify-center flex-1">
            <GachaMachine message={MESSAGES[msgIdx]} />
          </div>
        )}

        {view === "fullset" && (
          <div className="w-full flex flex-col items-center px-4 py-6 gap-5">
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

            <LoadingProgress complete={fakeComplete} />
            <FortuneTipCard character={MOCK_CHARACTER} />

            <p className="text-[0.625rem] font-[family-name:var(--font-pixel)] text-[#a89878] text-center mt-2 pb-4">
              감정에는 평균 1~2분 소요돼요. 창을 닫아도 생성은 계속됩니다.
            </p>
          </div>
        )}

        {view === "capsule" && (
          <div className="flex items-center justify-center flex-1">
            <GachaCapsuleOpen onComplete={() => setView("done")} />
          </div>
        )}

        {view === "done" && (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <p className="font-[family-name:var(--font-pixel)] text-lg text-[#9a7040] mb-4">
                캡슐 오픈 완료!
              </p>
              <p className="font-[family-name:var(--font-pixel)] text-sm text-[#8a8070] mb-6">
                이 시점에 결과 페이지로 이동합니다
              </p>
              <PixelButton onClick={() => setView("capsule")}>
                다시 보기
              </PixelButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
