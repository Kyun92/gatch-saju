/**
 * 운세 생성 중 진행 단계 메시지.
 *
 * generating 페이지와 LoadingProgress 컴포넌트가 공용으로 사용한다.
 * 마이크로카피 통일을 위해 단일 소스화. 한자 직접 노출 금지.
 */

export const LOADING_STEPS: ReadonlyArray<{
  label: string;
  from: number;
  to: number;
}> = [
  { label: "사주 차트를 펼치는 중", from: 0, to: 25 },
  { label: "별자리 도면을 정렬하는 중", from: 25, to: 50 },
  { label: "운명을 풀어 적는 중", from: 50, to: 80 },
  { label: "마지막으로 다듬는 중", from: 80, to: 100 },
];

/** status="generating" 동안 시간 기반으로 순환할 메시지들. */
export const GENERATING_ROTATION_MESSAGES: ReadonlyArray<string> = [
  "사주 차트를 펼치는 중",
  "별자리 도면을 정렬하는 중",
  "자미두수의 별을 짚는 중",
  "MBTI와 운명을 엮는 중",
  "운명을 풀어 적는 중",
  "마지막으로 다듬는 중",
];

export function getLoadingStepLabel(progress: number): string {
  const step = LOADING_STEPS.find((s) => progress >= s.from && progress < s.to);
  return step?.label ?? LOADING_STEPS[LOADING_STEPS.length - 1].label;
}
