import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import CoinSvg from "@/components/ui/CoinSvg";
import Footer from "@/components/layout/Footer";
import { COIN_PACKAGES, formatWon } from "@/lib/coins/packages";

export const metadata: Metadata = {
  title: "요금 안내 | 갓챠사주",
  description:
    "갓챠사주 코인 패키지 요금 안내. 1개 990원부터 10개 7,900원까지, 최대 20% 할인.",
  robots: { index: true, follow: true },
};

export default async function PricingPage() {
  const session = await auth();
  if (session?.user?.userId) {
    redirect("/coins");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f0e8]">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 bg-white border-b-2 border-[#b8944c] h-12">
        <Link
          href="/landing"
          className="font-[family-name:var(--font-pixel)] text-xs text-[#9a7040] no-underline"
        >
          ← 홈
        </Link>
        <span className="font-[family-name:var(--font-pixel)] text-sm text-[#2c2418] absolute left-1/2 -translate-x-1/2">
          요금 안내
        </span>
        <Link
          href="/login"
          className="font-[family-name:var(--font-pixel)] text-xs text-[#9a7040] no-underline"
        >
          로그인
        </Link>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-pixel)] text-xl text-[#9a7040] mb-2">
            코인 패키지
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[#6a5e4c]">
            코인 1개로 감정 1건을 뽑을 수 있어요. 많이 담을수록 개당 단가가
            내려갑니다.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {COIN_PACKAGES.map((pkg) => {
            const hasDiscount = pkg.discountPct > 0;
            return (
              <div
                key={pkg.id}
                className="relative bg-white border-2 border-[#b8944c] p-4 flex items-center justify-between"
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
                      개당 {formatWon(pkg.perCoin)}
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
                    {formatWon(pkg.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/login" className="no-underline block">
          <PixelButton size="lg" className="w-full">
            로그인하고 충전하기
          </PixelButton>
        </Link>

        <PixelFrame variant="simple" className="p-4 flex flex-col gap-2">
          <p className="font-[family-name:var(--font-pixel)] text-[0.75rem] text-[#9a7040]">
            결제·환불 안내
          </p>
          <ul className="font-[family-name:var(--font-body)] text-[0.6875rem] text-[#4a3e2c] leading-relaxed list-disc pl-4">
            <li>결제는 토스페이먼츠를 통해 안전하게 이루어집니다 (카드·간편결제 지원).</li>
            <li>결제 완료 즉시 계정에 코인이 충전됩니다.</li>
            <li>코인 1개로 종합감정·년운·궁합·카테고리별 감정 등 유료 상품을 1건 뽑을 수 있습니다.</li>
            <li>일일운세는 코인과 무관하게 무료입니다.</li>
            <li>충전한 코인은 <strong>유효기간 없음</strong>. 회원 상태가 유지되는 한 계속 사용 가능합니다.</li>
            <li>
              결제일 기준 <strong>7일 이내 미사용 코인은 전액 환불</strong> 가능합니다.
              자세한 기준은 <Link href="/refund" className="text-[#9a7040] underline">환불정책</Link>을 확인해 주세요.
            </li>
          </ul>
        </PixelFrame>

        <div className="text-center">
          <p className="font-[family-name:var(--font-body)] text-[0.625rem] text-[#8a8070]">
            문의: 010-6889-8909 · lsk9105@gmail.com
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
