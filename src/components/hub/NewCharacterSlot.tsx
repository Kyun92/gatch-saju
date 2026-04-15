import Link from "next/link";

export default function NewCharacterSlot() {
  return (
    <Link
      href="/characters/new"
      className="no-underline block"
    >
      <div
        className="new-character-slot border-2 border-dashed border-[#b8944c] bg-[#faf7f2] px-5 py-7 flex flex-col items-center justify-center gap-2 cursor-pointer transition-[border-color,background-color] duration-150 ease-in-out min-h-[120px]"
      >
        <span
          className="font-[family-name:var(--font-pixel)] text-[2rem] text-[#b8944c] leading-none"
          aria-hidden="true"
        >
          +
        </span>
        <span
          className="font-[family-name:var(--font-pixel)] text-xs text-[#9a7040] tracking-[0.04em]"
        >
          새 캐릭터 추가
        </span>
        <span
          className="font-[family-name:var(--font-body)] text-[0.6875rem] text-[#8a8070] text-center leading-normal"
        >
          친구, 가족의 사주도 확인해보세요
        </span>
      </div>
    </Link>
  );
}
