/**
 * dayMaster (천간) ↔ element (오행) 결정론 매핑 + 비유체 카피 단일 소스.
 *
 * 사용 원칙:
 * - 캐릭터의 element는 항상 dayMaster 기반(`getCharacterElement`)으로 결정한다.
 *   `fiveElements` maxEntry 재계산 금지 (사주 명리 위배).
 * - UI 표시는 한자 직접 노출을 피하고, `formatDayMasterDisplay()` /
 *   `formatElementLabel()` 헬퍼로 통일한다. 한자 보조는 `showHanja: true` 옵션으로만.
 * - 차트 엔진(`src/lib/charts/`)은 한자 원본을 보존하는 책임이며 이 모듈을 사용하지 않는다.
 */

export type HeavenlyStem =
  | "甲" | "乙" | "丙" | "丁" | "戊"
  | "己" | "庚" | "辛" | "壬" | "癸";

export type Element = "wood" | "fire" | "earth" | "metal" | "water";

/** 천간 → 오행 (사주 명리상 결정론적 매핑) */
export const HEAVENLY_STEM_TO_ELEMENT: Record<HeavenlyStem, Element> = {
  甲: "wood",  乙: "wood",
  丙: "fire",  丁: "fire",
  戊: "earth", 己: "earth",
  庚: "metal", 辛: "metal",
  壬: "water", 癸: "water",
};

/** 오행 → 한글 라벨 (한자 없는 기본 표시용) */
export const ELEMENT_LABEL: Record<Element, string> = {
  wood: "나무",
  fire: "불",
  earth: "흙",
  metal: "쇠",
  water: "물",
};

/** 오행 → 한자 (괄호 보조용 — 직접 노출하지 말 것) */
export const ELEMENT_HANJA: Record<Element, string> = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

/**
 * 천간 → 비유체 카피 (typeName / shortLabel / oneLiner 3종 분리).
 * - typeName: 캐릭터 클래스 칭호용 ("깊은 바다 타입")
 * - shortLabel: 좁은 배지·셀용 ("깊은 바다")
 * - oneLiner: 보조 캡션용 ("도량 넓고 지혜로워요")
 *
 * 톤은 `prompts.ts`의 비유체와 동일한 MZ 친화 한국어.
 */
export const DAY_MASTER_METAPHOR: Record<HeavenlyStem, {
  typeName: string;
  shortLabel: string;
  oneLiner: string;
}> = {
  甲: { typeName: "아름드리 나무 타입", shortLabel: "아름드리 나무", oneLiner: "곧고 굳건하게 위로 뻗어가요" },
  乙: { typeName: "넝쿨꽃 타입",         shortLabel: "넝쿨꽃",       oneLiner: "부드럽지만 끈질기게 휘감아요" },
  丙: { typeName: "한낮의 태양 타입",   shortLabel: "한낮의 태양", oneLiner: "밝고 정열적으로 빛나요" },
  丁: { typeName: "촛불 타입",           shortLabel: "촛불",         oneLiner: "따스하고 섬세하게 밝혀요" },
  戊: { typeName: "거대한 산 타입",     shortLabel: "거대한 산",   oneLiner: "우직하고 묵묵하게 자리 잡아요" },
  己: { typeName: "기름진 들판 타입",   shortLabel: "기름진 들판", oneLiner: "포용하고 다정하게 키워내요" },
  庚: { typeName: "강철검 타입",         shortLabel: "강철검",       oneLiner: "단호하고 명료하게 베어내요" },
  辛: { typeName: "보석 타입",           shortLabel: "보석",         oneLiner: "예리하고 세련되게 빛나요" },
  壬: { typeName: "깊은 바다 타입",     shortLabel: "깊은 바다",   oneLiner: "도량 넓고 지혜로워요" },
  癸: { typeName: "비와 이슬 타입",     shortLabel: "비와 이슬",   oneLiner: "감수성 깊고 섬세해요" },
};

const HEAVENLY_STEMS = Object.keys(HEAVENLY_STEM_TO_ELEMENT) as HeavenlyStem[];

function pickStem(dayMaster: string | null | undefined): HeavenlyStem | null {
  if (!dayMaster) return null;
  const stem = dayMaster.trim().charAt(0);
  return (HEAVENLY_STEMS as string[]).includes(stem) ? (stem as HeavenlyStem) : null;
}

/**
 * 캐릭터 element 결정 (단일 진실 공급원).
 *
 * fiveElements maxEntry 재계산 금지. 항상 dayMaster 기반.
 *
 * @param dayMaster 사주 차트의 일간 (예: "壬水", "壬", null)
 * @param fallback 미인식 시 기본 element (기본값: "water")
 */
export function getCharacterElement(
  dayMaster: string | null | undefined,
  fallback: Element = "water",
): Element {
  const stem = pickStem(dayMaster);
  if (!stem) return fallback;
  return HEAVENLY_STEM_TO_ELEMENT[stem];
}

/**
 * dayMaster 표시 문자열.
 *
 * - 기본 (옵션 없음): "깊은 바다 타입"
 * - showHanja=true:  "깊은 바다 타입(壬水)"
 * - useShortLabel:   "깊은 바다" (showHanja 조합 시 "깊은 바다(壬水)")
 *
 * 미인식 stem은 빈 문자열 반환. 호출 측에서 fallback 처리.
 */
export function formatDayMasterDisplay(
  dayMaster: string | null | undefined,
  options?: {
    showHanja?: boolean;
    useShortLabel?: boolean;
  },
): string {
  const stem = pickStem(dayMaster);
  if (!stem) return "";
  const meta = DAY_MASTER_METAPHOR[stem];
  const base = options?.useShortLabel ? meta.shortLabel : meta.typeName;
  if (!options?.showHanja) return base;
  const elem = HEAVENLY_STEM_TO_ELEMENT[stem];
  return `${base}(${stem}${ELEMENT_HANJA[elem]})`;
}

/**
 * 오행 표시 문자열.
 *
 * - 기본: "물"
 * - showHanja=true: "물(水)"
 */
export function formatElementLabel(
  element: Element,
  options?: { showHanja?: boolean },
): string {
  const label = ELEMENT_LABEL[element];
  if (!options?.showHanja) return label;
  return `${label}(${ELEMENT_HANJA[element]})`;
}
