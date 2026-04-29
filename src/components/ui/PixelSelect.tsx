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
        className="w-full px-4 py-3 text-sm text-left flex items-center justify-between px-select-trigger"
      >
        <span className="truncate">{selectedLabel}</span>
        <span
          className="px-select-caret"
          data-open={open}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 overflow-y-auto px-select-list"
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
                className="px-4 py-2.5 text-sm cursor-pointer px-select-option"
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
