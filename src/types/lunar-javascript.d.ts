declare module "lunar-javascript" {
  export class Solar {
    static fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): Solar;
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
  }
  export class Lunar {
    getEightChar(): EightChar;
    getYearShengXiao(): string;
    getDayJiShen(): string[];
    getDayXiongSha(): string[];
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    [key: string]: any;
  }
  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getDayGan(): string;
    getYearShiShenGan(): string;
    getMonthShiShenGan(): string;
    getTimeShiShenGan(): string;
    getYearWuXing(): string;
    getMonthWuXing(): string;
    getDayWuXing(): string;
    getTimeWuXing(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
    getYearDiShi(): string;
    getMonthDiShi(): string;
    getDayDiShi(): string;
    getTimeDiShi(): string;
    getYearHideGan(): string[];
    getMonthHideGan(): string[];
    getDayHideGan(): string[];
    getTimeHideGan(): string[];
    getYearXun(): string;
    getYearXunKong(): string;
    getMonthXun(): string;
    getMonthXunKong(): string;
    getDayXun(): string;
    getDayXunKong(): string;
    getTimeXun(): string;
    getTimeXunKong(): string;
    getYun(gender: number): Yun;
    [key: string]: any;
  }
  export class Yun {
    getStartYear(): number;
    getDaYun(): DaYun[];
    [key: string]: any;
  }
  export class DaYun {
    getGanZhi(): string;
    getStartYear(): number;
    getEndYear(): number;
    getStartAge(): number;
    getEndAge(): number;
    [key: string]: any;
  }
}
