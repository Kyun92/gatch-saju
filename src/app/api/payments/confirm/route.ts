import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { confirmPayment } from "@/lib/payments/toss";
import { getCoinPackage } from "@/lib/coins/packages";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = (await request.json()) as {
      paymentKey?: string;
      orderId?: string;
      amount?: number;
      packageId?: string;
    };

    const { paymentKey, orderId, amount, packageId } = body;

    if (!paymentKey || !orderId || !amount || !packageId) {
      return NextResponse.json(
        { error: "결제 정보가 누락되었습니다" },
        { status: 400 },
      );
    }

    const pkg = getCoinPackage(packageId);
    if (!pkg) {
      return NextResponse.json(
        { error: "유효하지 않은 상품입니다" },
        { status: 400 },
      );
    }

    if (amount !== pkg.price) {
      return NextResponse.json(
        { error: "결제 금액이 상품 가격과 일치하지 않습니다" },
        { status: 400 },
      );
    }

    const payment = await confirmPayment(paymentKey, orderId, amount);

    if (payment.status !== "DONE") {
      return NextResponse.json(
        { error: "결제가 정상적으로 완료되지 않았습니다" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();
    const userId = session.user.userId;

    const { data: paymentLog, error: logError } = await supabase
      .from("payment_log")
      .insert({
        user_id: userId,
        payment_key: payment.paymentKey,
        order_id: payment.orderId,
        order_name: payment.orderName,
        amount: payment.totalAmount,
        status: "success",
        method: payment.method,
        approved_at: payment.approvedAt,
        coin_quantity: pkg.quantity,
        package_id: pkg.id,
      })
      .select("id")
      .single();

    if (logError || !paymentLog) {
      console.error("Payment log insert failed:", logError);
      return NextResponse.json(
        {
          error:
            "결제는 완료되었지만 기록에 실패했습니다. 고객센터로 문의해주세요.",
        },
        { status: 500 },
      );
    }

    const { data: newBalance, error: adjustError } = await supabase.rpc(
      "adjust_user_coins",
      { p_user_id: userId, p_delta: pkg.quantity },
    );

    if (adjustError) {
      console.error("Coin credit failed:", adjustError);
      return NextResponse.json(
        {
          error:
            "결제는 완료되었지만 코인 충전에 실패했습니다. 고객센터로 문의해주세요.",
        },
        { status: 500 },
      );
    }

    await supabase.from("coin_transactions").insert({
      user_id: userId,
      delta: pkg.quantity,
      reason: "purchase",
      payment_log_id: paymentLog.id,
      note: pkg.orderName,
    });

    return NextResponse.json({
      ok: true,
      paymentKey: payment.paymentKey,
      balance: newBalance,
      quantity: pkg.quantity,
    });
  } catch (e) {
    console.error("Payment confirm error:", e);
    const message =
      e instanceof Error ? e.message : "결제 확인 중 오류가 발생했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
