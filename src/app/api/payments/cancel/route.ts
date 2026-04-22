import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cancelPayment } from "@/lib/payments/toss";
import { REFUND_WINDOW_DAYS } from "@/lib/coins/packages";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = (await request.json()) as {
      paymentKey?: string;
      reason?: string;
    };
    const paymentKey = body.paymentKey;
    const reason = body.reason?.trim() || "고객 요청에 의한 환불";

    if (!paymentKey) {
      return NextResponse.json(
        { error: "결제 식별자가 필요합니다" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();
    const userId = session.user.userId;

    const { data: log, error: logError } = await supabase
      .from("payment_log")
      .select(
        "id, user_id, status, amount, coin_quantity, approved_at, package_id",
      )
      .eq("payment_key", paymentKey)
      .single();

    if (logError || !log) {
      return NextResponse.json(
        { error: "결제 이력을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    if (log.user_id !== userId) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    if (log.status === "cancelled") {
      return NextResponse.json(
        { error: "이미 취소된 결제입니다" },
        { status: 400 },
      );
    }

    if (log.status !== "success") {
      return NextResponse.json(
        { error: "환불 가능한 결제가 아닙니다" },
        { status: 400 },
      );
    }

    const approvedAt = log.approved_at ? new Date(log.approved_at) : null;
    if (!approvedAt) {
      return NextResponse.json(
        { error: "결제 승인 시각을 확인할 수 없습니다" },
        { status: 400 },
      );
    }
    const now = Date.now();
    const ageMs = now - approvedAt.getTime();
    const windowMs = REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    if (ageMs > windowMs) {
      return NextResponse.json(
        {
          error: `결제일로부터 ${REFUND_WINDOW_DAYS}일이 지나 환불이 제한됩니다. 고객센터로 문의해주세요.`,
        },
        { status: 400 },
      );
    }

    const purchased = log.coin_quantity ?? 0;
    if (purchased <= 0) {
      return NextResponse.json(
        {
          error:
            "이 결제는 코인 충전이 아니라서 이 경로로 환불할 수 없습니다. 고객센터로 문의해주세요.",
        },
        { status: 400 },
      );
    }

    const { data: spentRows } = await supabase
      .from("coin_transactions")
      .select("delta")
      .eq("user_id", userId)
      .in("reason", ["spend", "refund"])
      .gte("created_at", approvedAt.toISOString());

    const usedSinceCharge =
      spentRows?.reduce((sum, r) => sum + Math.abs(r.delta), 0) ?? 0;

    const refundable = purchased - usedSinceCharge;
    if (refundable <= 0) {
      return NextResponse.json(
        {
          error: "이미 전량 사용되어 환불 가능한 코인이 없습니다",
        },
        { status: 400 },
      );
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("coins")
      .eq("id", userId)
      .single();
    if (userError || !user) {
      return NextResponse.json(
        { error: "잔액 조회에 실패했습니다" },
        { status: 500 },
      );
    }
    const actualRefund = Math.min(refundable, user.coins);
    if (actualRefund <= 0) {
      return NextResponse.json(
        { error: "현재 잔액이 없어 환불할 수 없습니다" },
        { status: 400 },
      );
    }

    const refundAmount = Math.floor((log.amount * actualRefund) / purchased);
    const partial = actualRefund < purchased;

    await cancelPayment(paymentKey, reason, partial ? refundAmount : undefined);

    const { error: adjustError } = await supabase.rpc("adjust_user_coins", {
      p_user_id: userId,
      p_delta: -actualRefund,
    });
    if (adjustError) {
      console.error("Refund coin adjust failed:", adjustError);
      return NextResponse.json(
        {
          error:
            "결제 취소는 완료되었으나 코인 차감에 실패했습니다. 고객센터로 문의해주세요.",
        },
        { status: 500 },
      );
    }

    await supabase.from("coin_transactions").insert({
      user_id: userId,
      delta: -actualRefund,
      reason: "refund",
      payment_log_id: log.id,
      note: reason,
    });

    await supabase
      .from("payment_log")
      .update({ status: "cancelled" })
      .eq("id", log.id);

    return NextResponse.json({
      ok: true,
      refundedCoins: actualRefund,
      refundedAmount: refundAmount,
      totalPurchased: purchased,
      alreadyUsed: usedSinceCharge,
    });
  } catch (e) {
    console.error("Payment cancel error:", e);
    const message =
      e instanceof Error ? e.message : "환불 처리 중 오류가 발생했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
