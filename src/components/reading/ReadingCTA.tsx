import PixelButton from "@/components/ui/PixelButton";

export default function ReadingCTA() {
  return (
    <div className="flex flex-col gap-3 mt-6">
      <PixelButton variant="secondary" className="w-full">
        📤 결과 공유하기
      </PixelButton>
      <PixelButton variant="primary" className="w-full">
        💕 궁합 보러가기
      </PixelButton>
    </div>
  );
}
