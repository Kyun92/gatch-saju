"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface PixelSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function PixelSelect({
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  disabled = false,
  className = "",
}: PixelSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  const close = useCallback(() => setOpen(false), []);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  // scroll selected into view when opening
  useEffect(() => {
    if (open && listRef.current) {
      const active = listRef.current.querySelector(
        '[data-selected="true"]'
      ) as HTMLElement | null;
      if (active) {
        active.scrollIntoView({ block: "nearest" });
      }
    }
  }, [open]);

  // keyboard navigation
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className="w-full px-4 py-3 text-sm text-left flex items-center justify-between"
        style={{
          fontFamily: "var(--font-pixel)",
          backgroundColor: disabled ? "#eee8dc" : "#faf7f2",
          color: disabled ? "#a09888" : "#2c2418",
          border: "2px solid #b8944c",
          borderRadius: 0,
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span className="truncate">{selectedLabel}</span>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.625rem",
            color: "#9a7040",
            marginLeft: 8,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 overflow-y-auto"
          style={{
            zIndex: 50,
            maxHeight: 200,
            backgroundColor: "#faf7f2",
            border: "2px solid #b8944c",
            borderTop: "none",
            borderRadius: 0,
            margin: 0,
            padding: 0,
            listStyle: "none",
            boxShadow: "0 4px 0 rgba(0,0,0,0.08)",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                data-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  close();
                }}
                className="px-4 py-2.5 text-sm cursor-pointer"
                style={{
                  fontFamily: "var(--font-pixel)",
                  backgroundColor: isSelected ? "#c8a020" : "transparent",
                  color: isSelected ? "#ffffff" : "#2c2418",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "#f0ebe0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
