"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

export default function CoinsFailPage() {
  return (
    <Suspense>
      <CoinsFailContent />
    </Suspense>
  );
}

const ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제가 취소되었습니다.",
  PAY_PROCESS_ABORTED: "결제가 중단되었습니다.",
  REJECT_CARD_COMPANY: "카드사에서 결제를 거절했습니다.",
  USER_CANCEL: "결제를 취소했습니다.",
};

function CoinsFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const message =
    searchParams.get("message") ??
    ERROR_MESSAGES[code] ??
    "결제에 실패했습니다.";

  return (
    <div className="w-full mx-auto px-4 py-6 flex flex-col items-center justify-center max-w-[480px] min-h-[80vh]">
      <PixelFrame variant="accent" className="p-6 text-center w-full">
        <div className="text-4xl mb-4 font-[family-name:var(--font-pixel)] text-[#d04040]">
          X
        </div>
        <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
          결제 실패
        </h1>
        <p className="text-sm mb-6 text-[#4a3e2c]">{message}</p>
        {code && (
          <p className="text-xs mb-4 text-[#8a8070]">오류 코드: {code}</p>
        )}
        <div className="flex flex-col gap-2">
          <PixelButton onClick={() => router.push("/coins")}>
            다시 시도
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
