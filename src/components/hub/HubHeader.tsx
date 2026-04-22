import Link from "next/link";
import CoinSvg from "@/components/ui/CoinSvg";

interface HubHeaderProps {
  userName: string;
  balance?: number;
}

export default function HubHeader({ userName, balance = 0 }: HubHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-12 bg-[#f5f0e8] border-b border-[#b8944c]">
      <span className="font-[family-name:var(--font-pixel)] text-xl text-[#b8883c] tracking-[0.05em]">
        갓챠사주
      </span>

      <div className="flex items-center gap-2">
        <Link
          href="/coins"
          aria-label={`코인 잔액 ${balance}개 · 충전하기`}
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
