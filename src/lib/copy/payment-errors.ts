/**
 * Toss Payments errorCode → 사용자 친화 메시지 매핑.
 *
 * 자주 발생하는 8~10종만 명시 매핑. 모르는 코드는 fallback.
 * 가챠 톤 유지(검정 비즈니스 톤 X). 결제 공급자(Toss) 정보 노출 X.
 */

export const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제를 취소했어요. 다시 캡슐을 뽑아볼까요?",
  PAY_PROCESS_ABORTED:
    "결제 진행 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
  REJECT_CARD_COMPANY:
    "카드사에서 결제가 거절됐어요. 다른 결제 수단을 시도해주세요.",
  INVALID_CARD_NUMBER: "카드 번호를 다시 확인해주세요.",
  EXCEED_MAX_DAILY_PAYMENT_COUNT:
    "오늘 결제 한도를 초과했어요. 잠시 후 다시 시도해주세요.",
  EXCEED_MAX_PAYMENT_AMOUNT: "결제 한도를 초과했어요.",
  NOT_AVAILABLE_PAYMENT:
    "지금은 결제를 처리할 수 없어요. 잠시 후 다시 시도해주세요.",
  CARD_PROCESSING_ERROR: "카드 처리 중 문제가 생겼어요. 다시 시도해주세요.",
  INVALID_CARD_EXPIRATION: "카드 유효기간을 다시 확인해주세요.",
  INVALID_STOPPED_CARD: "정지된 카드예요. 다른 카드로 시도해주세요.",
};

export const PAYMENT_ERROR_FALLBACK =
  "결제 처리 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.";

export function getPaymentErrorMessage(
  code: string | null | undefined,
  fallback: string = PAYMENT_ERROR_FALLBACK,
): string {
  if (!code) return fallback;
  return PAYMENT_ERROR_MESSAGES[code] ?? fallback;
}
