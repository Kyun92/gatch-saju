"use client";

import styles from "./GachaMachine.module.css";

interface GachaMachineProps {
  message?: string;
}

export default function GachaMachine({
  message = "명식을 풀이 중...",
}: GachaMachineProps) {
  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 400"
        className={styles.svg}
        aria-label="갓챠 머신 애니메이션"
      >
        <g className={styles.machine}>
          {/* 기계 바닥 */}
          <rect x="80" y="320" width="140" height="20" fill="#D32F2F" stroke="#2C3E50" strokeWidth="4" />

          {/* 기계 본체 */}
          <rect x="90" y="200" width="120" height="120" fill="#F44336" stroke="#2C3E50" strokeWidth="4" />

          {/* 유리 돔 */}
          <defs>
            <clipPath id="domeClip">
              <path d="M102 200 L102 122 L112 122 L112 92 L142 92 L142 82 L158 82 L158 92 L188 92 L188 122 L198 122 L198 200 Z" />
            </clipPath>
          </defs>
          <path
            d="M100 200 L100 120 L110 120 L110 90 L140 90 L140 80 L160 80 L160 90 L190 90 L190 120 L200 120 L200 200 Z"
            fill="#E0F7FA"
            opacity="0.8"
          />

          {/* 캡슐들 — 유리 돔 안에 클리핑 */}
          <g clipPath="url(#domeClip)">
            <g className={styles.cap1} transform="translate(115, 170)">
              <rect x="0" y="0" width="18" height="18" fill="#FFC107" stroke="#2C3E50" strokeWidth="2" />
              <rect x="0" y="9" width="18" height="9" fill="#FF9800" />
            </g>
            <g className={styles.cap2} transform="translate(142, 160)">
              <rect x="0" y="0" width="18" height="18" fill="#E91E63" stroke="#2C3E50" strokeWidth="2" />
              <rect x="0" y="9" width="18" height="9" fill="#C2185B" />
            </g>
            <g className={styles.cap3} transform="translate(168, 172)">
              <rect x="0" y="0" width="18" height="18" fill="#03A9F4" stroke="#2C3E50" strokeWidth="2" />
              <rect x="0" y="9" width="18" height="9" fill="#0288D1" />
            </g>
            <g className={styles.cap4} transform="translate(130, 178)">
              <rect x="0" y="0" width="18" height="18" fill="#8BC34A" stroke="#2C3E50" strokeWidth="2" />
              <rect x="0" y="9" width="18" height="9" fill="#689F38" />
            </g>
          </g>

          {/* 유리 돔 테두리 (캡슐 위에 렌더링) */}
          <path
            d="M100 200 L100 120 L110 120 L110 90 L140 90 L140 80 L160 80 L160 90 L190 90 L190 120 L200 120 L200 200 Z"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="4"
          />

          {/* 유리 하이라이트 */}
          <rect x="110" y="100" width="10" height="20" fill="#FFFFFF" opacity="0.5" />
          <rect x="125" y="100" width="10" height="10" fill="#FFFFFF" opacity="0.5" />

          {/* 레버 */}
          <rect x="135" y="220" width="30" height="30" fill="#CFD8DC" stroke="#2C3E50" strokeWidth="4" />
          <rect x="145" y="225" width="10" height="20" fill="#607D8B" />

          {/* 배출구 */}
          <rect x="125" y="270" width="50" height="30" fill="#2C3E50" />
          <rect x="130" y="275" width="40" height="20" fill="#1A252F" />
        </g>
      </svg>

      <p className={styles.message}>{message}</p>
    </div>
  );
}
