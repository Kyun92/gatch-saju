import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerSupabaseClient();

    // readings에는 user_id 컬럼이 없음. character_id 조인으로 소유권 검증.
    const { data: reading, error } = await supabase
      .from("readings")
      .select(
        "id, type, status, content, stat_scores, character_title, charts_data, tokens_used, created_at, character_id",
      )
      .eq("id", id)
      .single();

    if (error || !reading) {
      return NextResponse.json(
        { error: "감정 결과를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // 소유권 검증: reading.character_id의 user_id가 세션 사용자와 일치하는가
    const { data: character } = await supabase
      .from("characters")
      .select("user_id")
      .eq("id", reading.character_id)
      .single();

    if (!character || character.user_id !== session.user.userId) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 },
      );
    }

    return NextResponse.json({ reading });
  } catch (e) {
    console.error("Reading fetch error:", e);
    return NextResponse.json(
      { error: "감정 결과 조회 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
