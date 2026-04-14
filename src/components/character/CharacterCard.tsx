import Image from "next/image";
import PixelFrame from "@/components/ui/PixelFrame";
import ElementTag from "@/components/ui/ElementTag";

type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

interface CharacterCardProps {
  avatarUrl?: string;
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
              alt={`${dayMaster} 캐릭터 아바타`}
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
              {dayMaster.charAt(0)}
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

          {/* Day master */}
          <div
            className="text-xl leading-none"
            style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
          >
            {dayMaster}
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
