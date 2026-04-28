/**
 * 일일운세 라벨 토큰 + 섹션 분리 헬퍼.
 *
 * - DAILY_SECTION_HEADERS: AI 프롬프트가 강제하는 5개 섹션 헤더 순서.
 * - DAILY_STAT_LABELS: stat_scores의 키를 사용자에게 노출할 한국어 라벨로 매핑.
 *   현재는 daily_score 한 종이지만, 향후 키 추가에 대비해 Record + 폴백 함수로 구성.
 * - splitDailyContentIntoSections: AI가 생성한 plain text 본문을 섹션 카드 단위로 분리.
 *   ##~#### (2~4개 #) 헤더를 인식하고, 헤더가 0개인 레거시 데이터는 단일 섹션 폴백.
 *
 * 한자 직접 노출 0건 — 모든 라벨은 한글/특수문자만 사용한다.
 */

export const DAILY_SECTION_HEADERS = [
  "오늘의 흐름",
  "사랑·관계",
  "일·돈",
  "건강·컨디션",
  "오늘의 한 줄",
] as const;
export type DailySectionHeader = (typeof DAILY_SECTION_HEADERS)[number];

export const DAILY_STAT_LABELS: Record<string, string> = {
  daily_score: "오늘의 점수",
};

export const STAT_FALLBACK_LABEL = "스탯";

export const labelForStatKey = (key: string): string =>
  DAILY_STAT_LABELS[key] ?? STAT_FALLBACK_LABEL;

/**
 * 일일운세 본문을 섹션 단위로 쪼갠다.
 *
 * - 정규식: `^#{2,4}\s+(.+)$` — 줄 앞의 ##/###/#### 헤더 인식.
 * - `[SCORE:XX]` 토큰은 api/daily 라우트가 이미 strip하지만, 안전망으로 한 번 더 제거.
 * - 헤더가 0개거나 본문이 비어 있으면 단일 섹션("오늘의 흐름")으로 폴백 — 레거시 plain text 호환.
 */
export function splitDailyContentIntoSections(
  text: string,
): { heading: string; body: string }[] {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return [];

  const cleaned = trimmed.replace(/\[SCORE:\d{1,3}\]/gi, "").trim();
  const lines = cleaned.split(/\r?\n/);

  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; bodyLines: string[] } | null = null;
  const headerRe = /^#{2,4}\s+(.+)\s*$/;

  for (const line of lines) {
    const m = line.match(headerRe);
    if (m) {
      if (current) {
        sections.push({
          heading: current.heading,
          body: current.bodyLines.join("\n").trim(),
        });
      }
      current = { heading: m[1].trim(), bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    } else {
      // 헤더 없이 시작하는 본문 → 단일 섹션 폴백 시작
      current = { heading: "오늘의 흐름", bodyLines: [line] };
    }
  }
  if (current) {
    sections.push({
      heading: current.heading,
      body: current.bodyLines.join("\n").trim(),
    });
  }

  // 본문이 있는 섹션만 노출. 헤더만 있는 비정상 응답이면 단일 섹션 폴백.
  const nonEmpty = sections.filter((s) => s.body.length > 0);
  return nonEmpty.length > 0 ? nonEmpty : [{ heading: "오늘의 흐름", body: cleaned }];
}
