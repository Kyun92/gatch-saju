type ElementType = "wood" | "fire" | "earth" | "metal" | "water";
type TagSize = "sm" | "md";

interface ElementTagProps {
  element: ElementType;
  size?: TagSize;
  className?: string;
}

const ELEMENT_CHAR: Record<ElementType, string> = {
  wood:  "木",
  fire:  "火",
  earth: "土",
  metal: "金",
  water: "水",
};

const ELEMENT_LABEL: Record<ElementType, string> = {
  wood:  "목",
  fire:  "화",
  earth: "토",
  metal: "금",
  water: "수",
};

const sizeStyle: Record<TagSize, { padding: string; fontSize: string }> = {
  sm: { padding: "2px 6px",  fontSize: "0.6875rem" },
  md: { padding: "4px 10px", fontSize: "0.8125rem" },
};

export default function ElementTag({
  element,
  size = "md",
  className = "",
}: ElementTagProps) {
  const { padding, fontSize } = sizeStyle[size];

  return (
    <span
      className={`tag-base tag-${element} ${className}`}
      style={{
        padding,
        fontSize,
        fontFamily: "var(--font-pixel)",
      }}
      title={ELEMENT_LABEL[element]}
    >
      {ELEMENT_CHAR[element]}
    </span>
  );
}
