import Link from "next/link";

export default function NewCharacterSlot() {
  return (
    <Link
      href="/characters/new"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          border: "2px dashed #b8944c",
          backgroundColor: "#faf7f2",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          cursor: "pointer",
          transition: "border-color 150ms ease, background-color 150ms ease",
          minHeight: "120px",
        }}
        className="new-character-slot"
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "2rem",
            color: "#b8944c",
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          +
        </span>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.75rem",
            color: "#9a7040",
            letterSpacing: "0.04em",
          }}
        >
          새 캐릭터 추가
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            color: "#8a8070",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          친구, 가족의 사주도 확인해보세요
        </span>
      </div>
    </Link>
  );
}
