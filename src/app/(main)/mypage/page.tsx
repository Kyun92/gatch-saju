import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import CoinSvg from "@/components/ui/CoinSvg";
import MyPageCharacterCard from "@/components/mypage/MyPageCharacterCard";
import MyPageProfileCard from "@/components/mypage/MyPageProfileCard";
import NewCharacterSlot from "@/components/hub/NewCharacterSlot";
import {
  COPY,
  WALLET_LABEL,
  COIN_LABEL,
} from "@/lib/copy/gacha-terms";
import { REFUND_WINDOW_DAYS } from "@/lib/coins/packages";
import LogoutButton from "./LogoutButton";
import {
  formatDayMasterDisplay,
  getCharacterElement,
  type Element as ElementType,
} from "@/lib/copy/day-master";

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const userId = session.user.userId;

  // 계정 정보 (users 테이블 — 이메일·가입일·코인 잔액. OAuth user.image는 사용하지 않음)
  const { data: user } = await supabase
    .from("users")
    .select("name, email, created_at, coins")
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

  // 차트 맵: characterId → element + dayMaster 비유체
  const chartMap = new Map<
    string,
    { element: ElementType; dayMasterLabel: string }
  >();
  for (const chart of charts ?? []) {
    const sajuData = chart.data as Record<string, unknown> | null;
    const dayMaster = (sajuData?.dayMaster as string) ?? "";
    // element는 dayMaster 결정론 매핑 (fiveElements maxEntry 금지)
    const element: ElementType = getCharacterElement(dayMaster, "water");
    chartMap.set(chart.character_id, {
      element,
      dayMasterLabel: formatDayMasterDisplay(dayMaster, { useShortLabel: true }),
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

  const allCharacters = characters ?? [];
  const selfCharacter = allCharacters.find((c) => c.is_self) ?? null;
  const otherCharacters = allCharacters.filter((c) => !c.is_self);
  const othersCount = otherCharacters.length;
  const coinBalance = user?.coins ?? 0;

  // 본인 카드 표시 데이터
  const selfChartInfo = selfCharacter
    ? chartMap.get(selfCharacter.id)
    : undefined;
  const selfElement: ElementType = selfChartInfo?.element ?? "water";
  const selfDayMasterLabel = selfChartInfo?.dayMasterLabel ?? "";
  const selfTitle = selfCharacter
    ? readingMap.get(selfCharacter.id) ?? null
    : null;
  const selfBirthYear = selfCharacter?.birth_date
    ? new Date(selfCharacter.birth_date).getFullYear()
    : new Date().getFullYear();
  const selfLevel = selfCharacter
    ? new Date().getFullYear() - selfBirthYear
    : 0;

  const refundSubject = encodeURIComponent("[갓챠사주] 환불 요청");
  const refundBody = encodeURIComponent(
    [
      "안녕하세요, 갓챠사주 환불을 요청합니다.",
      "",
      `· 가입 이메일: ${user?.email ?? ""}`,
      `· 이름: ${user?.name ?? ""}`,
      `· 환불 요청 주문번호 (결제일 ${REFUND_WINDOW_DAYS}일 내): `,
      "· 환불 사유: ",
      "",
      "확인 후 회신 부탁드립니다. 감사합니다.",
    ].join("\n"),
  );
  const refundMailto = `mailto:lsk9105@gmail.com?subject=${refundSubject}&body=${refundBody}`;

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[480px] min-h-screen">
      {/* 본인 메인 프로필 카드 — OAuth user.image 대신 본인 캐릭터 아바타가 메인 정체성 */}
      <MyPageProfileCard
        character={
          selfCharacter
            ? {
                id: selfCharacter.id,
                name: selfCharacter.name,
                mbti: selfCharacter.mbti,
                unlocked: selfCharacter.unlocked,
              }
            : null
        }
        element={selfElement}
        level={selfLevel}
        gender={selfCharacter?.gender ?? "male"}
        dayMasterLabel={selfDayMasterLabel}
        title={selfTitle}
        email={user?.email ?? null}
        joinDate={joinDate}
      />

      {/* 지갑 */}
      <PixelFrame className="p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] tracking-[0.25em]"
            aria-label={`${COIN_LABEL} 잔액 ${coinBalance}개`}
          >
            {WALLET_LABEL}
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
            {COIN_LABEL}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#e8e0d0]">
          <span className="font-[family-name:var(--font-body)] text-[0.625rem] text-[#8a8070]">
            결제일 {REFUND_WINDOW_DAYS}일 내 미사용분 전액 환불 가능
          </span>
          <a
            href={refundMailto}
            className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#9a7040] underline underline-offset-2 whitespace-nowrap"
          >
            환불 요청
          </a>
        </div>
      </PixelFrame>

      {/* 내가 등록한 사람들 — 본인 제외 타인 캐릭터(가족·친구) */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="arcade-heading m-0">
            {COPY.mypage.others_section_title}
          </h2>
          <span className="font-[family-name:var(--font-pixel)] text-[0.6875rem] text-[#8a8070]">
            {COPY.mypage.others_counter(othersCount)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {otherCharacters.length === 0 ? (
            <p className="font-[family-name:var(--font-body)] text-[0.75rem] text-[#8a8070] text-center py-3">
              아직 등록한 가족·친구가 없어요.
            </p>
          ) : (
            otherCharacters.map((char) => {
              const chartInfo = chartMap.get(char.id);
              const element = chartInfo?.element ?? "water";
              const dayMasterLabel = chartInfo?.dayMasterLabel ?? "";
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
                  dayMasterLabel={dayMasterLabel}
                  title={title}
                />
              );
            })
          )}

          {/* 가족·친구 추가 — 랜딩 INSERT COIN과 동일한 아케이드 코인 버튼 */}
          <NewCharacterSlot />
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="mt-6 mb-10">
        <LogoutButton />
      </div>
    </div>
  );
}
