import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import DailyFortuneClient from "./DailyFortuneClient";

export default async function DailyPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  // Check for today's reading
  const { data: todayReading } = await supabase
    .from("readings")
    .select("*")
    .eq("user_id", session.user.userId)
    .eq("type", "daily")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Get user info for greeting
  const { data: userProfile } = await supabase
    .from("users")
    .select("name, mbti")
    .eq("id", session.user.userId)
    .single();

  return (
    <div
      className="w-full mx-auto px-4 py-6"
      style={{ maxWidth: "768px", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-xl mb-1"
          style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
        >
          📜 오늘의 퀘스트
        </h1>
        <p className="text-sm" style={{ color: "#8a8070" }}>
          {userProfile?.name ?? "모험가"}님의 일일 운세
          {userProfile?.mbti ? ` | ${userProfile.mbti}` : ""}
        </p>
      </div>

      {todayReading && todayReading.status === "complete" ? (
        <PixelFrame variant="accent" className="p-5">
          {/* Fortune Content */}
          <div className="mb-4">
            <h2
              className="text-lg mb-3"
              style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
            >
              {todayReading.character_title ?? "오늘의 운세"}
            </h2>
            <div
              className="daily-fortune-content whitespace-pre-wrap"
              style={{ color: "#2c2418" }}
            >
              {todayReading.content}
            </div>
          </div>

          {/* Lucky Items */}
          {todayReading.stat_scores && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid #b8944c" }}>
              <p
                className="text-xs mb-2"
                style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
              >
                행운 아이템
              </p>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(
                  todayReading.stat_scores as Record<string, unknown>,
                ).map(([key, value]) => (
                  <div
                    key={key}
                    className="pixel-frame-simple px-3 py-2 text-center"
                  >
                    <div
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-pixel)",
                        color: "#8a8070",
                      }}
                    >
                      {key}
                    </div>
                    <div
                      className="text-sm mt-1"
                      style={{
                        fontFamily: "var(--font-pixel)",
                        color: "#b8883c",
                      }}
                    >
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PixelFrame>
      ) : (
        <DailyFortuneClient />
      )}
    </div>
  );
}
