"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./GachaCapsuleOpen.module.css";

interface GachaCapsuleOpenProps {
  onComplete: () => void;
}

// 화면에서 잘 보이도록 크게
const PIXEL_SIZE = 12;
// 상/하단을 바로 붙여서 그리기 (5행 × PIXEL_SIZE / 2)
const HALF_H = (5 * PIXEL_SIZE) / 2;
const PARTICLE_COLORS = ["#E91E63", "#FFC107", "#03A9F4", "#FFFFFF", "#FFD700", "#2e8b4e"];

// 픽셀 캡슐 — 10열x5행, 상하 완전 대칭 구형
// 1: 핫핑크, 2: 핑크(하이라이트), 3: 띠(다크)
const topGrid = [
  [0,0,0,1,1,1,1,0,0,0],
  [0,0,1,1,2,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1],
  [3,3,3,3,3,3,3,3,3,3],
];
// 4: 밝은 회색, 5: 중간 회색(그림자), 6: 띠(어두운)
const bottomGrid = [
  [6,6,6,6,6,6,6,6,6,6],
  [4,4,4,4,4,4,4,4,4,4],
  [0,4,4,4,4,4,4,4,4,0],
  [0,0,5,5,4,4,5,5,0,0],
  [0,0,0,5,5,5,5,0,0,0],
];

const COLORS: Record<number, string> = {
  1: "#E91E63", 2: "#F48FB1", 3: "#2C3E50",
  4: "#E0E0E0", 5: "#9E9E9E", 6: "#424242",
};

type Phase = "IDLE" | "ANTICIPATION" | "EXPLODING" | "DONE";

interface HalfState {
  x: number; y: number; vx: number; vy: number; rotation: number; vr: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; color: string; life: number; decay: number;
}

export default function GachaCapsuleOpen({ onComplete }: GachaCapsuleOpenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("IDLE");
  const frameRef = useRef(0);
  const flashRef = useRef(0);
  const topRef = useRef<HalfState>({ x: 0, y: 0, vx: 0, vy: 0, rotation: 0, vr: 0 });
  const bottomRef = useRef<HalfState>({ x: 0, y: 0, vx: 0, vy: 0, rotation: 0, vr: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const [phase, setPhase] = useState<Phase>("IDLE");

  const handleInteraction = useCallback(() => {
    if (phaseRef.current !== "IDLE") return;
    phaseRef.current = "ANTICIPATION";
    setPhase("ANTICIPATION");

    setTimeout(() => {
      phaseRef.current = "EXPLODING";
      setPhase("EXPLODING");
      flashRef.current = 1.0;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // 상단 캡슐: 위-왼쪽으로 날아감
      topRef.current = { x: cx, y: cy - HALF_H, vx: -15 + Math.random() * -5, vy: -20 + Math.random() * -10, rotation: 0, vr: -0.2 };
      // 하단 캡슐: 아래-오른쪽으로 날아감
      bottomRef.current = { x: cx, y: cy + HALF_H, vx: 10 + Math.random() * 5, vy: 10 + Math.random() * 5, rotation: 0, vr: 0.15 };

      // 80개 파티클 생성
      const particles: Particle[] = [];
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 25;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: (Math.random() * 3 + 1) * 4,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          life: 1.0,
          decay: 0.02 + Math.random() * 0.03,
        });
      }
      particlesRef.current = particles;

      setTimeout(() => {
        phaseRef.current = "DONE";
        setPhase("DONE");
        onComplete();
      }, 1500);
    }, 300);
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawGrid = (grid: number[][], x: number, y: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      const w = grid[0].length * PIXEL_SIZE;
      const h = grid.length * PIXEL_SIZE;
      ctx.translate(-w / 2, -h / 2);
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const val = grid[r][c];
          if (val !== 0) {
            ctx.fillStyle = COLORS[val];
            ctx.fillRect(c * PIXEL_SIZE, r * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
          }
        }
      }
      ctx.restore();
    };

    const frame = () => {
      frameRef.current++;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const gravity = 0.8;

      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(0, 0, w, h);

      const currentPhase = phaseRef.current;

      if (currentPhase === "IDLE" || currentPhase === "ANTICIPATION") {
        let hoverY = Math.sin(frameRef.current * 0.05) * 10;
        let shakeX = 0, shakeY = 0;

        if (currentPhase === "ANTICIPATION") {
          shakeX = (Math.random() - 0.5) * 10;
          shakeY = (Math.random() - 0.5) * 10;
          hoverY = 0;
        }

        drawGrid(topGrid, cx + shakeX, cy + hoverY - HALF_H + shakeY, 0);
        drawGrid(bottomGrid, cx + shakeX, cy + hoverY + HALF_H + shakeY, 0);
      } else if (currentPhase === "EXPLODING" || currentPhase === "DONE") {
        const top = topRef.current;
        const bot = bottomRef.current;

        // 물리 업데이트
        top.x += top.vx; top.vy += gravity; top.y += top.vy; top.rotation += top.vr;
        bot.x += bot.vx; bot.vy += gravity; bot.y += bot.vy; bot.rotation += bot.vr;

        drawGrid(bottomGrid, bot.x, bot.y, bot.rotation);
        drawGrid(topGrid, top.x, top.y, top.rotation);

        // 파티클
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += gravity * 0.5;
          p.life -= p.decay;

          if (p.life <= 0) { particles.splice(i, 1); continue; }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.globalAlpha = 1.0;
        }
      }

      // 번쩍임
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashRef.current})`;
        ctx.fillRect(0, 0, w, h);
        flashRef.current -= 0.05;
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div
      className={styles.container}
      onClick={handleInteraction}
      onTouchEnd={handleInteraction}
      role="button"
      tabIndex={0}
      aria-label="캡슐 열기"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleInteraction(); }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {phase === "IDLE" && (
        <p className={styles.prompt}>화면을 터치하여 캡슐을 여세요!</p>
      )}
    </div>
  );
}
