"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import PixelFrame from "@/components/ui/PixelFrame";
import TriSystemSymbol from "@/components/hub/TriSystemSymbol";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e8]">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 login-backdrop">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="mb-3 animate-px-glow inline-block px-6 py-2 m-0 leading-none">
            <span className="sr-only">갓챠사주</span>
            <Image
              src="/logo-2x.png"
              alt="갓챠사주"
              width={1000}
              height={300}
              priority
              className="block h-auto w-[220px] sm:w-[260px] [filter:drop-shadow(0_0_16px_rgba(154,112,64,0.4))_drop-shadow(0_0_32px_rgba(154,112,64,0.2))]"
            />
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

            {/* Naver */}
            <button
              onClick={() => signIn("naver", { callbackUrl: "/daily" })}
              aria-label="네이버로 시작하기"
              className="pixel-btn w-full px-5 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#03C75A] text-white border-2 border-[#02A84C] border-b-4 shadow-[0_2px_0_#018A3E]"
            >
              네이버로 시작하기
            </button>

            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/daily" })}
              aria-label="구글로 시작하기"
              className="pixel-btn w-full px-5 py-3 text-sm font-[family-name:var(--font-pixel)] bg-white text-[#333333] border-2 border-[#DDDDDD] border-b-4 shadow-[0_2px_0_#BBBBBB]"
            >
              Google로 시작하기
            </button>
          </div>
        </PixelFrame>

        {/* Blinking text */}
        <p className="mt-10 animate-blink text-sm font-[family-name:var(--font-pixel)] text-[#8a8070]">
          다음 캡슐엔 뭐가 들었을까
        </p>
      </div>
    </div>
  );
}
