"use client";

import { useState } from "react";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

export default function DailyFortuneClient() {
  const [loading, setLoading] = useState(false);

  async function handleGetFortune() {
    setLoading(true);
    // TODO: Call API to generate daily fortune
    // For now, just reload after a delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  return (
    <PixelFrame variant="default" className="p-6 text-center">
      <div
        className="text-4xl mb-4"
        role="img"
        aria-label="scroll"
      >
        📜
      </div>
      <p
        className="text-sm mb-6"
        style={{ fontFamily: "var(--font-pixel)", color: "#4a3e2c" }}
      >
        오늘의 운세가 아직 열리지 않았습니다
      </p>
      <PixelButton
        onClick={handleGetFortune}
        disabled={loading}
        size="lg"
      >
        {loading ? "해독 중..." : "오늘의 운세를 확인하세요"}
      </PixelButton>
    </PixelFrame>
  );
}
