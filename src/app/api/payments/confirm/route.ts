import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { confirmPayment } from "@/lib/payments/toss";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentKey, orderId, amount, characterId } = body as {
      paymentKey: string;
      orderId: string;
      amount: number;
      characterId: string;
    };

    if (!paymentKey || !orderId || !amount || !characterId) {
      return NextResponse.json({ error: "결제 정보가 누락되었습니다" }, { status: 400 });
    }

    // Confirm payment via Toss
    const payment = await confirmPayment(paymentKey, orderId, amount);

    const supabase = createServerSupabaseClient();

    // Log payment
    await supabase.from("payment_log").insert({
      user_id: session.user.userId,
      character_id: characterId,
      payment_key: payment.paymentKey,
      order_id: payment.orderId,
      order_name: payment.orderName,
      amount: payment.totalAmount,
      status: payment.status,
      method: payment.method,
      approved_at: payment.approvedAt,
    });

    // Trigger reading generation
    const generateRes = await fetch(
      new URL("/api/reading/generate", request.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({ characterId }),
      },
    );

    const generateData = (await generateRes.json()) as { readingId?: string; error?: string };

    if (!generateRes.ok || !generateData.readingId) {
      return NextResponse.json(
        { error: "결제는 완료되었지만 감정 생성에 실패했습니다. 고객센터에 문의해주세요." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      readingId: generateData.readingId,
      paymentKey: payment.paymentKey,
    });
  } catch (e) {
    console.error("Payment confirm error:", e);
    const message =
      e instanceof Error ? e.message : "결제 확인 중 오류가 발생했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
