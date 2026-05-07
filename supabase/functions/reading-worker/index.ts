// supabase/functions/reading-worker/index.ts
//
// Vercel /api/reading/generate 가 fire-and-forget 호출하는 워커.
// readingId만 받아 readings.charts_data를 읽고 type별 Gemini 호출 → sanitize → readings UPDATE.
// EdgeRuntime.waitUntil 로 즉시 202 응답 후 백그라운드에서 처리한다.
//
// 환경변수: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, READING_WORKER_SECRET
// 호출 인증: Authorization: Bearer <READING_WORKER_SECRET>
//
// charts_data 스키마(JSONB):
//   AllCharts (primary character) + 옵셔널 키
//   - _secondary?: AllCharts          // compatibility 전용
//   - _yearlyGanZhi?: { ... }          // yearly 전용

import { GoogleGenerativeAI, SchemaType } from "npm:@google/generative-ai@^0.24.1";
import { createClient } from "npm:@supabase/supabase-js@^2.103.0";
import sanitizeHtml from "npm:sanitize-html@^2.17.3";
import {
  COMPREHENSIVE_SYSTEM,
  YEARLY_SYSTEM,
  COMPATIBILITY_SYSTEM,
  LOVE_SYSTEM,
  CAREER_SYSTEM,
  WEALTH_SYSTEM,
  HEALTH_SYSTEM,
  STUDY_SYSTEM,
  STAT_SCORING_SYSTEM,
} from "./prompts.ts";

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const WORKER_SECRET = Deno.env.get("READING_WORKER_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const ALLOWED_TAGS = [
  "section", "h2", "h3", "h4", "p", "div", "span",
  "table", "thead", "tbody", "tr", "th", "td",
  "ul", "ol", "li", "blockquote", "strong", "em", "br",
];

function sanitize(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { "*": ["class", "id", "aria-*"] },
  });
}

const AI_TIMEOUT_MS = 120_000;

function withTimeout<T>(p: Promise<T>, label: string): Promise<T> {
  let timer: number | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`AI 호출 시간 초과 (${label}, ${AI_TIMEOUT_MS / 1000}s)`)),
      AI_TIMEOUT_MS,
    );
  });
  return Promise.race([p, timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  });
}

type ReadingType =
  | "comprehensive"
  | "yearly"
  | "compatibility"
  | "love"
  | "career"
  | "wealth"
  | "health"
  | "study";

type ChartsData = {
  saju: { raw: unknown; fourPillars?: unknown; dayMaster?: string; fiveElements?: unknown; tenGods?: unknown };
  ziwei: { raw: unknown };
  western: { raw: unknown };
  _secondary?: ChartsData;
  _yearlyGanZhi?: {
    yearGanZhi: string;
    daYunGanZhi: string;
    monthlyGanZhi: { month: string; ganZhi: string }[];
  };
};

const CATEGORY_PROMPTS: Record<string, string> = {
  love: LOVE_SYSTEM,
  career: CAREER_SYSTEM,
  wealth: WEALTH_SYSTEM,
  health: HEALTH_SYSTEM,
  study: STUDY_SYSTEM,
};

const CATEGORY_LABELS: Record<string, string> = {
  love: "연애운",
  career: "직업운",
  wealth: "금전운",
  health: "건강운",
  study: "학업운",
};

async function callGemini(
  systemPrompt: string,
  userMessage: string,
  label: string,
  maxOutputTokens: number,
): Promise<{ html: string; tokensUsed: number }> {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });
  const result = await withTimeout(
    model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      systemInstruction: systemPrompt,
      generationConfig: { maxOutputTokens, temperature: 0.8 },
    }),
    label,
  );
  return {
    html: result.response.text(),
    tokensUsed: result.response.usageMetadata?.totalTokenCount ?? 0,
  };
}

function buildComprehensiveMessage(name: string, charts: ChartsData, mbti: string | null): string {
  return `다음은 ${name}님의 세 가지 명리/점성 차트 데이터입니다. 종합 분석을 부탁합니다.

[사주팔자]
${JSON.stringify(charts.saju.raw, null, 2)}

[자미두수]
${JSON.stringify(charts.ziwei.raw, null, 2)}

[서양점성술]
${JSON.stringify(charts.western.raw, null, 2)}
${mbti ? `\n[MBTI] ${name}님의 MBTI는 ${mbti}입니다. 각 섹션에서 자연스럽게 교차 해석해주세요.` : ""}`;
}

