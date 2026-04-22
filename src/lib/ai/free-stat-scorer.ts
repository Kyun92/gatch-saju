import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { FREE_STAT_SCORING_SYSTEM } from "./prompts";
import { withAiTimeout } from "./timeout";
import { z } from "zod/v4";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const FreeStatResultSchema = z.object({
  health_score: z.int().min(0).max(100),
  wealth_score: z.int().min(0).max(100),
  love_score: z.int().min(0).max(100),
  career_score: z.int().min(0).max(100),
  vitality_score: z.int().min(0).max(100),
  luck_score: z.int().min(0).max(100),
  title: z.string().min(2).max(20),
  summary: z.string().min(10).max(100),
});

export type FreeStatResult = z.infer<typeof FreeStatResultSchema>;

const DEFAULT_FREE_STATS: FreeStatResult = {
  health_score: 50,
  wealth_score: 50,
  love_score: 50,
  career_score: 50,
  vitality_score: 50,
  luck_score: 50,
  title: "운명의 여행자",
  summary: "당신만의 운명이 펼쳐지고 있습니다.",
};

export async function generateFreeStatScores(
  charts: { saju: unknown; ziwei: unknown; western: unknown },
  mbti: string | null,
): Promise<FreeStatResult> {
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
            summary: { type: SchemaType.STRING },
          },
          required: [
            "health_score",
            "wealth_score",
            "love_score",
            "career_score",
            "vitality_score",
            "luck_score",
            "title",
            "summary",
          ],
        },
      },
    });

    const chartsInput = [
      `[사주팔자]\n${JSON.stringify(charts.saju, null, 0)}`,
      `[자미두수]\n${JSON.stringify(charts.ziwei, null, 0)}`,
      `[서양점성술]\n${JSON.stringify(charts.western, null, 0)}`,
      mbti ? `[MBTI]\n${mbti}` : "",
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");

    const result = await withAiTimeout(
      model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: chartsInput }],
          },
        ],
        systemInstruction: FREE_STAT_SCORING_SYSTEM,
      }),
      "무료 스탯",
    );

    const parsed = JSON.parse(result.response.text());
    return FreeStatResultSchema.parse(parsed);
  } catch (e) {
    console.error("Free stat scoring failed, using defaults:", e);
    return DEFAULT_FREE_STATS;
  }
}
