import Link from "next/link";
import CoinSvg from "@/components/ui/CoinSvg";
import { COPY } from "@/lib/copy/gacha-terms";

export default function NewCharacterSlot() {
  return (
    <div className="flex flex-col items-center gap-2 my-2">
      <Link
        href="/characters/new"
        className="gacha-coin-btn w-full justify-center"
        data-size="sm"
        aria-label={COPY.action.draw_new}
      >
        <CoinSvg size={18} className="animate-spin-coin" />
        <span className="transition-colors duration-200">
          {COPY.action.draw_new}
        </span>
      </Link>
      <p className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] tracking-wider">
        {COPY.action.draw_new_sub}
      </p>
    </div>
  );
}
