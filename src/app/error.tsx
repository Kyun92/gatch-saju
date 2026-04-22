"use client";

import { useEffect } from "react";
import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <PixelFrame variant="accent" className="p-6 text-center w-full max-w-sm">
        <div className="text-4xl mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
          !
        </div>
        <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
          예상치 못한 오류
        </h1>
        <p className="text-sm mb-6 text-[#4a3e2c]">
          캡슐 기계가 잠시 흔들렸어요.
          <br />
          다시 시도하거나 잠시 후 돌아와주세요.
        </p>
        {error.digest && (
          <p className="text-[0.625rem] text-[#8a8070] mb-4">
            code: {error.digest}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <PixelButton onClick={reset}>다시 시도</PixelButton>
          <Link
            href="/"
            className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2"
          >
            홈으로
          </Link>
        </div>
      </PixelFrame>
    </div>
  );
}
