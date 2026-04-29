"use client";

import { signIn } from "next-auth/react";
import PixelFrame from "@/components/ui/PixelFrame";
import TriSystemSymbol from "@/components/hub/TriSystemSymbol";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-sm"
          >
            <PixelFrame variant="accent" className="w-full p-6 bg-[#f5f0e8]">
              <div className="text-center mb-6">
                <p className="text-lg mb-2 font-[family-name:var(--font-pixel)] text-[#9a7040]">
                  플레이어 인증
                </p>
                <div className="flex justify-center my-3">
                  <TriSystemSymbol size="mini" />
                </div>
                <p className="text-sm font-[family-name:var(--font-pixel)] text-[#8a8070]">
                  소셜 계정으로 로그인하여 캡슐을 확인하세요
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => signIn("kakao", { callbackUrl: "/daily" })}
                  className="pixel-btn w-full px-5 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#FEE500] text-[#191919] border-2 border-[#E5CF00] border-b-4 shadow-[0_2px_0_#B8A600]"
                >
                  카카오로 시작하기
                </button>
                {/*
                  네이버/구글 버튼은 출시 1차에서 비활성화.
                  활성화 시 login/page.tsx와 동시에 복원.
                */}
                <button
                  onClick={onClose}
                  className="pixel-btn w-full px-5 py-2 mt-2 text-xs font-[family-name:var(--font-pixel)] bg-[#e2d8c3] text-[#8a8070] border-2 border-[#d0c6b3] border-b-4 shadow-[0_2px_0_#c0b6a3]"
                >
                  닫기
                </button>
              </div>
            </PixelFrame>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
