/**
 * AI 호출 타임아웃 (Vercel 서버리스 기본 60초 한계 대비 여유).
 * 40초 내 응답 없으면 강제 reject → 사용자에게 재시도 유도.
 */
export const AI_TIMEOUT_MS = 40_000;

export function withAiTimeout<T>(
  promise: Promise<T>,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new Error(
            `AI 호출 시간 초과 (${label}, ${AI_TIMEOUT_MS / 1000}s). 잠시 후 다시 시도해주세요.`,
          ),
        ),
      AI_TIMEOUT_MS,
    );
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}
