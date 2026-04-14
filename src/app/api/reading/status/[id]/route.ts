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

    const { data: reading, error } = await supabase
      .from("readings")
      .select("id, status, content, stat_scores, character_title, error_message, character_id")
      .eq("id", id)
      .single();

    if (error || !reading) {
      return NextResponse.json({ error: "감정 결과를 찾을 수 없습니다" }, { status: 404 });
    }

    // Ownership check via character
    if (reading.character_id) {
      const { data: character } = await supabase
        .from("characters")
        .select("user_id")
        .eq("id", reading.character_id)
        .single();
      if (character?.user_id !== session.user.userId) {
        return NextResponse.json({ error: "권한 없음" }, { status: 403 });
      }
    }

    return NextResponse.json({ reading });
  } catch (e) {
    console.error("Reading status error:", e);
    return NextResponse.json({ error: "상태 조회 중 오류가 발생했습니다" }, { status: 500 });
  }
}
