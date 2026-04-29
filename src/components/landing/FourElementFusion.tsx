"use client";

import { motion } from "framer-motion";

type ElementProps = {
  svg: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  top: string;
  left: string;
  xOffset: number;
  yOffset: number;
};

const ELEMENTS: ElementProps[] = [
  {
    label: "명리",
    color: "#6c665e",
    bg: "rgba(154,112,64,0.12)",
    top: "5%",
    left: "5%",
    xOffset: 65,
    yOffset: 65,
    svg: (
      <svg width="16" height="16" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" className="four-element-svg">
        <rect x="2" y="0" width="4" height="8" fill="#333"/>
        <rect x="0" y="2" width="8" height="4" fill="#333"/>
        <rect x="1" y="1" width="6" height="6" fill="#333"/>
        <rect x="4" y="0" width="2" height="8" fill="#EEE"/>
        <rect x="4" y="2" width="4" height="4" fill="#EEE"/>
        <rect x="2" y="2" width="2" height="2" fill="#EEE"/>
        <rect x="4" y="4" width="2" height="2" fill="#333"/>
      </svg>
    ),
  },
  {
    label: "자미",
    color: "#eab308",
    bg: "rgba(251,191,36,0.12)",
    top: "5%",
    left: "calc(95% - 48px)",
    xOffset: -65,
    yOffset: 65,
    svg: (
      <svg width="16" height="16" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" className="four-element-svg">
        <rect x="3" y="0" width="2" height="8" fill="#FBBF24"/>
        <rect x="0" y="3" width="8" height="2" fill="#FBBF24"/>
        <rect x="2" y="2" width="4" height="4" fill="#FBBF24"/>
      </svg>
    ),
  },
  {
    label: "점성",
    color: "#d97706",
    bg: "rgba(251,191,36,0.12)",
    top: "calc(95% - 48px)",
    left: "calc(95% - 48px)",
    xOffset: -65,
    yOffset: -65,
    svg: (
      <svg width="16" height="16" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" className="four-element-svg">
        <rect x="2" y="1" width="2" height="1" fill="#FBBF24"/>
        <rect x="1" y="2" width="2" height="4" fill="#FBBF24"/>
        <rect x="2" y="6" width="2" height="1" fill="#FBBF24"/>
      </svg>
    ),
  },
  {
    label: "MBTI",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    top: "calc(95% - 48px)",
    left: "5%",
    xOffset: 65,
    yOffset: -65,
    svg: (
      <svg width="16" height="16" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" className="four-element-svg">
        <rect x="1" y="0" width="2" height="2" fill="#34D399"/>
        <rect x="5" y="0" width="2" height="2" fill="#A78BFA"/>
        <rect x="3" y="3" width="2" height="2" fill="#34D399"/>
        <rect x="1" y="6" width="2" height="2" fill="#A78BFA"/>
        <rect x="5" y="6" width="2" height="2" fill="#34D399"/>
      </svg>
    ),
  },
];

function DestinyCapsule() {
  return (
    <svg
      viewBox="0 0 16 20"
      width={48}
      height={60}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* 테두리 */}
      <rect x="3" y="1" width="10" height="1" fill="#1a1005" />
      <rect x="2" y="2" width="1" height="1" fill="#1a1005" />
      <rect x="13" y="2" width="1" height="1" fill="#1a1005" />
      <rect x="1" y="3" width="1" height="14" fill="#1a1005" />
      <rect x="14" y="3" width="1" height="14" fill="#1a1005" />
      <rect x="2" y="17" width="1" height="1" fill="#1a1005" />
      <rect x="13" y="17" width="1" height="1" fill="#1a1005" />
      <rect x="3" y="18" width="10" height="1" fill="#1a1005" />

      {/* 무지개빛(SSR) 그라데이션 대신 단색 루핑 연출은 Framer에서 필터로 처리 */}
      {/* 윗부분 */}
      <rect x="3" y="2" width="10" height="1" fill="#FF5E5E" />
      <rect x="2" y="3" width="12" height="7" fill="#FF5E5E" />
      <rect x="3" y="3" width="3" height="1" fill="#FFFFFF" opacity="0.6" />
      <rect x="2" y="4" width="1" height="3" fill="#FFFFFF" opacity="0.5" />

      {/* 아랫부분 */}
      <rect x="2" y="10" width="12" height="7" fill="#e8a825" />
      <rect x="3" y="17" width="10" height="1" fill="#e8a825" />
      <rect x="2" y="10" width="12" height="1" fill="#fce474" />
      <rect x="2" y="16" width="12" height="1" fill="#b57b12" />

      <rect x="6" y="12" width="4" height="3" fill="#ffffff" />
      <rect x="7" y="13" width="2" height="1" fill="#FF5E5E" />
    </svg>
  );
}

export default function FourElementFusion() {
  return (
    <div
      className="relative mx-auto my-6 flex items-center justify-center filter drop-shadow-md w-[220px] h-[220px]"
      aria-label="명리, 자미, 점성, MBTI 4요소 교차분석"
    >
      <div className="absolute inset-x-0 -top-8 text-center font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#6a5e4c]">
        {"> "}4가지 운명 데이터 교차 분석 중...
      </div>

      <div className="absolute inset-0 border-[3px] border-dashed border-[#d0c6b3] opacity-20 rounded-full" />
      
      {/* 파이프라인(배경 십자선) */}
      <div className="absolute w-[3px] h-full bg-[#d0c6b3] opacity-20" />
      <div className="absolute h-[3px] w-full bg-[#d0c6b3] opacity-20" />

      <motion.div
        animate={{
          scale: [0, 1.1, 1],
          filter: [
            "drop-shadow(0 0 0px rgba(0,0,0,0))",
            "drop-shadow(0 0 20px rgba(255,215,0,0.8))",
            "drop-shadow(0 0 35px rgba(255,105,180,1))",
            "drop-shadow(0 0 20px rgba(0,255,255,0.6))",
            "drop-shadow(0 0 0px rgba(0,0,0,0))"
          ] 
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute z-10 bg-[#fce474] rounded-full p-2 border-2 border-[#b57b12]"
      >
        <DestinyCapsule />
      </motion.div>

      {ELEMENTS.map((el, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, el.xOffset, 0],
            y: [0, el.yOffset, 0],
            opacity: [1, 0, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute flex flex-col items-center justify-center border-[2px] bg-white rounded shadow-sm z-0"
          style={{
            width: 48,
            height: 48,
            top: el.top,
            left: el.left,
            borderColor: el.color,
          }}
        >
          {el.svg}
          <span
            className="mt-1 font-[family-name:var(--font-pixel)] text-[0.5rem] leading-none"
            style={{ color: el.color }}
          >
            {el.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
