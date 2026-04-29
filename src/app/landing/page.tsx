"use client";

import Image from "next/image";
import Link from "next/link";
import GachaHero from "@/components/landing/GachaHero";
import InsertCoinCTA from "@/components/landing/InsertCoinCTA";
import PixelStarfield from "@/components/landing/PixelStarfield";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative flex-1 min-h-[100svh] overflow-hidden flex flex-col items-center justify-between px-4 py-6 bg-[#f5f0e8] landing-backdrop">
      <PixelStarfield />

      {/* 상단: 네온 간판 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-1 pt-2"
      >
        <h1 className="animate-px-glow inline-block px-6 py-2 m-0 leading-none">
          <span className="sr-only">갓챠사주</span>
          <Image
            src="/logo-2x.png"
            alt="갓챠사주"
            width={1000}
            height={300}
            priority
            className="block h-auto w-[220px] sm:w-[280px] [filter:drop-shadow(0_0_16px_rgba(154,112,64,0.4))_drop-shadow(0_0_32px_rgba(154,112,64,0.2))]"
          />
        </h1>
        <p className="font-[family-name:var(--font-pixel)] text-[0.625rem] sm:text-xs tracking-[0.3em] text-[#8a8070]">
          ARCADE FORTUNE CABINET
        </p>
      </motion.div>

      {/* 중앙: 가챠 머신 + 카피 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 my-4"
      >
        <GachaHero />

        {/* 게임 스타일 헤드라인 */}
        <div className="text-center flex flex-col gap-2 max-w-sm px-4 mt-2">
          <p className="font-[family-name:var(--font-pixel)] text-lg sm:text-xl text-[#2c2418] leading-tight">
            새 캡슐이
            <br />
            네 운명을 알려주지
          </p>
          <p className="font-[family-name:var(--font-pixel)] text-[0.625rem] tracking-[0.25em] text-[#6a5e4c]">
            PRESS START TO TURN FATE
          </p>
          <p className="font-[family-name:var(--font-body)] text-xs text-[#6a5e4c] mt-1">
            사주 · 자미두수 · 점성술 · MBTI — 4가지 운명학 한 판
          </p>
        </div>
      </motion.div>

      {/* 하단: CTA + 푸터 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-4 pb-2"
      >
        <InsertCoinCTA />
        <p className="animate-blink text-xs font-[family-name:var(--font-pixel)] text-[#8a8070] mt-2">
          다음 캡슐엔 뭐가 들었을까
        </p>
        <Link
          href="/pricing"
          className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#9a7040] underline underline-offset-2 tracking-widest"
        >
          요금 안내
        </Link>
      </motion.div>
    </div>
  );
}
