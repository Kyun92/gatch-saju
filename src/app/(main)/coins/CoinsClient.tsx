"use client";

import { useRef, useState } from "react";
import PixelFrame from "@/components/ui/PixelFrame";
import CoinSvg from "@/components/ui/CoinSvg";
import { formatWon, REFUND_WINDOW_DAYS, type CoinPackage } from "@/lib/coins/packages";
import {
  WALLET_LABEL,
  BALANCE_LABEL,
  COIN_LABEL,
  formatCapsuleCount,
} from "@/lib/copy/gacha-terms";

interface CoinsClientProps {
  packages: CoinPackage[];
  initialBalance: number;
  returnTo: string | null;
  userId: string;
}

export default function CoinsClient({
  packages,
  initialBalance,
  returnTo,
  userId,
}: CoinsClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentRef = useRef<any>(null);

  async function handlePurchase(pkg: CoinPackage) {
    setLoadingId(pkg.id);
    setError(null);

    try {
      if (!paymentRef.current) {
        const { loadTossPayments } = await import(
          "@tosspayments/tosspayments-sdk"
        );
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          setError("결제 설정이 누락되었습니다");
          setLoadingId(null);
          return;
        }
        const tossPayments = await loadTossPayments(clientKey);
        paymentRef.current = tossPayments.payment({
          customerKey: userId,
        });
      }

      const orderId = `COIN_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const successQuery = new URLSearchParams({ packageId: pkg.id });
      if (returnTo) successQuery.set("returnTo", returnTo);

      await paymentRef.current.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: pkg.price },
        orderId,
        orderName: pkg.orderName,
        successUrl: `${window.location.origin}/coins/success?${successQuery.toString()}`,
        failUrl: `${window.location.origin}/coins/fail`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "결제 요청에 실패했습니다";
      if (
        !msg.includes("USER_CANCEL") &&
        !msg.includes("PAY_PROCESS_CANCELED")
      ) {
        setError(msg);
      }
      setLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center">
      <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
        {/* 잔액 카드 */}
        <PixelFrame variant="accent" className="p-5 text-center">
          <p className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] tracking-[0.25em] mb-2">
            {WALLET_LABEL}
          </p>
          <div className="flex items-center justify-center gap-2">
            <CoinSvg size={28} />
            <span className="font-[family-name:var(--font-pixel)] text-3xl text-[#b8883c]">
              {initialBalance}
            </span>
          </div>
          <p className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] mt-2">
            {BALANCE_LABEL}
          </p>
        </PixelFrame>

        <div className="text-center">
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-[#9a7040] mb-1">
            {COIN_LABEL} 충전
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[#6a5e4c]">
            많이 담을수록 개당 단가가 내려갑니다
          </p>
        </div>

        {returnTo && (
          <div className="flex items-center gap-2 px-3 py-2 border border-[#d4b070] bg-[#faf7f2]">
            <span className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#9a7040] tracking-widest">
              TIP
            </span>
            <p className="font-[family-name:var(--font-body)] text-[0.6875rem] text-[#4a3e2c]">
              충전이 끝나면 원래 뽑으려던 곳으로 바로 돌아갑니다
            </p>
          </div>
        )}

        {error && (
          <PixelFrame variant="simple" className="p-3 text-center">
            <p className="font-[family-name:var(--font-pixel)] text-xs text-[#d04040]">
              {error}
            </p>
          </PixelFrame>
        )}

        {/* 패키지 목록 */}
        <div className="flex flex-col gap-3">
          {packages.map((pkg) => {
            const loading = loadingId === pkg.id;
            const hasDiscount = pkg.discountPct > 0;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => handlePurchase(pkg)}
                disabled={loadingId !== null}
                className="group relative bg-white border-2 border-[#b8944c] p-4 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#faf7f2] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <CoinSvg size={22} />
                    <span className="font-[family-name:var(--font-pixel)] text-lg text-[#4a3e2c]">
                      {pkg.quantity}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-[family-name:var(--font-pixel)] text-sm text-[#2c2418]">
                      {pkg.label}
                    </span>
                    <span className="font-[family-name:var(--font-body)] text-[0.625rem] text-[#8a8070]">
                      {pkg.capsuleLabel} · 개당 {formatWon(pkg.perCoin)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <span className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-white bg-[#d04040] px-1.5 py-[2px]">
                      -{pkg.discountPct}%
                    </span>
                  )}
                  <span className="font-[family-name:var(--font-pixel)] text-base text-[#9a7040]">
                    {loading ? "결제 중..." : formatWon(pkg.price)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="font-[family-name:var(--font-body)] text-[0.625rem] text-[#8a8070] text-center leading-relaxed">
          · 결제 후 즉시 잔액에 반영됩니다
          <br />· 미사용 {COIN_LABEL}은 결제일 기준 {REFUND_WINDOW_DAYS}일 내 전액 환불 가능
          <br />· 유효기간 없음 · {formatCapsuleCount(1)} = 유료 감정 1건
        </p>
      </div>
    </div>
  );
}
