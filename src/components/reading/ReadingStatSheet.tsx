import CharacterCard from "@/components/character/CharacterCard";
import StatBar from "@/components/ui/StatBar";
import PixelFrame from "@/components/ui/PixelFrame";
import type { StatScores } from "@/lib/ai/stat-scorer";
import type { ElementType } from "@/lib/character/get-preset";

interface ReadingStatSheetProps {
  statScores: StatScores;
  characterTitle: string;
  dayMaster: string;
  level: number;
  gender: "male" | "female";
  element: ElementType;
}

export default function ReadingStatSheet({
  statScores,
  characterTitle,
  dayMaster,
  level,
  gender,
  element,
}: ReadingStatSheetProps) {
  const avatarUrl = `/characters/${element}-${gender}.png`;

  return (
    <div className="flex flex-col gap-4">
      <CharacterCard
        avatarUrl={avatarUrl}
        dayMaster={dayMaster}
        level={level}
        title={characterTitle}
        element={element}
      />

      <PixelFrame variant="accent" className="p-4">
        <h3
          className="text-sm mb-3"
          style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
        >
          능력치
        </h3>
        <div className="flex flex-col gap-2.5">
          <StatBar
            icon="\u2764"
            label="생명력"
            value={statScores.vitality_score}
            color="#d04040"
          />
          <StatBar
            icon="\uD83D\uDCB0"
            label="재물운"
            value={statScores.wealth_score}
            color="#3070c0"
          />
          <StatBar
            icon="\uD83D\uDC95"
            label="연애운"
            value={statScores.love_score}
            color="#d06890"
          />
          <StatBar
            icon="\uD83D\uDCBC"
            label="직업운"
            value={statScores.career_score}
            color="#6858b8"
          />
          <StatBar
            icon="\uD83C\uDF3F"
            label="건강"
            value={statScores.health_score}
            color="#2e8b4e"
          />
          <StatBar
            icon="\u2B50"
            label="행운"
            value={statScores.luck_score}
            color="#c8a020"
          />
        </div>
      </PixelFrame>
    </div>
  );
}
