"use client";

import GachaCapsuleSvg from "@/components/ui/GachaCapsuleSvg";
import { motion } from "framer-motion";

function DropCapsule({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 6 6"
      width={14}
      height={14}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="1" y="0" width="4" height="1" fill="#1a1005" />
      <rect x="0" y="1" width="1" height="4" fill="#1a1005" />
      <rect x="5" y="1" width="1" height="4" fill="#1a1005" />
      <rect x="1" y="5" width="4" height="1" fill="#1a1005" />
      <rect x="1" y="1" width="4" height="2" fill={color} />
      <rect x="1" y="3" width="4" height="2" fill="#e8a825" />
      <rect x="1" y="1" width="1" height="1" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

function OrbitCapsule({ color, delay }: { color: string; delay: string }) {
  return (
    <div
      className="animate-capsule-orbit absolute"
      style={{
        left: -5,
        top: -5,
        animationDelay: delay,
      }}
    >
      <svg
        viewBox="0 0 8 8"
        width={10}
        height={10}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect x="1" y="0" width="6" height="1" fill="#1a1005" />
        <rect x="0" y="1" width="1" height="6" fill="#1a1005" />
        <rect x="7" y="1" width="1" height="6" fill="#1a1005" />
        <rect x="1" y="7" width="6" height="1" fill="#1a1005" />
        <rect x="1" y="1" width="6" height="3" fill={color} />
        <rect x="1" y="4" width="6" height="3" fill="#e8a825" />
        <rect x="1" y="1" width="1" height="1" fill="#ffffff" opacity="0.6" />
      </svg>
    </div>
  );
}

type Sticker = {
  label: string;
  sub: string;
  color: string;
  bg: string;
  top: number;
  side: "left" | "right";
  tilt: string;
};

const STICKERS: Sticker[] = [
  { label: "四", sub: "사주",  color: "#9a7040", bg: "#fff6e0", top: 140, side: "left",  tilt: "-rotate-[8deg]" },
  { label: "紫", sub: "자미",  color: "#6858b8", bg: "#f1edff", top: 200, side: "left",  tilt: "rotate-[6deg]" },
  { label: "星", sub: "점성",  color: "#3070c0", bg: "#e6f0fc", top: 140, side: "right", tilt: "rotate-[7deg]" },
  { label: "型", sub: "MBTI", color: "#2e8b4e", bg: "#e8f7ec", top: 200, side: "right", tilt: "-rotate-[5deg]" },
];

function StickerBadge({ label, sub, color, bg, top, side, tilt }: Sticker) {
  const posStyle =
    side === "left" ? { left: -6, top } : { right: -6, top };
  return (
    <div
      className={`absolute flex flex-col items-center justify-center w-11 h-11 border-2 ${tilt}`}
      style={{
        ...posStyle,
        backgroundColor: bg,
        borderColor: color,
        boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
      }}
    >
      <span
        className="font-[family-name:var(--font-pixel)] text-base leading-none"
        style={{ color }}
      >
        {label}
      </span>
      <span
        className="mt-0.5 font-[family-name:var(--font-body)] text-[0.5rem] leading-none opacity-85"
        style={{ color }}
      >
        {sub}
      </span>
    </div>
  );
}

export default function GachaHero() {
  return (
    <div className="relative inline-block">
      {/* 머신 본체 — 흔들림 애니메이션 */}
      <div className="animate-machine-shake relative drop-shadow-[0_12px_12px_rgba(0,0,0,0.25)]">
        <GachaCapsuleSvg size="2xl" />

        {/* 유리돔 내부 — 캡슐 4개가 중앙을 기준으로 오비트 회전 */}
        <div
          className="absolute pointer-events-none"
          style={{ top: 73, left: 112, width: 0, height: 0 }}
        >
          <OrbitCapsule color="#E91E63" delay="0s" />
          <OrbitCapsule color="#03A9F4" delay="-1.5s" />
          <OrbitCapsule color="#8BC34A" delay="-3s" />
          <OrbitCapsule color="#FFC107" delay="-4.5s" />
        </div>

        {/* 4요소 스티커 — 머신 측면 부착 */}
        {STICKERS.map((s, i) => (
          <StickerBadge key={i} {...s} />
        ))}

        {/* dispenser 낙하 캡슐 (3색 시차) */}
        <div
          className="animate-capsule-drop absolute pointer-events-none"
          style={{ top: 215, left: 105, animationDelay: "0s" }}
        >
          <DropCapsule color="#E91E63" />
        </div>
        <div
          className="animate-capsule-drop absolute pointer-events-none"
          style={{ top: 215, left: 105, animationDelay: "1.1s" }}
        >
          <DropCapsule color="#03A9F4" />
        </div>
        <div
          className="animate-capsule-drop absolute pointer-events-none"
          style={{ top: 215, left: 105, animationDelay: "2.2s" }}
        >
          <DropCapsule color="#8BC34A" />
        </div>
      </div>

      {/* 네온 INSERT COIN — 머신 하단 외부, 펄스 */}
      <motion.div
        animate={{ opacity: [1, 0.45, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="animate-neon-pulse absolute left-1/2 -translate-x-1/2 -bottom-4 font-[family-name:var(--font-pixel)] text-[#d04040] text-xs tracking-[0.25em] whitespace-nowrap"
      >
        [ INSERT 1 COIN ]
      </motion.div>
    </div>
  );
}
