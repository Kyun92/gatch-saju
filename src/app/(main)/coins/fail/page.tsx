"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import { getPaymentErrorMessage } from "@/lib/copy/payment-errors";
import {
  PAYMENT_FAIL_HEADLINE,
  PAYMENT_RETRY_LABEL,
  PAYMENT_ERROR_DETAILS_TOGGLE,
} from "@/lib/copy/gacha-terms";

export default function CoinsFailPage() {
  return (
    <Suspense>
      <CoinsFailContent />
    </Suspense>
  );
}

function CoinsFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const overrideMessage = searchParams.get("message");
  const message = overrideMessage ?? getPaymentErrorMessage(code);

  return (
    <div className="w-full mx-auto px-4 py-6 flex flex-col items-center justify-center max-w-[480px] min-h-[80vh]">
      <PixelFrame variant="accent" className="p-6 text-center w-full">
        <div className="text-4xl mb-4 font-[family-name:var(--font-pixel)] text-[#d04040]">
          X
        </div>
        <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
          {PAYMENT_FAIL_HEADLINE}
        </h1>
        <p className="text-sm mb-6 text-[#4a3e2c]">{message}</p>

        {code && (
          <details className="payment-error-details mb-4">
            <summary className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] cursor-pointer underline underline-offset-2 list-none">
              {PAYMENT_ERROR_DETAILS_TOGGLE}
            </summary>
            <p className="mt-2 text-xs text-[#8a8070] font-[family-name:var(--font-pixel)] tracking-wider">
              {code}
            </p>
          </details>
        )}

        <div className="flex flex-col gap-2">
          <PixelButton onClick={() => router.push("/coins")}>
            {PAYMENT_RETRY_LABEL}
          </PixelButton>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2"
          >
            홈으로
          </button>
        </div>
      </PixelFrame>
    </div>
  );
}
