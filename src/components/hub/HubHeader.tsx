import Link from "next/link";

interface HubHeaderProps {
  userName: string;
}

export default function HubHeader({ userName }: HubHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 h-12 bg-[#f5f0e8] border-b border-[#b8944c]"
    >
      <span
        className="font-[family-name:var(--font-pixel)] text-xl text-[#b8883c] tracking-[0.05em]"
      >
        갓챠사주
      </span>

      <Link
        href="/mypage"
        className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#8a8070] no-underline flex items-center gap-1"
      >
        {userName}
      </Link>
    </header>
  );
}
