import SkillTree from "@/components/hub/SkillTree";

/** Dev preview — SkillTree component with dummy data, no auth required */
export default function DevSkillTreePage() {
  return (
    <div className="hub-bg min-h-screen flex flex-col">
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "2px solid #b8944c",
          padding: "12px 16px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.875rem",
            color: "#9a7040",
          }}
        >
          {"🛠 DEV — 스킬트리 프리뷰"}
        </span>
      </div>

      <div
        className="flex-1 w-full mx-auto px-4 py-5 flex flex-col gap-6"
        style={{ maxWidth: "480px" }}
      >
        {/* Case 1: Unlocked + comprehensive purchased */}
        <div>
          <div className="pixel-divider" style={{ marginBottom: "12px" }}>
            해금 캐릭터 (종합감정 완료)
          </div>
          <SkillTree
            characterId="char-001"
            characterName="임승균"
            unlocked={true}
            purchasedReadings={["comprehensive"]}
          />
        </div>

        {/* Case 2: Unlocked + comprehensive + yearly purchased */}
        <div>
          <div className="pixel-divider" style={{ marginBottom: "12px" }}>
            해금 캐릭터 (종합감정 + 년운 완료)
          </div>
          <SkillTree
            characterId="char-002"
            characterName="박준혁"
            unlocked={true}
            purchasedReadings={["comprehensive", "yearly"]}
          />
        </div>

        {/* Case 3: Not unlocked */}
        <div>
          <div className="pixel-divider" style={{ marginBottom: "12px" }}>
            미해금 캐릭터
          </div>
          <SkillTree
            characterId="char-003"
            characterName="김다정"
            unlocked={false}
            purchasedReadings={[]}
          />
        </div>
      </div>
    </div>
  );
}
