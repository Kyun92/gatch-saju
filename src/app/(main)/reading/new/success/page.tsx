"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GachaMachine from "@/components/loading/GachaMachine";

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}

const PROGRESS_MESSAGES = [
  "결제가 확인되었습니다...",
  "운명의 별자리를 해석하는 중...",
  "사주팔자의 기운을 분석합니다...",
  "자미두수의 별을 읽고 있습니다...",
  "서양 점성술 차트를 계산합니다...",
  "세 가지 운명학을 교차 분석 중...",
  "당신만의 운세를 작성하고 있습니다...",
];

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const confirmedRef = useRef(false);

  // 메시지 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 결제 승인 + 감정 생성
  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    async function confirmAndGenerate() {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const characterId = searchParams.get("characterId");
      const characterId2 = searchParams.get("characterId2");
      const type = searchParams.get("type") ?? "comprehensive";
      const targetYear = searchParams.get("targetYear");

      if (!paymentKey || !orderId || !amount || !characterId) {
        setError("결제 정보가 누락되었습니다");
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
            characterId,
            ...(characterId2 ? { characterId2 } : {}),
            type,
            ...(targetYear ? { targetYear: Number(targetYear) } : {}),
          }),
        });

        const data = (await res.json()) as {
          readingId?: string;
          error?: string;
        };

        if (!res.ok || !data.readingId) {
          throw new Error(data.error ?? "결제 확인에 실패했습니다");
        }

        // 감정 생성이 시작됨 → generating 페이지로 이동
        router.replace(`/reading/generating/${data.readingId}`);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "결제 확인 중 오류가 발생했습니다",
        );
      }
    }

    confirmAndGenerate();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="w-full mx-auto px-4 py-6 flex flex-col items-center justify-center max-w-[768px] min-h-[80vh]">
        <div className="p-6 text-center border-2 border-[#d04040] bg-white">
          <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#d04040]">
            결제 확인 실패
          </h1>
          <p className="text-sm mb-6 text-[#4a3e2c]">{error}</p>
          <p className="text-xs text-[#8a8070]">
            결제가 완료되었다면 고객센터에 문의해주세요.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-[#9a7040] text-white font-[family-name:var(--font-pixel)] text-sm"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center min-h-screen bg-[#f5f0e8]">
      <GachaMachine message={PROGRESS_MESSAGES[messageIndex]} />
    </div>
  );
}
