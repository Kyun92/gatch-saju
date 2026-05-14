/**
 * 갓챠사주 연락처·사업자 정보 단일 소스.
 * 전화번호·이메일 변경 시 이 파일만 수정하면 Footer/법문서/마이페이지 전반에 반영됨.
 */

export const CUSTOMER_SUPPORT = {
  representative: "임승균",
  email: "lsk9105@gmail.com",
  emailHref: "mailto:lsk9105@gmail.com",
  phone: "010-6889-8909",
  phoneHref: "tel:+821068898909",
  hours: "평일 10:00 ~ 18:00 (주말·공휴일 제외)",
  responseSla: "영업일 기준 1~2일",
} as const;

export const BUSINESS_INFO = {
  tradeName: "온아토",
  representative: "임승균",
  businessRegistrationNumber: "607-29-96690",
  address: "경기도 용인시 기흥구 신정로 25, 108동 2205호",
  // 직전년도 거래 50회 미만 + 거래액 4,800만원 미만 간이과세자 → 통신판매업 면제.
  // 매출 증가 시 정부24에서 신고하고 이 필드를 신고번호로 교체.
  mailOrderBusinessStatus: "통신판매업 면제대상 (소규모 간이과세자)",
} as const;
