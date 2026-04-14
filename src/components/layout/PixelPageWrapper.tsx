import { ReactNode } from "react";

interface PixelPageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PixelPageWrapper({
  children,
  className = "",
}: PixelPageWrapperProps) {
  return (
    <div
      className={`w-full mx-auto px-4 py-6 ${className}`}
      style={{
        maxWidth: "768px",
        backgroundColor: "#f5f0e8",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
