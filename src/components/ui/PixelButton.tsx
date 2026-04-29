"use client";

import { ReactNode, MouseEvent } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "wood"
  | "fire"
  | "earth"
  | "metal"
  | "water";

type ButtonSize = "sm" | "md" | "lg";

interface PixelButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const elementStyles: Record<string, { bg: string; color: string; border: string; shadow: string }> = {
  wood:  { bg: "rgba(46,139,78,0.12)",   color: "#2e8b4e", border: "#2e8b4e", shadow: "#1a5a30" },
  fire:  { bg: "rgba(208,64,64,0.12)",   color: "#d04040", border: "#d04040", shadow: "#8b1a1a" },
  earth: { bg: "rgba(192,144,80,0.12)",  color: "#c09050", border: "#c09050", shadow: "#7a5020" },
  metal: { bg: "rgba(140,148,164,0.15)", color: "#8c94a4", border: "#8c94a4", shadow: "#5a6070" },
  water: { bg: "rgba(48,112,192,0.12)",  color: "#3070c0", border: "#3070c0", shadow: "#1a4a8b" },
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variantClass: Record<string, string> = {
  primary:   "pixel-btn pixel-btn-primary",
  secondary: "pixel-btn pixel-btn-secondary",
  danger:    "pixel-btn pixel-btn-danger",
};

export default function PixelButton({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
  className = "",
  type = "button",
}: PixelButtonProps) {
  const isElement = variant in elementStyles;

  if (isElement) {
    const el = elementStyles[variant];
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`pixel-btn font-pixel ${sizeClass[size]} ${className}`}
        style={{
          backgroundColor: el.bg,
          color: el.color,
          border: `2px solid ${el.border}`,
          borderBottomWidth: "4px",
          boxShadow: `0 2px 0 ${el.shadow}`,
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variantClass[variant] ?? variantClass.primary} ${sizeClass[size]} font-pixel ${className}`}
    >
      {children}
    </button>
  );
}
