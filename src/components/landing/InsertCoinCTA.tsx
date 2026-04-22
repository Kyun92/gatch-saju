"use client";

import { useState } from "react";
import CoinSvg from "@/components/ui/CoinSvg";
import { LoginModal } from "@/components/login/LoginModal";
import { motion } from "framer-motion";

export default function InsertCoinCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 0.98, y: 2 }}
          whileTap={{ scale: 0.95, y: 4 }}
          className="gacha-coin-btn"
          aria-label="운명 캡슐 뽑기 — 로그인으로 이동"
        >
          <CoinSvg size={32} className="animate-spin-coin" />
          <span className="transition-colors duration-200">
            지금 가챠 돌리기
          </span>
        </motion.button>
        <p className="font-[family-name:var(--font-pixel)] text-xs text-[#5a4e3c] tracking-wider">
          한 판 990원부터 · 묶음 살수록 할인
        </p>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
