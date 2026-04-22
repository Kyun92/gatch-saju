import SubPageHeader from "@/components/layout/SubPageHeader";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SubPageHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
