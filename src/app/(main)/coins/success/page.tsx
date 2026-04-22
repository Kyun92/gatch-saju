"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import CoinSvg from "@/components/ui/CoinSvg";
import { getCoinPackage } from "@/lib/coins/packages";

export default function CoinsSuccessPage() {
  return (
    <Suspense>
      <CoinsSuccessContent />
    </Suspense>
  );
}

type Phase = "confirming" | "done" | "error";

interface SuccessResult {
  balance: number;
  quantity: number;
}

function CoinsSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>("confirming");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SuccessResult | null>(null);

  const confirmedRef = useRef(false);
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    async function confirm() {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const packageId = searchParams.get("packageId");

      if (!paymentKey || !orderId || !amount || !packageId) {
        setError("결제 정보가 누락되었습니다");
        setPhase("error");
        return;
      }

      const pkg = getCoinPackage(packageId);
      if (!pkg) {
        setError("유효하지 않은 상품입니다");
        setPhase("error");
        return;
      }

      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            packageId,
          }),
        });

        const data = (await res.json()) as {
          ok?: boolean;
          balance?: number;
          quantity?: number;
          error?: string;
        };

        if (!res.ok || !data.ok) {
          setError(data.error ?? "결제 확인에 실패했습니다");
          setPhase("error");
          return;
        }

        setResult({
          balance: data.balance ?? 0,
          quantity: data.quantity ?? pkg.quantity,
        });
        setPhase("done");
      } catch (e) {
        setError(e instanceof Error ? e.message : "결제 확인 오류");
        setPhase("error");
      }
    }

    confirm();
  }, [searchParams]);

  if (phase === "confirming") {
    return (
      <div className="w-full mx-auto px-4 py-10 flex flex-col items-center justify-center max-w-[480px] min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <CoinSvg size={40} className="animate-spin-coin" />
          <p className="font-[family-name:var(--font-pixel)] text-sm text-[#9a7040]">
            충전 확인 중...
          </p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="w-full mx-auto px-4 py-6 flex flex-col items-center justify-center max-w-[480px] min-h-[80vh]">
        <PixelFrame variant="accent" className="p-6 text-center w-full">
          <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
            충전 확인 실패
          </h1>
          <p className="text-sm mb-6 text-[#4a3e2c]">{error}</p>
          <p className="text-xs text-[#8a8070] mb-4">
            결제가 완료되었다면 고객센터로 문의해주세요
          </p>
          <PixelButton onClick={() => router.push("/")}>홈으로</PixelButton>
        </PixelFrame>
      </div>
    );
  }

  // done
  return (
    <div className="w-full mx-auto px-4 py-10 flex flex-col items-center justify-center max-w-[480px] min-h-[80vh]">
      <PixelFrame
        variant="accent"
        className="p-6 text-center w-full flex flex-col items-center gap-5"
      >
        <p className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] tracking-[0.25em]">
          CHARGE COMPLETE
        </p>

        <div className="flex items-center gap-2">
          <CoinSvg size={36} />
          <span className="font-[family-name:var(--font-pixel)] text-4xl text-[#b8883c]">
            +{result?.quantity ?? 0}
          </span>
        </div>

        <p className="font-[family-name:var(--font-pixel)] text-sm text-[#4a3e2c]">
          충전 완료!
        </p>

        <div className="w-full flex items-center justify-between bg-white/60 border border-[#e2d8c3] p-3">
          <span className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#8a8070]">
            현재 잔액
          </span>
          <div className="flex items-center gap-1">
            <CoinSvg size={16} />
            <span className="font-[family-name:var(--font-pixel)] text-base text-[#b8883c]">
              {result?.balance ?? 0}
            </span>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2 mt-2">
          {returnTo ? (
            <>
              <PixelButton onClick={() => router.push(returnTo)} size="lg">
                뽑으러 가기
              </PixelButton>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2"
              >
                허브로 가기
              </button>
            </>
          ) : (
            <>
              <PixelButton onClick={() => router.push("/")} size="lg">
                캐릭터 선택하러 가기
              </PixelButton>
              <button
                type="button"
                onClick={() => router.push("/mypage")}
                className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2"
              >
                마이페이지
              </button>
            </>
          )}
        </div>
      </PixelFrame>
    </div>
  );
}
