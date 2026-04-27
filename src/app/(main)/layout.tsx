import SubPageHeader from "@/components/layout/SubPageHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      <SubPageHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
