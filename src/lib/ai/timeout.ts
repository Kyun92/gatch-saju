/**
 * AI 호출 타임아웃.
 * Vercel Hobby는 함수 한도 60s, sanitize/DB 쓰기 후처리 버퍼 ~10s 확보.
 * Supabase Edge Function 워커(Phase 2 도입)는 한도가 더 길어 자체 타임아웃을 별도 사용.
 */
export const AI_TIMEOUT_MS = 50_000;

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
