interface CoinSvgProps {
  size?: number;
  className?: string;
}

export default function CoinSvg({ size = 32, className }: CoinSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* 동전 외곽선 */}
      <rect x="5" y="1" width="6" height="1" fill="#1a1005" />
      <rect x="3" y="2" width="2" height="1" fill="#1a1005" />
      <rect x="11" y="2" width="2" height="1" fill="#1a1005" />
      <rect x="2" y="3" width="1" height="1" fill="#1a1005" />
      <rect x="13" y="3" width="1" height="1" fill="#1a1005" />
      <rect x="1" y="4" width="1" height="8" fill="#1a1005" />
      <rect x="14" y="4" width="1" height="8" fill="#1a1005" />
      <rect x="2" y="12" width="1" height="1" fill="#1a1005" />
      <rect x="13" y="12" width="1" height="1" fill="#1a1005" />
      <rect x="3" y="13" width="2" height="1" fill="#1a1005" />
      <rect x="11" y="13" width="2" height="1" fill="#1a1005" />
      <rect x="5" y="14" width="6" height="1" fill="#1a1005" />

      {/* 베이스 골드 */}
      <rect x="5" y="2" width="6" height="1" fill="#e8a825" />
      <rect x="3" y="3" width="10" height="1" fill="#e8a825" />
      <rect x="2" y="4" width="12" height="8" fill="#e8a825" />
      <rect x="3" y="12" width="10" height="1" fill="#e8a825" />
      <rect x="5" y="13" width="6" height="1" fill="#e8a825" />

      {/* 하이라이트 */}
      <rect x="5" y="2" width="6" height="1" fill="#fce474" />
      <rect x="3" y="3" width="2" height="1" fill="#fce474" />
      <rect x="2" y="4" width="1" height="6" fill="#fce474" />

      {/* 그림자 */}
      <rect x="5" y="13" width="6" height="1" fill="#b57b12" />
      <rect x="11" y="12" width="2" height="1" fill="#b57b12" />
      <rect x="13" y="6" width="1" height="6" fill="#b57b12" />

      {/* 중앙 다이아몬드 */}
      <rect x="7" y="5" width="2" height="6" fill="#fce474" />
      <rect x="6" y="6" width="4" height="4" fill="#fce474" />
      <rect x="5" y="7" width="6" height="2" fill="#fce474" />
      <rect x="7" y="6" width="2" height="2" fill="#ffffff" />
    </svg>
  );
}
