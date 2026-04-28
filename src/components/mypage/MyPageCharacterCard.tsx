import Link from "next/link";
import PixelFrame from "@/components/ui/PixelFrame";
import ElementTag from "@/components/ui/ElementTag";
import CapsuleFrame, { type Element as ElementType } from "@/components/hub/CapsuleFrame";

interface MyPageCharacterCardProps {
  character: {
    id: string;
    name: string;
    mbti: string | null;
    is_self: boolean;
    unlocked: boolean;
  };
  element: ElementType;
  level: number;
  gender: string;
  /** 비유체 라벨 (예: "깊은 바다"). 부모에서 `formatDayMasterDisplay`로 변환하여 전달. */
  dayMasterLabel: string;
  title: string | null;
}

/**
 * 마이페이지 캐릭터 카드.
 *
 * 네이밍 규칙 (gacha-terms.ts 정책):
 * - 이름 표시는 항상 `${character.name}` (또는 `${character.name}님`) 그대로.
 *   — "캡슐"이라는 단어로 사람을 지칭하지 말 것.
 * - 컬렉션/액션 맥락은 COPY 상수 경유.
 */
export default function MyPageCharacterCard({
  character,
  element,
  level,
  gender,
  dayMasterLabel,
  title,
}: MyPageCharacterCardProps) {
  const avatarSrc = `/characters/${element}-${gender}.png`;
  const avatarAlt = `${character.name} 캐릭터`;

  // 잠긴 캐릭터 — 종합감정 구매 동선
  if (!character.unlocked) {
    return (
      <Link
        href={`/reading/new?characterId=${character.id}`}
        className="no-underline"
      >
        <PixelFrame variant="simple" className="p-3">
          <div className="flex items-center gap-3">
            <CapsuleFrame
              avatarSrc={avatarSrc}
              avatarAlt={avatarAlt}
              element={element}
              size="sm"
              locked
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-[family-name:var(--font-pixel)] text-sm text-[#8a8070]">
                  {character.name}
                </span>
                <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890]">
                  Lv.{level}
                </span>
                {character.is_self && (
                  <span className="font-[family-name:var(--font-pixel)] text-[0.4375rem] text-[#9a7040] border border-[#b8944c] px-1 py-px">
                    본인
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <ElementTag element={element} size="sm" />
                {dayMasterLabel && (
                  <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#8a8070]">
                    {dayMasterLabel}
                  </span>
                )}
              </div>
              <div className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#c8a020] mt-1">
                종합감정으로 해금하기 &rarr;
              </div>
            </div>
            <span className="mypage-status-badge" data-state="locked">잠김</span>
          </div>
        </PixelFrame>
      </Link>
    );
  }

  // 해금된 캐릭터 — 3버튼 액션
  return (
    <PixelFrame variant="default" className="p-3">
      <div className="flex items-center gap-3">
        <CapsuleFrame
          avatarSrc={avatarSrc}
          avatarAlt={avatarAlt}
          element={element}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-[family-name:var(--font-pixel)] text-sm text-[#2c2418]">
              {character.name}
            </span>
            <span className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890]">
              Lv.{level}
            </span>
            {character.is_self && (
              <span className="font-[family-name:var(--font-pixel)] text-[0.4375rem] text-[#9a7040] border border-[#b8944c] px-1 py-px">
                본인
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
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
            <div className="font-[family-name:var(--font-body)] text-[0.6875rem] text-[#8a8070] italic mt-0.5">
              &ldquo;{title}&rdquo;
            </div>
          )}
        </div>
        <span className="mypage-status-badge" data-state="unlocked">해금</span>
      </div>

      {/* 액션 버튼 */}
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
