import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import ElementTag from "@/components/ui/ElementTag";
import CapsuleFrame, { type Element as ElementType } from "@/components/hub/CapsuleFrame";

interface MyPageProfileCardProps {
  /** 본인 캐릭터 (characters.is_self=true) — 없을 수 있음 */
  character: {
    id: string;
    name: string;
    mbti: string | null;
    unlocked: boolean;
  } | null;
  element: ElementType;
  level: number;
  gender: string;
  /** 비유체 라벨 (예: "깊은 바다"). 부모에서 `formatDayMasterDisplay`로 변환하여 전달. */
  dayMasterLabel: string;
  /** 종합감정 최신 칭호 — 해금된 경우만 표시 */
  title: string | null;
  /** OAuth 이메일 — CS 동선용 부가 정보 (작게 표시) */
  email: string | null;
  /** 가입일 (formatted) — 작게 표시 */
  joinDate: string;
}

/**
 * 마이페이지 메인 프로필 카드 (본인=메인 정체성).
 *
 * - OAuth `user.image`를 사용하지 않는다 → 본인 캐릭터 아바타가 메인 프로필.
 * - 본인 캐릭터가 없으면 폴백 카드 (캐릭터 추가 링크).
 * - 미해금 본인 캐릭터는 잠금 톤 + 종합감정 해금 동선.
 */
export default function MyPageProfileCard({
  character,
  element,
  level,
  gender,
  dayMasterLabel,
  title,
  email,
  joinDate,
}: MyPageProfileCardProps) {
  // 폴백: 본인 캐릭터 없음 (미들웨어가 막아주므로 이론상 미발생)
  if (!character) {
    return (
      <PixelFrame variant="accent" className="p-5 mb-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-[family-name:var(--font-pixel)] text-sm text-[#9a7040]">
            본인 정보가 없습니다
          </span>
          <Link
            href="/characters/new"
            className="gacha-action-btn no-underline"
            data-variant="primary"
          >
            캐릭터 추가하기
          </Link>
          {email && <span className="mypage-self-email">{email}</span>}
          <span className="mypage-self-meta">가입일: {joinDate}</span>
        </div>
      </PixelFrame>
    );
  }

  const avatarSrc = `/characters/${element}-${gender}.png`;
  const avatarAlt = `${character.name} 캐릭터`;

  // 미해금 본인 캐릭터 — 잠금 톤 + 종합감정 해금 CTA
  if (!character.unlocked) {
    return (
      <PixelFrame variant="accent" className="p-5 mb-5">
        <div className="flex items-center gap-4">
          <CapsuleFrame
            avatarSrc={avatarSrc}
            avatarAlt={avatarAlt}
            element={element}
            size="md"
            locked
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-[family-name:var(--font-pixel)] text-base text-[#b8883c]">
                {character.name}
              </span>
              <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890]">
                Lv.{level}
              </span>
              <span className="font-[family-name:var(--font-pixel)] text-[0.4375rem] text-[#9a7040] border border-[#b8944c] px-1 py-px">
                나
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <ElementTag element={element} size="sm" />
              {dayMasterLabel && (
                <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#8a8070]">
                  {dayMasterLabel}
                </span>
              )}
            </div>
            {email && <div className="mypage-self-email">{email}</div>}
            <div className="mypage-self-meta mt-0.5">가입일: {joinDate}</div>
          </div>
        </div>

        <div className="flex gap-2 mt-3 pt-3 border-t border-[#e8e0d0]">
          <Link
            href={`/reading/preview?characterId=${character.id}`}
            className="gacha-action-btn no-underline"
            data-variant="primary"
          >
            종합감정으로 해금하기
          </Link>
        </div>
      </PixelFrame>
    );
  }

  // 해금된 본인 캐릭터 — 메인 프로필 통합 카드
  return (
    <PixelFrame variant="accent" className="p-5 mb-5">
      <div className="flex items-center gap-4">
        <CapsuleFrame
          avatarSrc={avatarSrc}
          avatarAlt={avatarAlt}
          element={element}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-[family-name:var(--font-pixel)] text-lg text-[#b8883c]">
              {character.name}
            </span>
            <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890]">
              Lv.{level}
            </span>
            <span className="font-[family-name:var(--font-pixel)] text-[0.4375rem] text-[#9a7040] border border-[#b8944c] px-1 py-px">
              나
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <ElementTag element={element} size="sm" />
            {dayMasterLabel && (
              <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#8a8070]">
                {dayMasterLabel}
              </span>
            )}
            {character.mbti && (
              <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#6858b8]">
                {character.mbti}
              </span>
            )}
          </div>
          {title && (
            <div className="font-[family-name:var(--font-body)] text-[0.6875rem] text-[#8a8070] italic mb-1">
              &ldquo;{title}&rdquo;
            </div>
          )}
          {email && <div className="mypage-self-email">{email}</div>}
          <div className="mypage-self-meta mt-0.5">가입일: {joinDate}</div>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-[#e8e0d0]">
        <Link
          href={`/daily?characterId=${character.id}`}
          className="gacha-action-btn no-underline"
        >
          일일 퀘스트
        </Link>
        <Link
          href={`/characters/${character.id}`}
          className="gacha-action-btn no-underline"
          data-variant="primary"
        >
          심화 특성
        </Link>
        <Link
          href={`/characters/${character.id}`}
          className="gacha-action-btn no-underline"
          data-variant="subtle"
        >
          관리
        </Link>
      </div>
    </PixelFrame>
  );
}
