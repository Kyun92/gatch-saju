import { ELEMENT_LABEL, type Element as ElementType } from "@/lib/copy/day-master";

type TagSize = "sm" | "md";

interface ElementTagProps {
  element: ElementType;
  size?: TagSize;
  className?: string;
}

/** 좁은 배지용 1글자 한글 라벨 (디자인 토큰). 풀 이름은 aria-label/title로 노출. */
const ELEMENT_BADGE_CHAR: Record<ElementType, string> = {
  wood: "나",   // 나무
  fire: "불",
  earth: "흙",
  metal: "쇠",
  water: "물",
};

const sizeClass: Record<TagSize, string> = {
  sm: "px-1.5 py-[2px] text-[0.6875rem]",
  md: "px-2.5 py-1 text-[0.8125rem]",
};

export default function ElementTag({
  element,
  size = "md",
  className = "",
}: ElementTagProps) {
  const label = ELEMENT_LABEL[element];

  return (
    <span
      className={`tag-base tag-${element} font-pixel ${sizeClass[size]} ${className}`}
      title={label}
      aria-label={`오행 - ${label}`}
    >
      {ELEMENT_BADGE_CHAR[element]}
    </span>
  );
}
