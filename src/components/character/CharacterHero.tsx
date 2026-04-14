import Image from "next/image";
import ElementTag from "@/components/ui/ElementTag";
import type { ElementType } from "@/lib/character/get-preset";

interface CharacterHeroProps {
  avatarUrl: string;
  dayMaster: string;
  level: number;
  classTitle: string;
  characterTitle: string;
  element: ElementType;
  mbti?: string | null;
  keywords?: string;
}

export default function CharacterHero({
  avatarUrl,
  dayMaster,
  level,
  classTitle,
  characterTitle,
  element,
  mbti,
  keywords,
}: CharacterHeroProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hero frame with character image */}
      <div className="hero-frame">
        <Image
          src={avatarUrl}
          alt={`${dayMaster} 캐릭터`}
          fill
          style={{ objectFit: "cover", imageRendering: "pixelated" }}
          sizes="180px"
        />
      </div>

      {/* Level badge */}
      <span
        className="text-sm"
        style={{ fontFamily: "var(--font-pixel)", color: "#c8a020" }}
      >
        Lv.{level}
      </span>

      {/* Class title */}
      <div
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "1.25rem",
          color: "#2c2418",
          lineHeight: 1.2,
        }}
      >
        {classTitle}
      </div>

      {/* Character title (from AI stat scoring) */}
      <div
        className="text-sm"
        style={{ color: "#8a8070", fontStyle: "italic" }}
      >
        &ldquo;{characterTitle}&rdquo;
      </div>

      {/* Element + MBTI badges */}
      <div className="flex items-center gap-2">
        <ElementTag element={element} size="md" />
        {mbti && (
          <span
            className="tag-base"
            style={{
              padding: "4px 10px",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-pixel)",
              color: "#6858b8",
              backgroundColor: "rgba(104, 88, 184, 0.10)",
              border: "1px solid #6858b8",
            }}
          >
            {mbti}
          </span>
        )}
      </div>

      {/* Keywords */}
      {keywords && (
        <p
          className="text-center text-xs"
          style={{ color: "#8a8070", maxWidth: "300px" }}
        >
          {keywords}
        </p>
      )}
    </div>
  );
}
