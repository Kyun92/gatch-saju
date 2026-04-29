interface PixelDividerProps {
  className?: string;
  label?: string;
}

export default function PixelDivider({
  className = "",
  label,
}: PixelDividerProps) {
  if (label) {
    return (
      <div
        className={`flex items-center gap-3 my-4 ${className}`}
        role="separator"
        aria-label={label}
      >
        <div className="flex-1 px-divider-line" />
        <span className="text-xs shrink-0 px-divider-label">{label}</span>
        <div className="flex-1 px-divider-line" />
      </div>
    );
  }

  return (
    <hr className={`my-4 px-divider ${className}`} role="separator" />
  );
}
