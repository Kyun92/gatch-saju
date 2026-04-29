interface StatBarProps {
  icon?: string;
  label: string;
  value: number;
  max?: number;
  color: string;
  className?: string;
}

export default function StatBar({
  icon,
  label,
  value,
  max = 100,
  color,
  className = "",
}: StatBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const percent = (clamped / max) * 100;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-pixel text-[#2c2418]">
          {icon && <span>{icon}</span>}
          <span>{label}</span>
        </span>
        <span
          className="text-xs tabular-nums font-pixel"
          style={{ color }}
        >
          {clamped}/{max}
        </span>
      </div>

      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
}
