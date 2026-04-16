import SubPageHeader from "@/components/layout/SubPageHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SubPageHeader />
      <main className="flex-1">{children}</main>
      <footer className="py-6 px-4 text-center border-t border-[#e8e0d0]">
        <p className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890] mb-1">
          온아토 | 대표 임승균 | 사업자등록번호 607-29-96690
        </p>
        <p className="text-[0.5rem] text-[#c8c0b0]">
          경기도 용인시 기흥구 신정로 25, 108동 2205호
        </p>
      </footer>
    </div>
  );
}