function buildYearlyMessage(
  name: string,
  charts: ChartsData,
  targetYear: number,
  yearlyGanZhi: NonNullable<ChartsData["_yearlyGanZhi"]>,
  mbti: string | null,
): string {
  return `다음은 ${name}님의 세 가지 명리/점성 차트 데이터입니다. ${targetYear}년 년운 분석을 부탁합니다.

[사주팔자 원국]
${JSON.stringify(charts.saju.raw, null, 2)}

[자미두수 원국]
${JSON.stringify(charts.ziwei.raw, null, 2)}

[서양점성술 원국]
${JSON.stringify(charts.western.raw, null, 2)}

[${targetYear}년 운세 기반 데이터]
세운(년운) 간지: ${yearlyGanZhi.yearGanZhi}
현재 대운 간지: ${yearlyGanZhi.daYunGanZhi}

[12개월 월운 간지]
${yearlyGanZhi.monthlyGanZhi.map((m) => `${m.month}: ${m.ganZhi}`).join("\n")}
${mbti ? `\n[MBTI] ${name}님의 MBTI는 ${mbti}입니다. 각 영역에서 자연스럽게 교차 해석해주세요.` : ""}`;
}

function buildCompatibilityMessage(
  name1: string,
  charts1: ChartsData,
  name2: string,
  charts2: ChartsData,
  mbti1: string | null,
  mbti2: string | null,
): string {
  return `[Person 1: ${name1}]
사주: ${JSON.stringify(charts1.saju.raw, null, 2)}
자미두수: ${JSON.stringify(charts1.ziwei.raw, null, 2)}
서양점성술: ${JSON.stringify(charts1.western.raw, null, 2)}
${mbti1 ? `MBTI: ${mbti1}` : ""}

[Person 2: ${name2}]
사주: ${JSON.stringify(charts2.saju.raw, null, 2)}
자미두수: ${JSON.stringify(charts2.ziwei.raw, null, 2)}
서양점성술: ${JSON.stringify(charts2.western.raw, null, 2)}
${mbti2 ? `MBTI: ${mbti2}` : ""}`;
}

function buildCategoryMessage(
  category: string,
  name: string,
  charts: ChartsData,
  mbti: string | null,
): string {
  const label = CATEGORY_LABELS[category] ?? "운세";
  return `다음은 ${name}님의 세 가지 명리/점성 차트 데이터입니다. ${label} 분석을 부탁합니다.

[사주팔자]
${JSON.stringify(charts.saju.raw, null, 2)}

[자미두수]
${JSON.stringify(charts.ziwei.raw, null, 2)}

[서양점성술]
${JSON.stringify(charts.western.raw, null, 2)}
${mbti ? `\n[MBTI] ${name}님의 MBTI는 ${mbti}입니다. 각 섹션에서 자연스럽게 교차 해석해주세요.` : ""}`;
}

type StatScores = {
  health_score: number;
  wealth_score: number;
  love_score: number;
  career_score: number;
  vitality_score: number;
  luck_score: number;
  title: string;
};

const DEFAULT_STATS: StatScores = {
  health_score: 50,
  wealth_score: 50,
  love_score: 50,
  career_score: 50,
  vitality_score: 50,
  luck_score: 50,
  title: "운명의 여행자",
};

async function generateStatScores(
  readingHtml: string,
  chartsSummary: string,
): Promise<StatScores> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            health_score: { type: SchemaType.INTEGER },
            wealth_score: { type: SchemaType.INTEGER },
            love_score: { type: SchemaType.INTEGER },
            career_score: { type: SchemaType.INTEGER },
            vitality_score: { type: SchemaType.INTEGER },
            luck_score: { type: SchemaType.INTEGER },
            title: { type: SchemaType.STRING },
          },
          required: [
            "health_score",
            "wealth_score",
            "love_score",
            "career_score",
            "vitality_score",
            "luck_score",
            "title",
          ],
        },
      },
    });
    const result = await withTimeout(
      model.generateContent({
        contents: [
          { role: "user", parts: [{ text: `${chartsSummary}\n\n---\n\n${readingHtml}` }] },
        ],
        systemInstruction: STAT_SCORING_SYSTEM,
      }),
      "스탯 점수",
    );
    const parsed = JSON.parse(result.response.text());
    return { ...DEFAULT_STATS, ...parsed };
  } catch (e) {
    console.error("Stat scoring failed, using defaults:", e);
    return DEFAULT_STATS;
  }
}

