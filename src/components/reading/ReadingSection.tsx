import PixelFrame from "@/components/ui/PixelFrame";

interface ReadingSectionProps {
  htmlContent: string;
}

export default function ReadingSection({ htmlContent }: ReadingSectionProps) {
  return (
    <PixelFrame className="p-4">
      <div
        className="reading-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </PixelFrame>
  );
}
