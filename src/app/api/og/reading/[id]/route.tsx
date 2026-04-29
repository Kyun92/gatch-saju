/**
 * OG 이미지 API — SNS 공유용 1200×630 동적 이미지 생성.
 *
 * 보안 정책:
 * - 무인증 공개 (SNS 공유 효과)
 * - 노출 화이트리스트: characters.name, gender, dayMaster→element/typeName,
 *   readings.character_title, stat_scores 요약
 * - 노출 금지: 본문 HTML, email, birth_date 풀값, free_summary 본문
 * - status="complete" reading만 허용 (생성 중·실패 reading은 404)
 *
 * 인라인 style 사용은 next/og ImageResponse JSX 컨텍스트라 합법
 * (서버 SVG 렌더용. 우리 프로젝트의 클라이언트 UI 인라인 금지 규칙 미적용).
 */
import { ImageResponse } from "next/og";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  DAY_MASTER_METAPHOR,
  type HeavenlyStem,
} from "@/lib/copy/day-master";

export const runtime = "nodejs";

type ChartData = {
  dayMaster?: string;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = createServerSupabaseClient();
  const { data: reading } = await supabase
    .from("readings")
    .select("character_id, character_title, status")
    .eq("id", id)
    .eq("status", "complete")
    .single();

  if (!reading) {
    return new Response("Not found", { status: 404 });
  }

  const { data: character } = await supabase
    .from("characters")
    .select("name")
    .eq("id", reading.character_id)
    .single();

  if (!character) {
    return new Response("Not found", { status: 404 });
  }

  const { data: chart } = await supabase
    .from("charts")
    .select("data")
    .eq("character_id", reading.character_id)
    .eq("type", "saju")
    .single();

  const dayMaster = (chart?.data as ChartData | null)?.dayMaster ?? "";
  const stem = dayMaster.charAt(0) as HeavenlyStem;
  const meta = DAY_MASTER_METAPHOR[stem];
  const typeName = meta?.typeName ?? "";
  const characterTitle = reading.character_title ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f5f0e8",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 40,
            color: "#9a7040",
            letterSpacing: "0.4em",
            marginBottom: 32,
          }}
        >
          GOTCHA · SAJU
        </div>

        <div
          style={{
            fontSize: 96,
            color: "#2c2418",
            fontWeight: 700,
            marginBottom: 24,
            display: "flex",
          }}
        >
          {character.name}님의 운명
        </div>

        {typeName && (
          <div
            style={{
              fontSize: 56,
              color: "#9a7040",
              marginBottom: 16,
              display: "flex",
            }}
          >
            {typeName}
          </div>
        )}

        {characterTitle && (
          <div
            style={{
              fontSize: 40,
              color: "#8a7355",
              display: "flex",
            }}
          >
            「{characterTitle}」
          </div>
        )}

        <div
          style={{
            marginTop: "auto",
            fontSize: 28,
            color: "#b8a890",
            display: "flex",
          }}
        >
          990원으로 운명 캡슐 뽑기 · 갓챠사주
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
