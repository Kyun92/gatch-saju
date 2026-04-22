const TOSS_BASE_URL = "https://api.tosspayments.com/v1";

function getAuthHeader(): string {
  const credentials = Buffer.from(`${process.env.TOSS_SECRET_KEY!}:`).toString("base64");
  return `Basic ${credentials}`;
}

async function tossRequest<T>(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${TOSS_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json() as T & { code?: string; message?: string };

  if (!res.ok) {
    const err = data as { code?: string; message?: string };
    throw new Error(
      `토스페이먼츠 오류 [${err.code ?? res.status}]: ${err.message ?? "알 수 없는 오류"}`
    );
  }

  return data;
}

/** 결제 승인 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<TossPayment> {
  return tossRequest<TossPayment>("POST", "/payments/confirm", {
    paymentKey,
    orderId,
    amount,
  });
}

/** 결제 취소 (cancelAmount 생략 시 전액 취소) */
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number,
): Promise<TossPayment> {
  return tossRequest<TossPayment>("POST", `/payments/${paymentKey}/cancel`, {
    cancelReason,
    ...(cancelAmount !== undefined ? { cancelAmount } : {}),
  });
}

export interface TossPayment {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: "READY" | "IN_PROGRESS" | "WAITING_FOR_DEPOSIT" | "DONE" | "CANCELED" | "PARTIAL_CANCELED" | "ABORTED" | "EXPIRED";
  totalAmount: number;
  method: string;
  currency: string;
  approvedAt?: string;
  requestedAt?: string;
}
