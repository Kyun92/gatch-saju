import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import CoinSvg from "@/components/ui/CoinSvg";
import MyPageCharacterCard from "@/components/mypage/MyPageCharacterCard";
import CollectionCounter from "@/components/hub/CollectionCounter";
import NewCharacterSlot from "@/components/hub/NewCharacterSlot";
import { COPY } from "@/lib/copy/gacha-terms";
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

  // 계정 정보 (users 테이블 — OAuth 정보 + 코인 잔액)
  const { data: user } = await supabase
    .from("users")
    .select("name, email, image, created_at, coins")
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

  const characterCount = characters?.length ?? 0;
  const coinBalance = user?.coins ?? 0;

  const refundSubject = encodeURIComponent("[갓챠사주] 환불 요청");
  const refundBody = encodeURIComponent(
    [
      "안녕하세요, 갓챠사주 환불을 요청합니다.",
      "",
      `· 가입 이메일: ${user?.email ?? ""}`,
      `· 이름: ${user?.name ?? ""}`,
      "· 환불 요청 주문번호 (결제일 7일 내): ",
      "· 환불 사유: ",
      "",
      "확인 후 회신 부탁드립니다. 감사합니다.",
    ].join("\n"),
  );
  const refundMailto = `mailto:lsk9105@gmail.com?subject=${refundSubject}&body=${refundBody}`;

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[480px] min-h-screen">
      {/* 계정 정보 */}
      <PixelFrame variant="accent" className="p-5 mb-5">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="account-card-avatar">
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

      {/* 지갑 */}
      <PixelFrame className="p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] tracking-[0.25em]">
            WALLET
          </span>
          <Link
            href="/coins"
            className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2"
          >
            충전하기
          </Link>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <CoinSvg size={22} />
          <span className="font-[family-name:var(--font-pixel)] text-3xl text-[#b8883c]">
            {coinBalance}
          </span>
          <span className="font-[family-name:var(--font-pixel)] text-[0.75rem] text-[#8a8070] mt-1">
            코인
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#e8e0d0]">
          <span className="font-[family-name:var(--font-body)] text-[0.625rem] text-[#8a8070]">
            결제일 7일 내 미사용분 전액 환불 가능
          </span>
          <a
            href={refundMailto}
            className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2 whitespace-nowrap"
          >
            환불 요청
          </a>
        </div>
      </PixelFrame>

      {/* 내 명부 */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="arcade-heading m-0">{COPY.mypage.section_title}</h2>
          <CollectionCounter count={characterCount} />
        </div>

        <div className="flex flex-col gap-2">
          {(characters ?? []).map((char) => {
            const chartInfo = chartMap.get(char.id);
            const element = chartInfo?.element ?? "water";
            const dayMaster = chartInfo?.dayMaster ?? "";
            const title = readingMap.get(char.id) ?? null;
            const birthYear = char.birth_date
              ? new Date(char.birth_date).getFullYear()
              : 2000;
            const level = new Date().getFullYear() - birthYear;

            return (
              <MyPageCharacterCard
                key={char.id}
                character={{
                  id: char.id,
                  name: char.name,
                  mbti: char.mbti,
                  is_self: char.is_self,
                  unlocked: char.unlocked,
                }}
                element={element}
                level={level}
                gender={char.gender}
                dayMaster={dayMaster}
                title={title}
              />
            );
          })}

          {/* 새 캐릭터 추가 — 랜딩 INSERT COIN과 동일한 아케이드 코인 버튼 */}
          <NewCharacterSlot />
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="mt-6 mb-6">
        <LogoutButton />
      </div>

      {/* 사업자 정보 */}
      <div className="mb-10 pt-4 border-t border-[#e8e0d0]">
        <p className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890] mb-1">
          온아토 | 대표 임승균
        </p>
        <p className="text-[0.5rem] text-[#c8c0b0] mb-0.5">
          사업자등록번호 607-29-96690
        </p>
        <p className="text-[0.5rem] text-[#c8c0b0]">
          경기도 용인시 기흥구 신정로 25, 108동 2205호
        </p>
      </div>
    </div>
  );
}