async function processReading(readingId: string): Promise<void> {
  await supabase.from("readings").update({ status: "generating" }).eq("id", readingId);

  const { data: reading, error: rErr } = await supabase
    .from("readings")
    .select("type, character_id, character_id_2, year, charts_data")
    .eq("id", readingId)
    .single();
  if (rErr || !reading) throw new Error(`Reading not found: ${readingId}`);

  const type = reading.type as ReadingType;
  const charts = reading.charts_data as ChartsData;
  if (!charts) throw new Error(`charts_data missing for reading ${readingId}`);

  const { data: character, error: cErr } = await supabase
    .from("characters")
    .select("name, mbti")
    .eq("id", reading.character_id)
    .single();
  if (cErr || !character) throw new Error(`Character not found: ${reading.character_id}`);

  const name1 = character.name ?? "";
  const mbti1 = (character.mbti as string | null) ?? null;

  let html = "";
  let tokensUsed = 0;

  if (type === "comprehensive") {
    const r = await callGemini(
      COMPREHENSIVE_SYSTEM,
      buildComprehensiveMessage(name1, charts, mbti1),
      "종합감정",
      8192,
    );
    html = r.html;
    tokensUsed = r.tokensUsed;
  } else if (type === "yearly") {
    if (!reading.year) throw new Error("yearly type requires reading.year");
    if (!charts._yearlyGanZhi) throw new Error("yearly type requires charts._yearlyGanZhi");
    const r = await callGemini(
      YEARLY_SYSTEM,
      buildYearlyMessage(name1, charts, reading.year as number, charts._yearlyGanZhi, mbti1),
      "년운",
      8192,
    );
    html = r.html;
    tokensUsed = r.tokensUsed;
  } else if (type === "compatibility") {
    if (!reading.character_id_2) throw new Error("compatibility requires character_id_2");
    if (!charts._secondary) throw new Error("compatibility requires charts._secondary");
    const { data: char2, error: c2Err } = await supabase
      .from("characters")
      .select("name, mbti")
      .eq("id", reading.character_id_2)
      .single();
    if (c2Err || !char2) throw new Error("Second character not found");
    const r = await callGemini(
      COMPATIBILITY_SYSTEM,
      buildCompatibilityMessage(
        name1,
        charts,
        char2.name ?? "",
        charts._secondary,
        mbti1,
        (char2.mbti as string | null) ?? null,
      ),
      "궁합",
      6144,
    );
    html = r.html;
    tokensUsed = r.tokensUsed;
  } else if (type in CATEGORY_PROMPTS) {
    const r = await callGemini(
      CATEGORY_PROMPTS[type],
      buildCategoryMessage(type, name1, charts, mbti1),
      CATEGORY_LABELS[type] ?? "운세",
      6144,
    );
    html = r.html;
    tokensUsed = r.tokensUsed;
  } else {
    throw new Error(`Unsupported reading type: ${type}`);
  }

  const sanitized = sanitize(html);

  let statScores: StatScores | null = null;
  let characterTitle: string | null = null;
  if (type === "comprehensive") {
    const summary = JSON.stringify(
      {
        saju: {
          fourPillars: charts.saju.fourPillars,
          dayMaster: charts.saju.dayMaster,
          fiveElements: charts.saju.fiveElements,
          tenGods: charts.saju.tenGods,
        },
      },
      null,
      2,
    );
    statScores = await generateStatScores(html, summary);
    characterTitle = statScores.title;
  }

  const { error: updErr } = await supabase
    .from("readings")
    .update({
      status: "complete",
      content: sanitized,
      stat_scores: statScores,
      character_title: characterTitle,
      tokens_used: tokensUsed,
    })
    .eq("id", readingId);
  if (updErr) throw updErr;

  if (type === "comprehensive") {
    await supabase
      .from("characters")
      .update({ unlocked: true })
      .eq("id", reading.character_id);
  }
}

async function processWithRetry(readingId: string): Promise<void> {
  try {
    await processReading(readingId);
  } catch (e) {
    console.error(`Reading ${readingId} attempt 1 failed:`, e);
    try {
      await processReading(readingId);
    } catch (e2) {
      console.error(`Reading ${readingId} retry failed:`, e2);
      await supabase
        .from("readings")
        .update({
          status: "error",
          error_message: "감정 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        })
        .eq("id", readingId);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${WORKER_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: { readingId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const readingId = body.readingId;
  if (!readingId || typeof readingId !== "string") {
    return new Response("readingId required", { status: 400 });
  }

  EdgeRuntime.waitUntil(processWithRetry(readingId));

  return new Response(JSON.stringify({ accepted: true, readingId }), {
    status: 202,
    headers: { "content-type": "application/json" },
  });
});
