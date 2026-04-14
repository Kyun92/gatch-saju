export interface BirthInfo {
  name: string;
  birthDate: string; // "1992-09-23"
  birthTime: string; // "01:23"
  birthCity: string; // "서울"
  birthLat: number;
  birthLng: number;
  gender: "male" | "female";
  timezone: string; // "Asia/Seoul"
}

export interface SajuChart {
  type: "saju";
  fourPillars: {
    year: string; // "壬申"
    month: string; // "己酉"
    day: string; // "壬寅"
    hour: string; // "庚子"
  };
  tenGods: {
    year: string; // "比肩"
    month: string; // "正官"
    day: string; // "日主"
    hour: string; // "偏印"
  };
  fiveElements: Record<string, number>; // { 金: 3, 木: 1, 水: 3, 火: 0, 土: 1 }
  dayMaster: string; // "壬"
  zodiac: string; // "猴"
  luckCycles: Array<{
    ganZhi: string;
    startYear: number;
    endYear: number;
    startAge: number;
    endAge: number;
  }>;
  raw: unknown; // full raw data for Claude
}

export interface ZiweiChart {
  type: "ziwei";
  raw: unknown; // full iztro output for Claude
}

export interface WesternChart {
  type: "western";
  raw: unknown; // full natal chart for Claude
}

export interface AllCharts {
  saju: SajuChart;
  ziwei: ZiweiChart;
  western: WesternChart;
}
