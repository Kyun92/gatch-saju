import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PixelFrame from "@/components/ui/PixelFrame";
import ElementTag from "@/components/ui/ElementTag";
import LogoutButton from "./LogoutButton";

type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

const ELEMENT_MAP: Record<string, ElementType> = {
  "木": "wood", "火": "fire", "土": "earth", "金": "metal", "水": "water",
};

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const userId = session.user.userId;

  // 계정 정보 (users 테이블 — OAuth 정보만)
  const { data: user } = await supabase
    .from("users")
    .select("name, email, image, created_at")
    .eq("id", userId)
    .single();

  // 내 캐릭터 목록
  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, birth_date, gender, mbti, is_self, unlocked, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  // 각 캐릭터의 saju 차트 (element 계산용)
  const characterIds = (characters ?? []).map((c) => c.id);
  const { data: charts } = characterIds.length > 0
    ? await supabase
        .from("charts")
        .select("character_id, data")
        .in("character_id", characterIds)
        .eq("type", "saju")
    : { data: [] };

  // 각 캐릭터의 최신 종합감정
  const { data: readings } = characterIds.length > 0
    ? await supabase
        .from("readings")
        .select("character_id, character_title, created_at")
        .in("character_id", characterIds)
        .eq("type", "comprehensive")
        .eq("status", "complete")
        .order("created_at", { ascending: false })
    : { data: [] };

  // 차트 맵: characterId → element
  const chartMap = new Map<string, { element: ElementType; dayMaster: string }>();
  for (const chart of charts ?? []) {
    const sajuData = chart.data as Record<string, unknown> | null;
    const fiveElements = sajuData?.fiveElements as Record<string, number> | null;
    let element: ElementType = "water";
    if (fiveElements) {
      const maxEntry = Object.entries(fiveElements).reduce((a, b) => a[1] >= b[1] ? a : b);
      element = ELEMENT_MAP[maxEntry[0]] ?? "water";
    }
    chartMap.set(chart.character_id, {
      element,
      dayMaster: (sajuData?.dayMaster as string) ?? "",
    });
  }

  // 감정 맵: characterId → 최신 title
  const readingMap = new Map<string, string>();
  for (const r of readings ?? []) {
    if (!readingMap.has(r.character_id)) {
      readingMap.set(r.character_id, r.character_title ?? "종합 감정");
    }
  }

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("ko-KR")
    : "-";

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[480px] min-h-screen">
      {/* 계정 정보 */}
      <PixelFrame variant="accent" className="p-5 mb-5">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="w-16 h-16 shrink-0 bg-[#f0ebe0] border-2 border-[#b8944c] overflow-hidden flex items-center justify-center">
            {user?.image ? (
              <Image
                src={user.image}
                alt="프로필"
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <span className="font-[family-name:var(--font-pixel)] text-2xl text-[#b8944c]">
                {(user?.name ?? "?")[0]}
              </span>
            )}
          </div>

          {/* 이름 + 이메일 */}
          <div className="flex-1 min-w-0">
            <div className="font-[family-name:var(--font-pixel)] text-lg text-[#b8883c] mb-1">
              {user?.name ?? "모험가"}
            </div>
            <div className="text-xs text-[#8a8070] overflow-hidden text-ellipsis whitespace-nowrap">
              {user?.email ?? ""}
            </div>
            <div className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890] mt-1">
              가입일: {joinDate}
            </div>
          </div>
        </div>
      </PixelFrame>

      {/* 내 캐릭터 목록 */}
      <div className="mb-5">
        <h2 className="font-[family-name:var(--font-pixel)] text-sm text-[#9a7040] mb-3">
          내 캐릭터 ({characters?.length ?? 0})
        </h2>

        <div className="flex flex-col gap-2">
          {(characters ?? []).map((char) => {
            const chartInfo = chartMap.get(char.id);
            const element = chartInfo?.element ?? "water";
            const dayMaster = chartInfo?.dayMaster ?? "";
            const title = readingMap.get(char.id);
            const birthYear = char.birth_date
              ? new Date(char.birth_date).getFullYear()
              : 2000;
            const level = new Date().getFullYear() - birthYear;

            return (
              <Link
                key={char.id}
                href={char.unlocked ? `/daily?characterId=${char.id}` : `/reading/new?characterId=${char.id}`}
                className="no-underline"
              >
                <PixelFrame
                  variant={char.unlocked ? "default" : "simple"}
                  className="p-3"
                >
                  <div className="flex items-center gap-3">
                    {/* 미니 아바타 */}
                    <div
                      className={`w-12 h-12 shrink-0 overflow-hidden relative ${char.unlocked ? "border-2 border-[#b8944c]" : "border-2 border-[#d4cfc8]"}`}
                    >
                      <Image
                        src={`/characters/${element}-${char.gender}.png`}
                        alt={char.name}
                        fill
                        className={`object-cover [image-rendering:pixelated] ${char.unlocked ? "opacity-100" : "opacity-30 grayscale"}`}
                        sizes="48px"
                      />
                    </div>

                    {/* 캐릭터 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`font-[family-name:var(--font-pixel)] text-sm ${char.unlocked ? "text-[#2c2418]" : "text-[#8a8070]"}`}
                        >
                          {char.name}
                        </span>
                        <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890]">
                          Lv.{level}
                        </span>
                        {char.is_self && (
                          <span className="font-[family-name:var(--font-pixel)] text-[0.4375rem] text-[#9a7040] border border-[#b8944c] px-1 py-px">
                            본인
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ElementTag element={element} size="sm" />
                        {dayMaster && (
                          <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#8a8070]">
                            {dayMaster}
                          </span>
                        )}
                        {char.mbti && (
                          <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#6858b8]">
                            {char.mbti}
                          </span>
                        )}
                      </div>
                      {title && (
                        <div className="font-[family-name:var(--font-body)] text-[0.6875rem] text-[#8a8070] italic mt-0.5">
                          &ldquo;{title}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* 상태 뱃지 */}
                    <span
                      className={`font-[family-name:var(--font-pixel)] text-[0.5rem] shrink-0 px-1.5 py-0.5 ${
                        char.unlocked
                          ? "text-[#2e8b4e] border border-[#2e8b4e]"
                          : "text-[#c8a020] border border-[#c8a020]"
                      }`}
                    >
                      {char.unlocked ? "해금" : "잠김"}
                    </span>
                  </div>
                </PixelFrame>
              </Link>
            );
          })}

          {/* 새 캐릭터 추가 */}
          <Link href="/characters/new" className="no-underline">
            <div className="border-2 border-dashed border-[#b8944c] p-4 flex items-center justify-center gap-2 cursor-pointer">
              <span className="font-[family-name:var(--font-pixel)] text-base text-[#b8944c]">+</span>
              <span className="font-[family-name:var(--font-pixel)] text-xs text-[#9a7040]">
                새 캐릭터 추가
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="mt-6 mb-10">
        <LogoutButton />
      </div>
    </div>
  );
}
