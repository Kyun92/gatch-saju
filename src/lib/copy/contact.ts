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
} as const;
