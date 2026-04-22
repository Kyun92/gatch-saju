import Image from "next/image";
import type { ReactNode } from "react";

/**
 * 공용 캡슐 프레임 — 허브 CharacterSlot + 마이페이지 MyPageCharacterCard 공유.
 *
 * 스타일링 원칙 (R7/R8 경계):
 * 이 컴포넌트의 루트에는 Tailwind `bg-*` / `border-*` utility를 **병용하지 말 것**.
 * 모든 색상은 globals.css `.capsule-frame[data-element="..."]` 규칙에 위임.
 * Tailwind utilities 레이어가 @layer components를 덮어쓰기 때문.
 */

export type Element = "wood" | "fire" | "earth" | "metal" | "water";

interface CapsuleFrameProps {
  avatarSrc: string;
  avatarAlt: string;
  element: Element;
  size?: "sm" | "md";
  locked?: boolean;
  /** 추가 오버레이(레벨 배지 등) */
  children?: ReactNode;
}

export default function CapsuleFrame({
  avatarSrc,
  avatarAlt,
  element,
  size = "md",
  locked = false,
  children,
}: CapsuleFrameProps) {
  const imageSize = size === "sm" ? 48 : 120;
  return (
    <div
      className="capsule-frame"
      data-element={element}
      data-size={size}
      data-locked={locked ? "true" : "false"}
    >
      <Image
        src={avatarSrc}
        alt={avatarAlt}
        width={imageSize}
        height={imageSize}
        className="capsule-frame-avatar"
        sizes={`${imageSize}px`}
      />
      {children}
    </div>
  );
}
