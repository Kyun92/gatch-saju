interface PixelDividerProps {
  className?: string;
  label?: string;
}

export default function PixelDivider({ className = "", label }: PixelDividerProps) {
  if (label) {
    return (
      <div
        className={`flex items-center gap-3 my-4 ${className}`}
        role="separator"
        aria-label={label}
      >
        <div
          className="flex-1"
          style={{
            borderTop: "1px dashed #b8944c",
          }}
        />
        <span
          className="text-xs shrink-0"
          style={{ fontFamily: "var(--font-pixel)", color: "#b8944c" }}
        >
          {label}
        </span>
        <div
          className="flex-1"
          style={{
            borderTop: "1px dashed #b8944c",
          }}
        />
      </div>
    );
  }

  return (
    <hr
      className={`my-4 ${className}`}
      style={{
        border: "none",
        borderTop: "1px dashed #b8944c",
      }}
      role="separator"
    />
  );
}
