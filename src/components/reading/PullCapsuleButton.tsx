"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CoinSvg from "@/components/ui/CoinSvg";

type ReadingType =
  | "comprehensive"
  | "yearly"
  | "compatibility"
  | "love"
  | "career"
  | "wealth"
  | "health"
  | "study";

interface PullCapsuleButtonProps {
  characterId: string;
  type?: ReadingType;
  characterId2?: string;
  targetYear?: number;
  label?: string;
  className?: string;
}

export default function PullCapsuleButton({
  characterId,
  type = "comprehensive",
  characterId2,
  targetYear,
  label = "운명 캡슐 뽑기",
  className = "",
}: PullCapsuleButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pull() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reading/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId,
          ...(characterId2 ? { characterId2 } : {}),
          type,
          ...(targetYear ? { targetYear } : {}),
        }),
      });

      const data = (await res.json()) as {
        readingId?: string;
        error?: string;
        code?: string;
      };

      if (res.status === 402 || data.code === "insufficient_balance") {
        const qs = searchParams?.toString();
        const returnTo = qs ? `${pathname}?${qs}` : pathname;
        router.push(`/coins?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      if (!res.ok || !data.readingId) {
        setError(data.error ?? "뽑기에 실패했습니다");
        setLoading(false);
        return;
      }

      router.push(`/reading/generating/${data.readingId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "뽑기 요청에 실패했습니다");
      setLoading(false);
    }
  }

  return (
    <div className={`w-full flex flex-col items-center gap-2 ${className}`}>
      {error && (
        <p className="font-[family-name:var(--font-pixel)] text-xs text-[#d04040]">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={pull}
        disabled={loading}
        className="gacha-coin-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`${label} 코인 1개 사용`}
      >
        <CoinSvg
          size={24}
          className={loading ? undefined : "animate-spin-coin"}
        />
        <span>{loading ? "뽑는 중..." : `${label} — 코인 1개`}</span>
      </button>
    </div>
  );
}
