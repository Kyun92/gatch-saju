import { ReactNode } from "react";

type PixelFrameVariant = "default" | "accent" | "simple";

interface PixelFrameProps {
  variant?: PixelFrameVariant;
  className?: string;
  children: ReactNode;
}

const variantClass: Record<PixelFrameVariant, string> = {
  default: "pixel-frame",
  accent: "pixel-frame-accent",
  simple: "pixel-frame-simple",
};

export default function PixelFrame({
  variant = "default",
  className = "",
  children,
}: PixelFrameProps) {
  return (
    <div className={`${variantClass[variant]} ${className}`}>{children}</div>
  );
}
