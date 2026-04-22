"use client";

import { useEffect, useState } from "react";

/**
 * 예상 2분 기준 fake progress + 순차 체크리스트
 *
 * - 120초 동안 0% → 95% 선형 증가
 * - 95% 도달 후엔 매우 천천히 99%까지 (실 완료 전 대기)
 * - `complete = true` 신호 오면 100%로 스냅
 *
 * 단계(진행률 기준):
 *   0~20%   사주팔자 명식 작성
 *   20~45%  자미두수 12궁 배치
 *   45~70%  서양 점성술 차트 계산
 *   70~95%  3체계 교차 해석
 */

const STEPS = [
  { label: "사주팔자 명식 작성", from: 0, to: 20 },
  { label: "자미두수 12궁 배치", from: 20, to: 45 },
  { label: "서양 점성술 차트 계산", from: 45, to: 70 },
  { label: "3체계 교차 해석", from: 70, to: 95 },
] as const;

const EXPECTED_DURATION_MS = 120_000; // 2분
const TICK_MS = 250;

interface LoadingProgressProps {
  complete: boolean;
}

function formatClock(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function LoadingProgress({ complete }: LoadingProgressProps) {
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const interval = setInterval(() => {
      const now = Date.now() - started;
      setElapsed(now);

      if (complete) {
        setProgress(100);
        return;
      }

      // 0 ~ 120s: 0 → 95% 선형
      if (now < EXPECTED_DURATION_MS) {
        setProgress((now / EXPECTED_DURATION_MS) * 95);
      } else {
        // 120s 이후: 매우 천천히 99%까지 (감쇠)
        const overflow = now - EXPECTED_DURATION_MS;
        const slow = 4 * (1 - Math.exp(-overflow / 40_000)); // 95 → 99
        setProgress(Math.min(99, 95 + slow));
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [complete]);

  const currentStepIdx = STEPS.findIndex(
    (s) => progress >= s.from && progress < s.to,
  );
  const activeIdx = currentStepIdx === -1 ? STEPS.length - 1 : currentStepIdx;

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      {/* 경과/예상 시간 */}
      <div className="flex items-center justify-between font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] tracking-wider">
        <span>경과 {formatClock(elapsed)}</span>
        <span>예상 02:00</span>
      </div>

      {/* 프로그레스 바 */}
      <div className="relative w-full h-3 bg-[#e8dfc8] border-2 border-[#9a7040] overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-[width] duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(180deg, #fce474 0%, #e8a825 50%, #b57b12 100%)",
          }}
        />
        {/* 퍼센트 텍스트 */}
        <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#2c2418] mix-blend-multiply">
          {Math.floor(progress)}%
        </span>
      </div>

      {/* 순차 체크리스트 */}
      <ul className="flex flex-col gap-2 mt-2">
        {STEPS.map((step, i) => {
          const done = i < activeIdx || complete;
          const active = i === activeIdx && !complete;
          return (
            <li
              key={step.label}
              className="flex items-center gap-2 font-[family-name:var(--font-pixel)] text-xs"
              style={{
                color: done ? "#b8883c" : active ? "#2c2418" : "#b8b0a0",
              }}
            >
              <span
                className={`inline-flex items-center justify-center w-4 h-4 border-2 ${
                  active ? "animate-px-glow" : ""
                }`}
                style={{
                  borderColor: done
                    ? "#9a7040"
                    : active
                      ? "#d04040"
                      : "#d4cfc8",
                  backgroundColor: done
                    ? "#9a7040"
                    : active
                      ? "#fff4ed"
                      : "#faf7f2",
                  color: "#ffffff",
                }}
              >
                {done ? (
                  <span className="text-[0.625rem] leading-none">✓</span>
                ) : active ? (
                  <span
                    className="block w-1.5 h-1.5"
                    style={{ backgroundColor: "#d04040" }}
                  />
                ) : null}
              </span>
              {step.label}
              {active && <span className="text-[#d04040]">…</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
