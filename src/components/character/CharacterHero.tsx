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
          className="object-cover [image-rendering:pixelated]"
          sizes="180px"
        />
      </div>

      {/* Level badge */}
      <span className="text-sm font-[family-name:var(--font-pixel)] text-[#c8a020]">
        Lv.{level}
      </span>

      {/* Class title */}
      <div className="font-[family-name:var(--font-pixel)] text-[1.25rem] leading-[1.2] text-[#2c2418]">
        {classTitle}
      </div>

      {/* Character title (from stat scoring) */}
      <div className="text-sm italic text-[#8a8070]">
        &ldquo;{characterTitle}&rdquo;
      </div>

      {/* Element + MBTI badges */}
      <div className="flex items-center gap-2">
        <ElementTag element={element} size="md" />
        {mbti && (
          <span className="tag-base px-2.5 py-1 text-[0.8125rem] font-[family-name:var(--font-pixel)] text-[#6858b8] bg-[rgba(104,88,184,0.10)] border border-[#6858b8]">
            {mbti}
          </span>
        )}
      </div>

      {/* Keywords */}
      {keywords && (
        <p className="text-center text-xs text-[#8a8070] max-w-[300px]">
          {keywords}
        </p>
      )}
    </div>
  );
}
