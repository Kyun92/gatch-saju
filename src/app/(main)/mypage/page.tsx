import { auth, signOut } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import CharacterCard from "@/components/character/CharacterCard";
import LogoutButton from "./LogoutButton";

type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

function getElementFromMonth(month: number): ElementType {
  if (month >= 2 && month <= 4) return "wood";
  if (month >= 5 && month <= 7) return "fire";
  if (month >= 8 && month <= 10) return "metal";
  return "water";
}

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.userId)
    .single();

  const { data: readings } = await supabase
    .from("readings")
    .select("id, type, status, character_title, created_at")
    .eq("user_id", session.user.userId)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: sajuChart } = await supabase
    .from("charts")
    .select("data")
    .eq("user_id", session.user.userId)
    .eq("type", "saju")
    .single();

  const birthMonth = user?.birth_date
    ? new Date(user.birth_date).getMonth() + 1
    : 1;
  const element = getElementFromMonth(birthMonth);
  const dayMaster =
    (sajuChart?.data as Record<string, string> | null)?.dayMaster ?? user?.name ?? "?";

  return (
    <div
      className="w-full mx-auto px-4 py-6"
      style={{ maxWidth: "768px", minHeight: "100vh" }}
    >
      <h1
        className="text-xl mb-6"
        style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
      >
        👤 마이페이지
      </h1>

      {/* Character Card */}
      <CharacterCard
        dayMaster={dayMaster}
        level={readings?.length ? Math.min(readings.length + 1, 99) : 1}
        title={user?.mbti ? `${user.mbti} 모험가` : "신규 모험가"}
        element={element}
        className="mb-6"
      />

      {/* User Info */}
      <PixelFrame className="p-4 mb-6">
        <h2
          className="text-sm mb-3"
          style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
        >
          프로필 정보
        </h2>
        <div className="flex flex-col gap-2 text-sm" style={{ color: "#2c2418" }}>
          <div className="flex justify-between">
            <span style={{ color: "#8a8070" }}>이름</span>
            <span>{user?.name ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#8a8070" }}>생년월일</span>
            <span>{user?.birth_date ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#8a8070" }}>출생지</span>
            <span>{user?.birth_city ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#8a8070" }}>MBTI</span>
            <span>{user?.mbti ?? "미설정"}</span>
          </div>
        </div>
      </PixelFrame>

      {/* Reading History */}
      {readings && readings.length > 0 && (
        <PixelFrame className="p-4 mb-6">
          <h2
            className="text-sm mb-3"
            style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
          >
            감정 이력
          </h2>
          <div className="flex flex-col gap-2">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="flex justify-between items-center py-2"
                style={{ borderBottom: "1px solid rgba(184,148,76,0.2)" }}
              >
                <span className="text-sm" style={{ color: "#2c2418" }}>
                  {reading.character_title ?? reading.type}
                </span>
                <span className="text-xs" style={{ color: "#8a8070" }}>
                  {new Date(reading.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
            ))}
          </div>
        </PixelFrame>
      )}

      {/* Logout */}
      <LogoutButton />
    </div>
  );
}
