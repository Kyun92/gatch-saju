/**
 * 가챠 정체성 네이밍 중앙 상수.
 *
 * Deep Interview Round 5 합의: 네이밍 **부분 교체** 원칙.
 * - 컬렉션/액션 맥락 → 가챠 용어 사용 ("내 명부", "새 운명 캡슐 뽑기" 등)
 * - 인격체 맥락(본인/가족/친구 호칭) → "${name}님" 직접 하드코딩 유지
 *
 * 본 파일에 없는 카피(특히 "${character.name}님" 패턴)를 "캡슐"로 바꾸지 말 것.
 * 사람을 "캡슐"이라 지칭하지 않는다는 감성 원칙을 보호하는 1차 방어선.
 */
export const COPY = {
  collection: {
    /** 섹션 타이틀 */
    title: "내 명부",
    /** 카운터 — `캡슐 N개 보유` */
    counter: (n: number) => `캡슐 ${n}개 보유`,
    /** 카운터 라벨 — 아이콘 옆에 붙는 고정 텍스트 */
    label: "내 명부",
  },
  action: {
    /** 새 캐릭터 생성 버튼 */
    draw_new: "새 운명 캡슐 뽑기",
    /** 컬렉션 전체 보기 */
    view_collection: "명부 열람",
    /** 허브에서 빈 슬롯 서브 문구 */
    draw_new_sub: "가족·친구의 운명도 뽑아보세요",
  },
  mypage: {
    /** 캐릭터 섹션 헤딩 */
    section_title: "내 명부",
  },
} as const;

export type CopyTree = typeof COPY;
