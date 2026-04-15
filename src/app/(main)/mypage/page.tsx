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
    <div
      className="w-full mx-auto px-4 py-6"
      style={{ maxWidth: "480px", minHeight: "100vh" }}
    >
      {/* 계정 정보 */}
      <PixelFrame variant="accent" className="p-5 mb-5">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* 프로필 이미지 */}
          <div
            style={{
              width: "64px",
              height: "64px",
              flexShrink: 0,
              backgroundColor: "#f0ebe0",
              border: "2px solid #b8944c",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt="프로필"
                width={64}
                height={64}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "1.5rem",
                  color: "#b8944c",
                }}
              >
                {(user?.name ?? "?")[0]}
              </span>
            )}
          </div>

          {/* 이름 + 이메일 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "1.125rem",
                color: "#b8883c",
                marginBottom: "4px",
              }}
            >
              {user?.name ?? "모험가"}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#8a8070",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email ?? ""}
            </div>
            <div
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "0.5625rem",
                color: "#b8a890",
                marginTop: "4px",
              }}
            >
              가입일: {joinDate}
            </div>
          </div>
        </div>
      </PixelFrame>

      {/* 내 캐릭터 목록 */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.875rem",
            color: "#9a7040",
            marginBottom: "12px",
          }}
        >
          내 캐릭터 ({characters?.length ?? 0})
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                style={{ textDecoration: "none" }}
              >
                <PixelFrame
                  variant={char.unlocked ? "default" : "simple"}
                  className="p-3"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* 미니 아바타 */}
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        flexShrink: 0,
                        border: char.unlocked ? "2px solid #b8944c" : "2px solid #d4cfc8",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={`/characters/${element}-${char.gender}.png`}
                        alt={char.name}
                        fill
                        style={{
                          objectFit: "cover",
                          imageRendering: "pixelated",
                          opacity: char.unlocked ? 1 : 0.3,
                          filter: char.unlocked ? "none" : "grayscale(100%)",
                        }}
                        sizes="48px"
                      />
                    </div>

                    {/* 캐릭터 정보 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "0.875rem",
                            color: char.unlocked ? "#2c2418" : "#8a8070",
                          }}
                        >
                          {char.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "0.5625rem",
                            color: "#b8a890",
                          }}
                        >
                          Lv.{level}
                        </span>
                        {char.is_self && (
                          <span
                            style={{
                              fontFamily: "var(--font-pixel)",
                              fontSize: "0.4375rem",
                              color: "#9a7040",
                              border: "1px solid #b8944c",
                              padding: "1px 4px",
                            }}
                          >
                            본인
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <ElementTag element={element} size="sm" />
                        {dayMaster && (
                          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "0.5625rem", color: "#8a8070" }}>
                            {dayMaster}
                          </span>
                        )}
                        {char.mbti && (
                          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "0.5625rem", color: "#6858b8" }}>
                            {char.mbti}
                          </span>
                        )}
                      </div>
                      {title && (
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.6875rem",
                            color: "#8a8070",
                            fontStyle: "italic",
                            marginTop: "2px",
                          }}
                        >
                          &ldquo;{title}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* 상태 뱃지 */}
                    <span
                      style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "0.5rem",
                        color: char.unlocked ? "#2e8b4e" : "#c8a020",
                        border: `1px solid ${char.unlocked ? "#2e8b4e" : "#c8a020"}`,
                        padding: "2px 6px",
                        flexShrink: 0,
                      }}
                    >
                      {char.unlocked ? "해금" : "잠김"}
                    </span>
                  </div>
                </PixelFrame>
              </Link>
            );
          })}

          {/* 새 캐릭터 추가 */}
          <Link href="/characters/new" style={{ textDecoration: "none" }}>
            <div
              style={{
                border: "2px dashed #b8944c",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: "var(--font-pixel)", fontSize: "1rem", color: "#b8944c" }}>+</span>
              <span style={{ fontFamily: "var(--font-pixel)", fontSize: "0.75rem", color: "#9a7040" }}>
                새 캐릭터 추가
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 로그아웃 */}
      <div style={{ marginTop: "24px", marginBottom: "40px" }}>
        <LogoutButton />
      </div>
    </div>
  );
}
