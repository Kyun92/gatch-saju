"use client";

import styles from "./GachaMachine.module.css";

interface GachaMachineProps {
  message?: string;
}

export default function GachaMachine({
  message = "AI가 명식을 풀이 중...",
}: GachaMachineProps) {
  return (
    <div className={styles.container}>
      <div className={styles.machineWrapper}>
        <svg
          width="200"
          height="280"
          viewBox="0 0 200 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="갓챠 머신 애니메이션"
        >
          {/* Machine body */}
          <rect x="30" y="60" width="140" height="180" rx="0" fill="#c0392b" />
          <rect x="30" y="60" width="140" height="180" rx="0" stroke="#8b1a1a" strokeWidth="4" fill="none" />

          {/* Top dome */}
          <path d="M50 60 Q100 10 150 60" fill="#e74c3c" stroke="#8b1a1a" strokeWidth="3" />

          {/* Knob on top */}
          <circle cx="100" cy="28" r="10" fill="#f1c40f" stroke="#b8960c" strokeWidth="3" />

          {/* Glass dome (capsule window) */}
          <rect x="50" y="80" width="100" height="90" rx="0" fill="#1a2844" />
          <rect x="50" y="80" width="100" height="90" rx="0" stroke="#0d1a30" strokeWidth="3" fill="none" />

          {/* Glass highlight */}
          <rect x="54" y="84" width="30" height="6" rx="0" fill="rgba(255,255,255,0.2)" />

          {/* Capsules inside the glass */}
          <g className={styles.capsule1}>
            <ellipse cx="75" cy="140" rx="10" ry="8" fill="#e74c3c" />
            <ellipse cx="75" cy="146" rx="10" ry="8" fill="#ecf0f1" />
          </g>
          <g className={styles.capsule2}>
            <ellipse cx="105" cy="130" rx="10" ry="8" fill="#3070c0" />
            <ellipse cx="105" cy="136" rx="10" ry="8" fill="#ecf0f1" />
          </g>
          <g className={styles.capsule3}>
            <ellipse cx="125" cy="148" rx="10" ry="8" fill="#2e8b4e" />
            <ellipse cx="125" cy="154" rx="10" ry="8" fill="#ecf0f1" />
          </g>
          <g className={styles.capsule4}>
            <ellipse cx="88" cy="118" rx="10" ry="8" fill="#c8a020" />
            <ellipse cx="88" cy="124" rx="10" ry="8" fill="#ecf0f1" />
          </g>

          {/* Metal band below glass */}
          <rect x="40" y="170" width="120" height="14" rx="0" fill="#7f8c8d" stroke="#5a6268" strokeWidth="2" />
          <rect x="40" y="174" width="120" height="3" rx="0" fill="rgba(255,255,255,0.15)" />

          {/* Coin slot */}
          <rect x="82" y="192" width="36" height="6" rx="0" fill="#2c3e50" stroke="#1a252f" strokeWidth="1.5" />

          {/* Dispensing chute */}
          <rect x="65" y="224" width="70" height="16" rx="0" fill="#2c3e50" stroke="#1a252f" strokeWidth="2" />
          <rect x="75" y="228" width="50" height="8" rx="0" fill="#0d1a30" />

          {/* Lever (right side) */}
          <rect x="170" y="110" width="10" height="50" rx="0" fill="#7f8c8d" stroke="#5a6268" strokeWidth="2" />
          <circle cx="175" cy="108" r="10" fill="#e74c3c" stroke="#8b1a1a" strokeWidth="2" />

          {/* Machine legs */}
          <rect x="40" y="240" width="14" height="20" rx="0" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="2" />
          <rect x="146" y="240" width="14" height="20" rx="0" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="2" />

          {/* Decorative star on machine front */}
          <polygon
            points="100,196 103,204 112,204 105,209 108,218 100,213 92,218 95,209 88,204 97,204"
            fill="#f1c40f"
            stroke="#b8960c"
            strokeWidth="1"
          />
        </svg>
      </div>

      <p className={styles.message}>{message}</p>
    </div>
  );
}
