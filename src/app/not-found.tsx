import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <PixelFrame variant="accent" className="p-6 text-center w-full max-w-sm">
        <div className="font-[family-name:var(--font-pixel)] text-4xl text-[#9a7040] mb-3">
          404
        </div>
        <h1 className="text-lg mb-3 font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
          캡슐을 찾을 수 없어요
        </h1>
        <p className="text-sm mb-6 text-[#4a3e2c]">
          요청하신 페이지가 존재하지 않거나
          <br />
          이동·삭제되었을 수 있어요.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/" className="no-underline">
            <PixelButton className="w-full">홈으로</PixelButton>
          </Link>
          <Link
            href="/contact"
            className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2"
          >
            고객센터 문의
          </Link>
        </div>
      </PixelFrame>
    </div>
  );
}
