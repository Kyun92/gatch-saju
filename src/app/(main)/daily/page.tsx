import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import DailyFortuneClient from "./DailyFortuneClient";
import UpsellBanner from "@/components/daily/UpsellBanner";

interface DailyPageProps {
  searchParams: Promise<{ characterId?: string }>;
}

export default async function DailyPage({ searchParams }: DailyPageProps) {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const { characterId } = await searchParams;
  if (!characterId) redirect("/");

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  // Fetch character and verify ownership
  const { data: character } = await supabase
    .from("characters")
    .select("id, name, mbti, user_id")
    .eq("id", characterId)
    .single();

  if (!character || character.user_id !== session.user.userId) redirect("/");

  // Check for today's reading by character_id
  const { data: todayReading } = await supabase
    .from("readings")
    .select("*")
    .eq("character_id", characterId)
    .eq("type", "daily")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })
    .limit(1)
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
          {character.name}님의 일일 운세
          {character.mbti ? ` | ${character.mbti}` : ""}
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
        <DailyFortuneClient characterId={characterId} />
      )}

      {/* Upsell banner */}
      <UpsellBanner />
    </div>
  );
}
