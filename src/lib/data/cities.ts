interface CityInfo {
  lat: number;
  lng: number;
  timezone: string;
}

const KOREAN_CITIES: Record<string, CityInfo> = {
  서울: { lat: 37.5665, lng: 126.978, timezone: "Asia/Seoul" },
  부산: { lat: 35.1796, lng: 129.0756, timezone: "Asia/Seoul" },
  대구: { lat: 35.8714, lng: 128.6014, timezone: "Asia/Seoul" },
  인천: { lat: 37.4563, lng: 126.7052, timezone: "Asia/Seoul" },
  광주: { lat: 35.1595, lng: 126.8526, timezone: "Asia/Seoul" },
  대전: { lat: 36.3504, lng: 127.3845, timezone: "Asia/Seoul" },
  울산: { lat: 35.5384, lng: 129.3114, timezone: "Asia/Seoul" },
  세종: { lat: 36.48, lng: 127.2589, timezone: "Asia/Seoul" },
  수원: { lat: 37.2636, lng: 127.0286, timezone: "Asia/Seoul" },
  성남: { lat: 37.4201, lng: 127.1265, timezone: "Asia/Seoul" },
  용인: { lat: 37.2411, lng: 127.1776, timezone: "Asia/Seoul" },
  고양: { lat: 37.6584, lng: 126.832, timezone: "Asia/Seoul" },
  창원: { lat: 35.2281, lng: 128.6811, timezone: "Asia/Seoul" },
  청주: { lat: 36.6424, lng: 127.489, timezone: "Asia/Seoul" },
  전주: { lat: 35.8242, lng: 127.148, timezone: "Asia/Seoul" },
  천안: { lat: 36.8152, lng: 127.1139, timezone: "Asia/Seoul" },
  제주: { lat: 33.4996, lng: 126.5312, timezone: "Asia/Seoul" },
  포항: { lat: 36.019, lng: 129.3435, timezone: "Asia/Seoul" },
  김해: { lat: 35.2285, lng: 128.8894, timezone: "Asia/Seoul" },
  평택: { lat: 36.9921, lng: 127.1128, timezone: "Asia/Seoul" },
};

export function getCityInfo(city: string): CityInfo | null {
  return KOREAN_CITIES[city] ?? null;
}

export function getAllCities(): string[] {
  return Object.keys(KOREAN_CITIES);
}
