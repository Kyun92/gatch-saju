import Image from "next/image";
import PixelFrame from "@/components/ui/PixelFrame";
import ElementTag from "@/components/ui/ElementTag";
import {
  formatDayMasterDisplay,
  type Element as ElementType,
} from "@/lib/copy/day-master";

interface CharacterCardProps {
  avatarUrl?: string;
  /** 사주 일간(천간). 내부에서 비유체로 변환하여 표시. */
  dayMaster: string;
  level: number;
  title: string;
  element: ElementType;
  className?: string;
}

export default function CharacterCard({
  avatarUrl,
  dayMaster,
  level,
  title,
  element,
  className = "",
}: CharacterCardProps) {
  // 비유체 표시 (예: "깊은 바다 타입"). 한자 직접 노출 금지.
  const dayMasterDisplay = formatDayMasterDisplay(dayMaster) || "운명의 여행자";
  const dayMasterInitial = dayMasterDisplay.charAt(0);
  return (
    <PixelFrame variant="accent" className={`p-4 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="shrink-0 relative pixel-frame-simple"
          style={{ width: 80, height: 80 }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${dayMasterDisplay} 캐릭터 아바타`}
              fill
              style={{ objectFit: "cover", imageRendering: "pixelated" }}
              sizes="80px"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: "#faf7f2",
                fontFamily: "var(--font-pixel)",
                fontSize: "2rem",
                color: "#9a7040",
              }}
              aria-hidden="true"
            >
              {dayMasterInitial}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {/* Level badge */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-pixel)", color: "#c8a020" }}
            >
              Lv.{level}
            </span>
            <ElementTag element={element} size="sm" />
          </div>

          {/* Day master metaphor */}
          <div
            className="text-xl leading-none"
            style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
          >
            {dayMasterDisplay}
          </div>

          {/* Title */}
          <div
            className="text-sm truncate"
            style={{ color: "#4a3e2c" }}
          >
            {title}
          </div>
        </div>
      </div>
    </PixelFrame>
  );
}
