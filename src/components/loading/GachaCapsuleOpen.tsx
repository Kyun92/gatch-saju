"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./GachaCapsuleOpen.module.css";

interface GachaCapsuleOpenProps {
  onComplete: () => void;
}

const PIXEL_SIZE = 6;
const PARTICLE_COLORS = [
  "#2e8b4e", "#d04040", "#a87838", "#6878a0", "#3070c0", "#c8a020",
];

type Phase = "IDLE" | "ANTICIPATION" | "EXPLODING" | "DONE";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export default function GachaCapsuleOpen({ onComplete }: GachaCapsuleOpenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("IDLE");
  const particlesRef = useRef<Particle[]>([]);
  const timerRef = useRef(0);
  const flashRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("IDLE");

  const handleInteraction = useCallback(() => {
    if (phaseRef.current !== "IDLE") return;
    phaseRef.current = "ANTICIPATION";
    setPhase("ANTICIPATION");
    timerRef.current = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const spawnParticles = (cx: number, cy: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.4;
        const speed = 2 + Math.random() * 5;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          life: 1,
          maxLife: 0.8 + Math.random() * 0.6,
          size: PIXEL_SIZE * (0.5 + Math.random() * 0.8),
        });
      }
      particlesRef.current = particles;
    };

    const drawPixelRect = (
      x: number, y: number, w: number, h: number, color: string,
    ) => {
      ctx.fillStyle = color;
      for (let px = 0; px < w; px += PIXEL_SIZE) {
        for (let py = 0; py < h; py += PIXEL_SIZE) {
          ctx.fillRect(
            Math.floor((x + px) / PIXEL_SIZE) * PIXEL_SIZE,
            Math.floor((y + py) / PIXEL_SIZE) * PIXEL_SIZE,
            PIXEL_SIZE,
            PIXEL_SIZE,
          );
        }
      }
    };

    const drawCapsule = (cx: number, cy: number, shake: number) => {
      const offset = Math.sin(Date.now() / 400) * 4;
      const sx = shake * (Math.random() - 0.5) * 6;
      const sy = shake * (Math.random() - 0.5) * 6;
      const x = cx - 30 + sx;
      const y = cy - 24 + offset + sy;

      // Top half (pink)
      drawPixelRect(x, y, 60, 24, "#e88ca5");
      // Highlight on top
      drawPixelRect(x + PIXEL_SIZE, y + PIXEL_SIZE, PIXEL_SIZE * 2, PIXEL_SIZE, "#f0b0c0");
      // Bottom half (grey)
      drawPixelRect(x, y + 24, 60, 24, "#b0b8c0");
      // Divider line
      drawPixelRect(x, y + 22, 60, PIXEL_SIZE, "#c0c8d0");
    };

    const frame = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      // Clear with theme background
      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(0, 0, w, h);

      const currentPhase = phaseRef.current;

      if (currentPhase === "IDLE") {
        drawCapsule(cx, cy, 0);
      } else if (currentPhase === "ANTICIPATION") {
        timerRef.current += dt;
        const shake = Math.min(timerRef.current / 0.3, 1);
        drawCapsule(cx, cy, shake);

        if (timerRef.current >= 0.3) {
          phaseRef.current = "EXPLODING";
          setPhase("EXPLODING");
          timerRef.current = 0;
          flashRef.current = 1;
          spawnParticles(cx, cy);
        }
      } else if (currentPhase === "EXPLODING") {
        timerRef.current += dt;

        // Flash effect
        if (flashRef.current > 0) {
          flashRef.current -= dt * 3;
          const alpha = Math.max(0, flashRef.current);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillRect(0, 0, w, h);
        }

        // Update and draw particles
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // gravity
          p.life -= dt / p.maxLife;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(
            Math.floor(p.x / PIXEL_SIZE) * PIXEL_SIZE,
            Math.floor(p.y / PIXEL_SIZE) * PIXEL_SIZE,
            p.size,
            p.size,
          );
        }
        ctx.globalAlpha = 1;

        if (timerRef.current >= 1.5) {
          phaseRef.current = "DONE";
          setPhase("DONE");
          onComplete();
        }
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  return (
    <div
      className={styles.container}
      onClick={handleInteraction}
      onTouchEnd={handleInteraction}
      role="button"
      tabIndex={0}
      aria-label="캡슐 열기"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleInteraction();
      }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {phase === "IDLE" && (
        <p className={styles.prompt}>
          화면을 터치하여 캡슐을 여세요!
        </p>
      )}
    </div>
  );
}
