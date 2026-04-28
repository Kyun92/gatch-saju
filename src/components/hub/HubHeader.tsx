import Image from "next/image";
import Link from "next/link";
import CoinSvg from "@/components/ui/CoinSvg";
import { formatCoinCount } from "@/lib/copy/gacha-terms";

interface HubHeaderProps {
  userName: string;
  balance?: number;
}

export default function HubHeader({ userName, balance = 0 }: HubHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-12 bg-[#f5f0e8] border-b border-[#b8944c]">
      <Link href="/" aria-label="갓챠사주 홈" className="flex items-center no-underline">
        <Image
          src="/logo-2x.png"
          alt="갓챠사주"
          width={1000}
          height={300}
          priority
          className="block h-7 w-auto"
        />
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/coins"
          aria-label={`${formatCoinCount(balance)} 잔액 · 충전하기`}
          className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#b8944c] no-underline hover:bg-[#faf7f2] transition-colors"
        >
          <CoinSvg size={14} />
          <span className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040]">
            {balance}
          </span>
        </Link>

        <Link
          href="/mypage"
          className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#8a8070] no-underline flex items-center gap-1"
        >
          {userName}
        </Link>
      </div>
    </header>
  );
}
