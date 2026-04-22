interface GachaCapsuleSvgProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

const SIZE_MAP = {
  sm: 24,
  md: 64,
  lg: 96,
  xl: 128,
  "2xl": 224,
  "3xl": 288,
} as const;

export default function GachaCapsuleSvg({
  size = "md",
  className,
}: GachaCapsuleSvgProps) {
  const px = SIZE_MAP[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 40"
      width={px}
      height={px * 1.25}
      className={className}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {/* Machine body — red arcade cabinet */}
      <rect x="4" y="18" width="24" height="18" fill="#1a1005" />
      <rect x="5" y="19" width="22" height="16" fill="#F44336" />
      <rect x="5" y="19" width="22" height="1" fill="#E53935" />
      <rect x="5" y="33" width="22" height="2" fill="#C62828" />

      {/* Base/feet */}
      <rect x="3" y="35" width="26" height="3" fill="#1a1005" />
      <rect x="4" y="36" width="24" height="1" fill="#D32F2F" />

      {/* Glass dome */}
      <rect x="6" y="2" width="20" height="17" fill="#1a1005" />
      <rect x="7" y="3" width="18" height="15" fill="#E0F7FA" opacity="0.85" />

      {/* Dome top — stepped pixel arch */}
      <rect x="10" y="0" width="12" height="1" fill="#1a1005" />
      <rect x="8" y="1" width="16" height="1" fill="#1a1005" />
      <rect x="11" y="1" width="10" height="1" fill="#E0F7FA" opacity="0.85" />

      {/* Glass highlight */}
      <rect x="9" y="5" width="2" height="6" fill="#FFFFFF" opacity="0.5" />
      <rect x="12" y="5" width="1" height="3" fill="#FFFFFF" opacity="0.4" />

      {/* Capsules inside dome */}
      {/* Yellow capsule */}
      <rect x="9" y="12" width="4" height="4" fill="#FFC107" />
      <rect x="9" y="14" width="4" height="2" fill="#FF9800" />
      {/* Pink capsule */}
      <rect x="15" y="10" width="4" height="4" fill="#E91E63" />
      <rect x="15" y="12" width="4" height="2" fill="#C2185B" />
      {/* Blue capsule */}
      <rect x="20" y="13" width="4" height="4" fill="#03A9F4" />
      <rect x="20" y="15" width="4" height="2" fill="#0288D1" />
      {/* Green capsule */}
      <rect x="12" y="14" width="4" height="4" fill="#8BC34A" />
      <rect x="12" y="16" width="4" height="2" fill="#689F38" />

      {/* Coin slot */}
      <rect x="20" y="22" width="5" height="3" fill="#1a1005" />
      <rect x="21" y="23" width="3" height="1" fill="#424242" />

      {/* Lever */}
      <rect x="7" y="23" width="6" height="6" fill="#CFD8DC" />
      <rect x="7" y="23" width="6" height="1" fill="#ECEFF1" />
      <rect x="9" y="24" width="2" height="4" fill="#607D8B" />

      {/* Dispenser opening */}
      <rect x="11" y="30" width="10" height="4" fill="#1a1005" />
      <rect x="12" y="31" width="8" height="2" fill="#0D0D0D" />

      {/* Gold trim bands */}
      <rect x="4" y="18" width="24" height="1" fill="#e8a825" />
      <rect x="4" y="34" width="24" height="1" fill="#e8a825" />
    </svg>
  );
}
