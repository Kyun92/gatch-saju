"use client";

import { useState } from "react";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

interface DailyFortuneClientProps {
  characterId: string;
}

export default function DailyFortuneClient({ characterId }: DailyFortuneClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGetFortune() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/daily?characterId=${encodeURIComponent(characterId)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "운세 생성에 실패했습니다");
      }
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
      setLoading(false);
    }
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
      {error && (
        <p
          className="text-sm mb-4"
          style={{ fontFamily: "var(--font-pixel)", color: "#d04040" }}
        >
          {error}
        </p>
      )}
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
