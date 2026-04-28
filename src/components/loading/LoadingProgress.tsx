"use client";

import { useEffect, useState } from "react";
import { LOADING_STEPS } from "@/lib/copy/loading-steps";

/**
 * 예상 2분 기준 fake progress + 순차 체크리스트
 *
 * - 120초 동안 0% → 95% 선형 증가
 * - 95% 도달 후엔 매우 천천히 99%까지 (실 완료 전 대기)
 * - `complete = true` 신호 오면 100%로 스냅
 *
 * 단계 라벨/구간은 `@/lib/copy/loading-steps`의 `LOADING_STEPS` 단일 소스를 사용한다.
 * (generating 페이지와 동일 소스를 공유 — 마이크로카피 일관성)
 */

const STEPS = LOADING_STEPS;

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
          className="loading-progress-bar absolute top-0 left-0 h-full transition-[width] duration-300 ease-out"
          // 동적 props 예외: width %는 progress 상태에서만 결정됨
          style={{ width: `${progress}%` }}
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
          const state = done ? "done" : active ? "active" : "pending";
          return (
            <li
              key={step.label}
              data-state={state}
              className="loading-step flex items-center gap-2 font-[family-name:var(--font-pixel)] text-xs"
            >
              <span
                data-state={state}
                className={`loading-step-marker inline-flex items-center justify-center w-4 h-4 border-2 ${
                  active ? "animate-px-glow" : ""
                }`}
              >
                {done ? (
                  <span className="text-[0.625rem] leading-none">✓</span>
                ) : active ? (
                  <span className="loading-step-dot block w-1.5 h-1.5" />
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
