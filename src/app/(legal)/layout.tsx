import Image from "next/image";
import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#f5f0e8]">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 bg-white border-b-2 border-[#b8944c] h-12">
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
        <span className="font-[family-name:var(--font-pixel)] text-sm text-[#2c2418] absolute left-1/2 -translate-x-1/2">
          약관 및 정책
        </span>
        <div className="w-8" />
      </header>
      <main className="flex-1 py-8 px-4">
        <article className="max-w-2xl mx-auto bg-white border-2 border-[#b8944c] p-6 sm:p-8">
          {children}
        </article>
      </main>
    </div>
  );
}
