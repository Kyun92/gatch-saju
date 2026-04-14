import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  COMPREHENSIVE_SYSTEM,
  DAILY_SYSTEM,
  COMPATIBILITY_SYSTEM,
} from "./prompts";
import type { AllCharts } from "../charts/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/** Comprehensive reading -- Gemini 2.5 Pro */
export async function generateComprehensiveReading(
  name: string,
  charts: AllCharts,
  mbti?: string | null,
): Promise<{ html: string; tokensUsed: number }> {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

  const userMessage = `다음은 ${name}님의 세 가지 명리/점성 차트 데이터입니다. 종합 분석을 부탁합니다.

[사주팔자]
${JSON.stringify(charts.saju.raw, null, 2)}

[자미두수]
${JSON.stringify(charts.ziwei.raw, null, 2)}

[서양점성술]
${JSON.stringify(charts.western.raw, null, 2)}
${mbti ? `\n[MBTI] ${name}님의 MBTI는 ${mbti}입니다. 각 섹션에서 자연스럽게 교차 해석해주세요.` : ""}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    systemInstruction: COMPREHENSIVE_SYSTEM,
    generationConfig: { maxOutputTokens: 8192, temperature: 0.8 },
  });

  const text = result.response.text();
  const tokensUsed = result.response.usageMetadata?.totalTokenCount ?? 0;
  return { html: text, tokensUsed };
}

/** Daily fortune -- Gemini 2.5 Flash */
export async function generateDailyFortune(
  name: string,
  charts: AllCharts,
  todayGanZhi: {
    yearGanZhi: string;
    monthGanZhi: string;
    dayGanZhi: string;
  },
  mbti?: string | null,
): Promise<{ text: string; tokensUsed: number }> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const dateStr = new Date().toISOString().slice(0, 10);
  const sajuSummary = {
    fourPillars: charts.saju.fourPillars,
    dayMaster: charts.saju.dayMaster,
    fiveElements: charts.saju.fiveElements,
    tenGods: charts.saju.tenGods,
  };

  const userMessage = `오늘은 ${dateStr}입니다.
오늘의 천간지지: 년 ${todayGanZhi.yearGanZhi}, 월 ${todayGanZhi.monthGanZhi}, 일 ${todayGanZhi.dayGanZhi}

[${name}님의 사주 요약]
${JSON.stringify(sajuSummary, null, 2)}

[자미두수 핵심]
명궁: ${(charts.ziwei.raw as Record<string, unknown>)?.earthlyBranchOfSoulPalace ?? ""}
오행국: ${(charts.ziwei.raw as Record<string, unknown>)?.fiveElementsClass ?? ""}
${mbti ? `\n[MBTI] ${mbti}` : ""}
오늘의 일일운세를 작성해주세요.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    systemInstruction: DAILY_SYSTEM,
    generationConfig: { maxOutputTokens: 4096, temperature: 0.8 },
  });

  const text = result.response.text();
  const tokensUsed = result.response.usageMetadata?.totalTokenCount ?? 0;
  return { text, tokensUsed };
}

/** Compatibility -- Gemini 2.5 Pro */
export async function generateCompatibilityReading(
  name1: string,
  charts1: AllCharts,
  name2: string,
  charts2: AllCharts,
  mbti1?: string | null,
  mbti2?: string | null,
): Promise<{ html: string; tokensUsed: number }> {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

  const userMessage = `[Person 1: ${name1}]
사주: ${JSON.stringify(charts1.saju.raw, null, 2)}
자미두수: ${JSON.stringify(charts1.ziwei.raw, null, 2)}
서양점성술: ${JSON.stringify(charts1.western.raw, null, 2)}
${mbti1 ? `MBTI: ${mbti1}` : ""}

[Person 2: ${name2}]
사주: ${JSON.stringify(charts2.saju.raw, null, 2)}
자미두수: ${JSON.stringify(charts2.ziwei.raw, null, 2)}
서양점성술: ${JSON.stringify(charts2.western.raw, null, 2)}
${mbti2 ? `MBTI: ${mbti2}` : ""}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    systemInstruction: COMPATIBILITY_SYSTEM,
    generationConfig: { maxOutputTokens: 6144, temperature: 0.8 },
  });

  return {
    html: result.response.text(),
    tokensUsed: result.response.usageMetadata?.totalTokenCount ?? 0,
  };
}
