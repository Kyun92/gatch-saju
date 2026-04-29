import PixelButton from "@/components/ui/PixelButton";
import ShareButtons from "@/components/reading/ShareButtons";

type Props = {
  readingId: string;
  characterName: string;
};

export default function ReadingCTA({ readingId, characterName }: Props) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      <ShareButtons readingId={readingId} characterName={characterName} />
      <PixelButton variant="primary" className="w-full">
        궁합 보러가기
      </PixelButton>
    </div>
  );
}
