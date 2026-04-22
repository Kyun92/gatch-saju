/* eslint-disable @typescript-eslint/no-explicit-any */
// iztro 반환 객체는 동적 필드가 많아 any가 불가피.
import { astro } from "iztro";
import type { BirthInfo, ZiweiChart } from "./types";
import { parseTimeIndex } from "../utils/datetime";

export function generateZiweiChart(info: BirthInfo): ZiweiChart {
  const timeIndex = parseTimeIndex(info.birthTime);
  const gender = info.gender === "male" ? "男" : "女";

  const astrolabe = astro.bySolar(info.birthDate, timeIndex, gender);

  return {
    type: "ziwei",
    raw: {
      gender: astrolabe.gender,
      solarDate: astrolabe.solarDate,
      lunarDate: astrolabe.lunarDate,
      chineseDate: astrolabe.chineseDate,
      time: astrolabe.time,
      timeRange: astrolabe.timeRange,
      sign: astrolabe.sign,
      zodiac: astrolabe.zodiac,
      earthlyBranchOfSoulPalace: astrolabe.earthlyBranchOfSoulPalace,
      earthlyBranchOfBodyPalace: astrolabe.earthlyBranchOfBodyPalace,
      soul: astrolabe.soul,
      body: astrolabe.body,
      fiveElementsClass: astrolabe.fiveElementsClass,
      palaces: astrolabe.palaces.map((p: any) => ({
        name: p.name,
        index: p.index,
        heavenlyStem: p.heavenlyStem,
        earthlyBranch: p.earthlyBranch,
        isBodyPalace: p.isBodyPalace,
        isOriginalPalace: p.isOriginalPalace,
        majorStars: (p.majorStars ?? []).map((s: any) => ({
          name: s.name,
          type: s.type,
          scope: s.scope,
          brightness: s.brightness ?? null,
          mutagen: s.mutagen ?? null,
        })),
        minorStars: (p.minorStars ?? []).map((s: any) => ({
          name: s.name,
          type: s.type,
          scope: s.scope,
          brightness: s.brightness ?? null,
          mutagen: s.mutagen ?? null,
        })),
        adjectiveStars: (p.adjectiveStars ?? []).map((s: any) => ({
          name: s.name,
          type: s.type,
          scope: s.scope,
          brightness: s.brightness ?? null,
          mutagen: s.mutagen ?? null,
        })),
        changsheng12: p.changsheng12 ?? null,
        boshi12: p.boshi12 ?? null,
        jiangqian12: p.jiangqian12 ?? null,
        suiqian12: p.suiqian12 ?? null,
        decadal: p.decadal ?? null,
        ages: p.ages ?? null,
      })),
    },
  };
}

/** 오늘의 자미두수 운세 (horoscope) */
export function getZiweiDailyHoroscope(
  info: BirthInfo,
  targetDate?: string
): unknown {
  const timeIndex = parseTimeIndex(info.birthTime);
  const gender = info.gender === "male" ? "男" : "女";
  const astrolabe = astro.bySolar(info.birthDate, timeIndex, gender);

  const horoscope = astrolabe.horoscope(targetDate ?? new Date());
  return horoscope;
}
