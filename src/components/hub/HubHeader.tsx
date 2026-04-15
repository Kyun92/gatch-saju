import Link from "next/link";

interface HubHeaderProps {
  userName: string;
}

export default function HubHeader({ userName }: HubHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4"
      style={{
        height: "48px",
        backgroundColor: "#f5f0e8",
        borderBottom: "1px solid #b8944c",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "1.25rem",
          color: "#b8883c",
          letterSpacing: "0.05em",
        }}
      >
        ✦ 천명 ✦
      </span>

      <Link
        href="/mypage"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.6875rem",
          color: "#8a8070",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        👤 {userName}
      </Link>
    </header>
  );
}
