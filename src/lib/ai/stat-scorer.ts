import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { STAT_SCORING_SYSTEM } from "./prompts";
import { withAiTimeout } from "./timeout";
import { z } from "zod/v4";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const StatScoresSchema = z.object({
  health_score: z.int().min(0).max(100),
  wealth_score: z.int().min(0).max(100),
  love_score: z.int().min(0).max(100),
  career_score: z.int().min(0).max(100),
  vitality_score: z.int().min(0).max(100),
  luck_score: z.int().min(0).max(100),
  title: z.string().min(2).max(20),
});

export type StatScores = z.infer<typeof StatScoresSchema>;

const DEFAULT_STATS: StatScores = {
  health_score: 50,
  wealth_score: 50,
  love_score: 50,
  career_score: 50,
  vitality_score: 50,
  luck_score: 50,
  title: "운명의 여행자",
};

export async function generateStatScores(
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

    const result = await withAiTimeout(
      model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${chartsSummary}\n\n---\n\n${readingHtml}` }],
          },
        ],
        systemInstruction: STAT_SCORING_SYSTEM,
      }),
      "스탯 점수",
    );

    const parsed = JSON.parse(result.response.text());
    return StatScoresSchema.parse(parsed);
  } catch (e) {
    console.error("Stat scoring failed, using defaults:", e);
    return DEFAULT_STATS;
  }
}
