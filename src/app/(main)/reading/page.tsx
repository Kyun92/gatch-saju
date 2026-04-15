import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import SamplePreview from "@/components/reading/SamplePreview";

interface ReadingPageProps {
  searchParams: Promise<{ characterId?: string }>;
}

export default async function ReadingPage({ searchParams }: ReadingPageProps) {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const { characterId } = await searchParams;
  if (!characterId) redirect("/");

  const supabase = createServerSupabaseClient();

  // Verify character ownership
  const { data: character } = await supabase
    .from("characters")
    .select("id, user_id")
    .eq("id", characterId)
    .single();

  if (!character || character.user_id !== session.user.userId) redirect("/");

  const { data: readings } = await supabase
    .from("readings")
    .select("id, type, status, character_title, created_at")
    .eq("character_id", characterId)
    .eq("type", "comprehensive")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
      <h1 className="text-xl mb-6 font-[family-name:var(--font-pixel)] text-[#b8883c]">
        ⚔️ 종합 사주 감정
      </h1>

      {/* CTA */}
      <PixelFrame variant="accent" className="p-5 mb-6 text-center">
        <p className="text-sm mb-2 font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
          사주명리 + 자미두수 + 서양점성술
        </p>
        <p className="text-sm mb-4 font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
          세 가지 운명학으로 종합 감정합니다
        </p>
        <Link href={`/reading/new?characterId=${characterId}`}>
          <PixelButton size="lg">
            종합 사주 감정받기 — 990원
          </PixelButton>
        </Link>
      </PixelFrame>

      {/* Blurred Sample Preview */}
      <SamplePreview />

      {/* Past Readings */}
      {readings && readings.length > 0 && (
        <div>
          <h2 className="text-sm mb-3 font-[family-name:var(--font-pixel)] text-[#9a7040]">
            지난 감정 기록
          </h2>
          <div className="flex flex-col gap-3">
            {readings.map((reading) => {
              const href =
                reading.status === "complete"
                  ? `/reading/${reading.id}`
                  : reading.status === "generating" || reading.status === "pending"
                    ? `/reading/generating/${reading.id}`
                    : undefined;

              const content = (
                <PixelFrame key={reading.id} className={`p-4${href ? " cursor-pointer hover:opacity-80 transition-opacity" : ""}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-[family-name:var(--font-pixel)] text-[#b8883c]">
                        {reading.character_title ?? "종합 감정"}
                      </p>
                      <p className="text-xs mt-1 text-[#8a8070]">
                        {new Date(reading.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 font-[family-name:var(--font-pixel)] border border-current ${
                        reading.status === "complete"
                          ? "text-[#2e8b4e]"
                          : reading.status === "error"
                            ? "text-[#d04040]"
                            : "text-[#c8a020]"
                      }`}
                    >
                      {reading.status === "complete"
                        ? "완료"
                        : reading.status === "error"
                          ? "오류"
                          : "진행중"}
                    </span>
                  </div>
                </PixelFrame>
              );

              return href ? (
                <Link key={reading.id} href={href}>
                  {content}
                </Link>
              ) : (
                <div key={reading.id}>{content}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
