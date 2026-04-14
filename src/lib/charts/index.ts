export * from "./types";
export * from "./saju";
export * from "./ziwei";
export * from "./western";

import type { BirthInfo, AllCharts } from "./types";
import { generateSajuChart } from "./saju";
import { generateZiweiChart } from "./ziwei";
import { generateWesternChart } from "./western";

export function generateAllCharts(info: BirthInfo): AllCharts {
  return {
    saju: generateSajuChart(info),
    ziwei: generateZiweiChart(info),
    western: generateWesternChart(info),
  };
}
