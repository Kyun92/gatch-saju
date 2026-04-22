/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
// circular-natal-horoscope-js는 CJS-only. require로 임포트 필수, 타입 래퍼 loose.
import type { BirthInfo, WesternChart } from "./types";

const { Origin, Horoscope } = require("circular-natal-horoscope-js");

function fmt(b: any) {
  return {
    key: b.key,
    label: b.label,
    sign: b.Sign?.label,
    degree: b.ChartPosition?.Ecliptic?.DecimalDegrees,
    degreeInSign:
      b.ChartPosition?.Ecliptic?.DecimalDegrees != null
        ? b.ChartPosition.Ecliptic.DecimalDegrees % 30
        : null,
    house: b.House?.id,
    isRetrograde: b.isRetrograde ?? false,
  };
}

function fmtAspect(a: any) {
  return {
    from: a.point1?.label,
    to: a.point2?.label,
    type: a.aspectType?.label || a.type,
    orb: a.orb,
  };
}

function calcWestern(params: {
  origin: {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    latitude: number;
    longitude: number;
  };
  houseSystem?: string;
  zodiac?: string;
}): any {
  const o = new Origin(params.origin);
  const h = new Horoscope({
    origin: o,
    houseSystem: params.houseSystem || "placidus",
    zodiac: params.zodiac || "tropical",
  });

  return {
    ascendant: {
      sign: h.Ascendant?.Sign?.label,
      degree: h.Ascendant?.ChartPosition?.Ecliptic?.DecimalDegrees,
    },
    midheaven: {
      sign: h.Midheaven?.Sign?.label,
      degree: h.Midheaven?.ChartPosition?.Ecliptic?.DecimalDegrees,
    },
    planets: (h.CelestialBodies?.all || []).map(fmt),
    aspects: (h.Aspects?.all || []).map(fmtAspect),
    houses: (h.Houses || []).map((x: any, i: number) => ({
      id: i + 1,
      sign: x?.Sign?.label,
      degree: x?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees,
    })),
  };
}

export function generateWesternChart(info: BirthInfo): WesternChart {
  const [y, m, d] = info.birthDate.split("-").map(Number);
  const [h, min] = info.birthTime.split(":").map(Number);

  const raw = calcWestern({
    origin: {
      year: y,
      month: m - 1,
      date: d,
      hour: h,
      minute: min,
      latitude: info.birthLat,
      longitude: info.birthLng,
    },
  });

  return { type: "western", raw };
}

/** 오늘의 행성 transit 위치 */
export function getTodayTransits(
  lat: number = 37.5665,
  lng: number = 126.978
): unknown {
  const now = new Date();
  const raw = calcWestern({
    origin: {
      year: now.getFullYear(),
      month: now.getMonth(),
      date: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      latitude: lat,
      longitude: lng,
    },
  });

  return raw.planets;
}
