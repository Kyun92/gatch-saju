import HubHeader from "@/components/hub/HubHeader";
import CharacterSlot from "@/components/hub/CharacterSlot";
import NewCharacterSlot from "@/components/hub/NewCharacterSlot";
import TrustBadge from "@/components/hub/TrustBadge";

/** Dev preview -- RPG character select hub, no auth required */
export default function DevHubPage() {
  return (
    <div className="hub-bg min-h-screen flex flex-col">
      <HubHeader userName="임승균" />

      <div
        className="flex-1 w-full mx-auto px-4 py-5 flex flex-col gap-3"
        style={{ maxWidth: "480px" }}
      >
        {/* Section title */}
        <div className="pixel-divider">캐릭터 선택</div>

        {/* 1. Unlocked character with stats */}
        <CharacterSlot
          character={{
            id: "char-001",
            name: "임승균",
            unlocked: true,
            gender: "male",
            mbti: "INFP",
          }}
          element="water"
          level={34}
          dayMaster="壬"
          statScores={{
            health_score: 72,
            wealth_score: 58,
            love_score: 85,
            career_score: 63,
            vitality_score: 78,
            luck_score: 91,
          }}
          characterTitle="깊은 바다의 몽상가"
        />

        {/* 2. Locked character - no stats */}
        <CharacterSlot
          character={{
            id: "char-002",
            name: "김다정",
            unlocked: false,
            gender: "female",
            mbti: "ENFJ",
          }}
          element="fire"
          level={30}
          dayMaster="丁"
          statScores={null}
          characterTitle={null}
        />

        {/* 3. Unlocked earth character */}
        <CharacterSlot
          character={{
            id: "char-003",
            name: "박준혁",
            unlocked: true,
            gender: "male",
            mbti: null,
          }}
          element="earth"
          level={28}
          dayMaster="戊"
          statScores={{
            health_score: 88,
            wealth_score: 74,
            love_score: 55,
            career_score: 92,
            vitality_score: 81,
            luck_score: 67,
          }}
          characterTitle="대지의 수호자"
        />

        {/* 4. Locked wood character */}
        <CharacterSlot
          character={{
            id: "char-004",
            name: "이수연",
            unlocked: false,
            gender: "female",
            mbti: "INTJ",
          }}
          element="wood"
          level={26}
          dayMaster="甲"
          statScores={null}
          characterTitle={null}
        />

        {/* New character slot */}
        <NewCharacterSlot />

        {/* Trust badge */}
        <TrustBadge />
      </div>
    </div>
  );
}
