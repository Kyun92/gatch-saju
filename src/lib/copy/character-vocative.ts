/**
 * 캐릭터 호칭 헬퍼.
 *
 * 본인(is_self=true) → "당신" / "당신의"
 * 타인(is_self=false) → "${name}님" / "${name}님의"
 *
 * LLM HTML 본문(reading.content)은 변경하지 않는다 — 외곽 헤더·라벨만 분기.
 * 톤 일관성을 위해 모든 외곽 호칭은 이 헬퍼를 통해 생성한다.
 */

export type CharacterVocativeInput = {
  name: string;
  is_self: boolean;
};

/** 호칭 — 예: "당신" / "수민님" */
export function getVocative(c: CharacterVocativeInput): string {
  return c.is_self ? "당신" : `${c.name}님`;
}

/** 소유격 — 예: "당신의" / "수민님의" */
export function getPossessive(c: CharacterVocativeInput): string {
  return c.is_self ? "당신의" : `${c.name}님의`;
}

/** 헤더 타이틀 — 본인이면 카테고리만, 타인이면 "${name}님의 ${category}" */
export function getHeaderTitle(
  c: CharacterVocativeInput,
  category: string,
): string {
  return c.is_self ? category : `${c.name}님의 ${category}`;
}
