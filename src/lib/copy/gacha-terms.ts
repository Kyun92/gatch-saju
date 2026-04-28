/**
 * 가챠 정체성 네이밍 중앙 상수.
 *
 * Deep Interview Round 5 합의: 네이밍 **부분 교체** 원칙.
 * - 컬렉션/액션 맥락 → 가챠 용어 사용 ("내 명부", "새 운명 캡슐 뽑기" 등)
 * - 인격체 맥락(본인/가족/친구 호칭) → "${name}님" 직접 하드코딩 유지
 *
 * 본 파일에 없는 카피(특히 "${character.name}님" 패턴)를 "캡슐"로 바꾸지 말 것.
 * 사람을 "캡슐"이라 지칭하지 않는다는 감성 원칙을 보호하는 1차 방어선.
 *
 * --- 가격·캡슐·코인 단일 토큰 (Pricing Copy Unification) ---
 * - 990원 = 코인 1개 = 캡슐 1개 (동일 단위)
 * - 990원은 부담없는 가격 메시지로 노출, 코인은 과금 단위
 * - CTA 어순: 990원 1차, 코인 보조 ("운명 캡슐 뽑기 — 990원")
 * - 비로그인(랜딩/로그인) 화면에서는 "코인" 직접 노출 자제, "운명 캡슐"·"990원" 우선
 * - 토큰에 한자 직접 노출 금지
 */

/** 코어 단가 */
export const COIN_PRICE_KRW = 990;
export const COIN_PRICE_DISPLAY = "990원";

/** 라벨 */
export const COIN_LABEL = "코인";
export const CAPSULE_LABEL = "운명 캡슐";
export const WALLET_LABEL = "WALLET";
export const BALANCE_LABEL = "보유 코인";

/** CTA */
export const PRIMARY_CTA_PULL = "운명 캡슐 뽑기";
export const PRIMARY_CTA_WITH_PRICE = `${PRIMARY_CTA_PULL} — ${COIN_PRICE_DISPLAY}`;

/** 메시지 */
export const INSUFFICIENT_BALANCE_MESSAGE =
  "코인이 부족해요. 충전하고 이어서 뽑아보세요";

/** 비로그인 후크 (코인 단어 미노출) */
export const LANDING_HOOK_LABEL = "한 판 990원부터 · 묶음 살수록 할인";

/** 운세 생성 실패 시 사용자 친화 메시지 (서버/클라 동일 톤, 단일 소스) */
export const READING_GENERATION_ERROR_MESSAGE =
  "캡슐을 여는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.";

/** 결제 실패 페이지 카피 */
export const PAYMENT_RETRY_LABEL = "다시 캡슐 뽑기";
export const PAYMENT_FAIL_HEADLINE = "캡슐이 잠시 멈췄어요";
export const PAYMENT_ERROR_DETAILS_TOGGLE = "오류 코드 보기";

/** preview 잠금 카피 */
export const PREVIEW_LOCK_HEADLINE = "캡슐을 열어 진짜 운세를 확인하세요";
export const PREVIEW_FREE_SUMMARY_FALLBACK =
  "이 캐릭터의 운명이 캡슐 안에 잠들어 있어요.";

/** 헬퍼 */
export const formatPrice = (n: number): string =>
  `${n.toLocaleString("ko-KR")}원`;
export const formatCoinCount = (n: number): string => `코인 ${n}개`;
export const formatCapsuleCount = (n: number): string => `캡슐 ${n}개`;

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
    /** 캐릭터 섹션 헤딩 (legacy — 평등 모델) */
    section_title: "내 명부",
    /** 본인 제외 타인 캐릭터 섹션 헤딩 — "1메인 + N타인" 정체성 */
    others_section_title: "내가 등록한 사람들",
    /** 타인 카운터 — `친구 N명` */
    others_counter: (n: number) => `친구 ${n}명`,
  },
} as const;

export type CopyTree = typeof COPY;
