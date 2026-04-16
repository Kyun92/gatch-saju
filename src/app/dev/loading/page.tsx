"use client";

import { useState } from "react";
import GachaMachine from "@/components/loading/GachaMachine";
import GachaCapsuleOpen from "@/components/loading/GachaCapsuleOpen";
import PixelButton from "@/components/ui/PixelButton";

const MESSAGES = [
  "운명의 별자리를 해석하는 중...",
  "사주팔자의 기운을 분석합니다...",
  "자미두수의 별을 읽고 있습니다...",
  "세 가지 운명학을 교차 분석 중...",
];

export default function DevLoadingPage() {
  const [view, setView] = useState<"machine" | "capsule" | "done">("machine");
  const [msgIdx, setMsgIdx] = useState(0);

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      {/* 상단 컨트롤 */}
      <div className="flex gap-2 p-4 justify-center border-b-2 border-[#b8944c] bg-white">
        <PixelButton
          variant={view === "machine" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("machine")}
        >
          생성 중
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
      </div>

      {/* 로딩 화면 */}
      <div className="flex-1 flex items-center justify-center">
        {view === "machine" && (
          <GachaMachine message={MESSAGES[msgIdx]} />
        )}
        {view === "capsule" && (
          <GachaCapsuleOpen onComplete={() => setView("done")} />
        )}
        {view === "done" && (
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
        )}
      </div>
    </div>
  );
}
