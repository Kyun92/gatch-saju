"use client";

import { signIn } from "next-auth/react";
import PixelFrame from "@/components/ui/PixelFrame";
import TriSystemSymbol from "@/components/hub/TriSystemSymbol";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e8]">
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 py-8"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(46,139,78,0.06) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 30%, rgba(48,112,192,0.06) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 80%, rgba(208,64,64,0.05) 0%, transparent 50%)",
        }}
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl mb-3 animate-px-glow inline-block px-6 py-2 font-[family-name:var(--font-pixel)] text-[#9a7040]"
            style={{
              textShadow: "0 0 16px rgba(154,112,64,0.4), 0 0 32px rgba(154,112,64,0.2)",
            }}
          >
            갓챠사주
          </h1>
          <p className="text-lg mb-4 font-[family-name:var(--font-pixel)] text-[#9a7040]">
            네 운명, 한 판 뽑아봐
          </p>
          <TriSystemSymbol size="medium" />
          <p className="mt-3 text-xs font-[family-name:var(--font-pixel)] text-[#8a8070] tracking-widest">
            사주 × 자미두수 × 서양점성술
          </p>
        </div>

        {/* Login Card */}
        <PixelFrame variant="accent" className="w-full max-w-sm p-6">
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm mb-2 font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
              캡슐을 뽑으려면 로그인하세요
            </p>

            {/* Kakao */}
            <button
              onClick={() => signIn("kakao", { callbackUrl: "/daily" })}
              className="pixel-btn w-full px-5 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#FEE500] text-[#191919] border-2 border-[#E5CF00] border-b-4 shadow-[0_2px_0_#B8A600]"
            >
              카카오로 시작하기
            </button>

            {/* Naver — 준비 중 */}
            <button
              disabled
              aria-label="네이버 로그인 준비 중"
              className="pixel-btn w-full px-5 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#03C75A]/40 text-white/70 border-2 border-[#02A84C]/40 border-b-4 shadow-[0_2px_0_#018A3E]/30 cursor-not-allowed"
            >
              네이버 · 준비 중
            </button>

            {/* Google — 준비 중 */}
            <button
              disabled
              aria-label="구글 로그인 준비 중"
              className="pixel-btn w-full px-5 py-3 text-sm font-[family-name:var(--font-pixel)] bg-white/60 text-[#333333]/50 border-2 border-[#DDDDDD] border-b-4 shadow-[0_2px_0_#BBBBBB] cursor-not-allowed"
            >
              Google · 준비 중
            </button>
          </div>
        </PixelFrame>

        {/* Blinking text */}
        <p className="mt-10 animate-blink text-sm font-[family-name:var(--font-pixel)] text-[#8a8070]">
          다음 캡슐엔 뭐가 들었을까
        </p>
      </div>
      <Footer />
    </div>
  );
}
