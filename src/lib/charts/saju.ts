import { Solar } from "lunar-javascript";
import type { BirthInfo, SajuChart } from "./types";

export function generateSajuChart(info: BirthInfo): SajuChart {
  const [y, m, d] = info.birthDate.split("-").map(Number);
  const [h, min] = info.birthTime.split(":").map(Number);
  const solar = Solar.fromYmdHms(y, m, d, h, min, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  // gender: 1=male, 0=female
  const genderNum = info.gender === "male" ? 1 : 0;
  const yun = ec.getYun(genderNum);
  const daYunArr = yun.getDaYun();

  const luckCycles = daYunArr
    .filter((_: any, i: number) => i > 0)
    .map((d: any) => ({
      ganZhi: d.getGanZhi(),
      startYear: d.getStartYear(),
      endYear: d.getEndYear(),
      startAge: d.getStartAge(),
      endAge: d.getEndAge(),
    }));

  // 오행 분포 계산
  const allWuXing = [
    ec.getYearWuXing(),
    ec.getMonthWuXing(),
    ec.getDayWuXing(),
    ec.getTimeWuXing(),
  ].join("");
  const elements: Record<string, number> = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  for (const char of allWuXing) {
    if (char in elements) elements[char]++;
  }

  return {
    type: "saju",
    fourPillars: {
      year: ec.getYear(),
      month: ec.getMonth(),
      day: ec.getDay(),
      hour: ec.getTime(),
    },
    tenGods: {
      year: ec.getYearShiShenGan(),
      month: ec.getMonthShiShenGan(),
      day: "日主",
      hour: ec.getTimeShiShenGan(),
    },
    fiveElements: elements,
    dayMaster: ec.getDayGan(),
    zodiac: lunar.getYearShengXiao(),
    luckCycles,
    raw: {
      fourPillars: {
        year: ec.getYear(),
        month: ec.getMonth(),
        day: ec.getDay(),
        hour: ec.getTime(),
      },
      tenGods: {
        year: ec.getYearShiShenGan(),
        month: ec.getMonthShiShenGan(),
        day: "日主",
        hour: ec.getTimeShiShenGan(),
      },
      hiddenStems: {
        year: ec.getYearHideGan(),
        month: ec.getMonthHideGan(),
        day: ec.getDayHideGan(),
        hour: ec.getTimeHideGan(),
      },
      wuXing: {
        year: ec.getYearWuXing(),
        month: ec.getMonthWuXing(),
        day: ec.getDayWuXing(),
        hour: ec.getTimeWuXing(),
      },
      fiveElementsDistribution: elements,
      naYin: {
        year: ec.getYearNaYin(),
        month: ec.getMonthNaYin(),
        day: ec.getDayNaYin(),
        hour: ec.getTimeNaYin(),
      },
      twelveLongLife: {
        year: ec.getYearDiShi(),
        month: ec.getMonthDiShi(),
        day: ec.getDayDiShi(),
        hour: ec.getTimeDiShi(),
      },
      xun: {
        year: ec.getYearXun() + " " + ec.getYearXunKong(),
        month: ec.getMonthXun() + " " + ec.getMonthXunKong(),
        day: ec.getDayXun() + " " + ec.getDayXunKong(),
        hour: ec.getTimeXun() + " " + ec.getTimeXunKong(),
      },
      zodiac: lunar.getYearShengXiao(),
      luckyGods: lunar.getDayJiShen(),
      unluckyGods: lunar.getDayXiongSha(),
      luckCycles,
      yunStartYear: yun.getStartYear(),
    },
  };
}

/** 오늘의 천간지지 (일간지) */
export function getTodayGanZhi(): {
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
} {
  const now = new Date();
  const solar = Solar.fromDate(now);
  const lunar = solar.getLunar();
  return {
    yearGanZhi: lunar.getYearInGanZhi(),
    monthGanZhi: lunar.getMonthInGanZhi(),
    dayGanZhi: lunar.getDayInGanZhi(),
  };
}
