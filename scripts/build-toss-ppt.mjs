// 토스페이먼츠 심사 제출용 결제경로 PPT 생성기.
// Usage: node scripts/build-toss-ppt.mjs

import pptxgen from "/opt/homebrew/lib/node_modules/pptxgenjs/dist/pptxgen.es.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT = path.resolve(__dirname, "..", "docs", "toss-payment-flow.pptx");
const SHOTS_DIR = path.resolve(__dirname, "..", "docs", "screenshots");

function screenshotPath(name) {
  const p = path.join(SHOTS_DIR, `${name}.png`);
  return fs.existsSync(p) ? p : null;
}

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inch
pres.title = "갓챠사주 결제경로 안내";
pres.author = "온아토";
pres.company = "온아토";

// 브랜드 팔레트
const COLORS = {
  gold: "9A7040",
  goldLight: "B8883C",
  cream: "F5F0E8",
  card: "FFFFFF",
  ink: "2C2418",
  sub: "8A8070",
  muted: "B8A890",
  border: "D4B070",
  placeholder: "E8E0D0",
  placeholderText: "A89878",
  accent: "C8A020",
  red: "D04040",
};

const FONT_TITLE = "Malgun Gothic";
const FONT_BODY = "Malgun Gothic";

// ---------- Helpers ----------
function addFooter(slide, pageNum, totalPages) {
  slide.addText("갓챠사주 · 온아토", {
    x: 0.5,
    y: 7.1,
    w: 4,
    h: 0.3,
    fontSize: 9,
    color: COLORS.sub,
    fontFace: FONT_BODY,
  });
  slide.addText(`${pageNum} / ${totalPages}`, {
    x: 8.8,
    y: 7.1,
    w: 4,
    h: 0.3,
    fontSize: 9,
    color: COLORS.sub,
    align: "right",
    fontFace: FONT_BODY,
  });
}

function addTitle(slide, title, subtitle) {
  slide.background = { color: COLORS.card };
  slide.addText(title, {
    x: 0.6,
    y: 0.5,
    w: 12.1,
    h: 0.7,
    fontSize: 28,
    bold: true,
    color: COLORS.gold,
    fontFace: FONT_TITLE,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 1.2,
      w: 12.1,
      h: 0.4,
      fontSize: 14,
      color: COLORS.sub,
      fontFace: FONT_BODY,
    });
  }
}

function addScreenshotPlaceholder(slide, x, y, w, h, url, shotName) {
  const shot = shotName ? screenshotPath(shotName) : null;

  if (shot) {
    // 얇은 테두리 프레임 (실제 캡처 강조용)
    slide.addShape(pres.ShapeType.rect, {
      x, y, w, h,
      fill: { color: "FFFFFF" },
      line: { color: COLORS.border, width: 1 },
    });
    // contain 모드로 비율 유지하며 박스 안에 맞춤
    slide.addImage({
      path: shot,
      x, y, w, h,
      sizing: { type: "contain", w, h },
    });
    return;
  }

  // placeholder (캡처 전 상태)
  slide.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { color: COLORS.placeholder },
    line: { color: COLORS.border, width: 1, dashType: "dash" },
  });
  slide.addText("여기에 스크린샷 삽입", {
    x, y: y + h / 2 - 0.5,
    w, h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.placeholderText,
    align: "center",
    fontFace: FONT_BODY,
  });
  if (url) {
    slide.addText(url, {
      x, y: y + h / 2 - 0.05,
      w, h: 0.3,
      fontSize: 11,
      color: COLORS.placeholderText,
      align: "center",
      fontFace: FONT_BODY,
      italic: true,
    });
  }
  slide.addText("(1200 × 900 권장 · 프로덕션에서 실제 화면 캡처)", {
    x, y: y + h / 2 + 0.3,
    w, h: 0.3,
    fontSize: 10,
    color: COLORS.placeholderText,
    align: "center",
    fontFace: FONT_BODY,
  });
}

const TOTAL = 16;

// ---------- Slide 1: 표지 ----------
{
  const s = pres.addSlide();
  s.background = { color: COLORS.gold };

  // 상단 태그
  s.addText("TOSS PAYMENTS · PAYMENT FLOW", {
    x: 0.6, y: 0.6, w: 12.1, h: 0.4,
    fontSize: 13, color: "FFFFFF", bold: true,
    charSpacing: 6, fontFace: FONT_BODY,
  });

  // 메인 타이틀
  s.addText("갓챠사주", {
    x: 0.6, y: 1.8, w: 12.1, h: 1.4,
    fontSize: 72, bold: true, color: "FFFFFF", fontFace: FONT_TITLE,
  });
  s.addText("결제경로 안내", {
    x: 0.6, y: 3.1, w: 12.1, h: 0.8,
    fontSize: 32, color: "FFFFFF", fontFace: FONT_TITLE,
  });

  // 구분선
  s.addShape(pres.ShapeType.line, {
    x: 0.6, y: 4.2, w: 2.5, h: 0,
    line: { color: "FFFFFF", width: 3 },
  });

  // 사업자 정보 블록
  const info = [
    { key: "운영사",       value: "온아토 (대표 임승균)" },
    { key: "사업자등록번호", value: "607-29-96690" },
    { key: "서비스 URL",    value: "https://gatch-saju.onato.co.kr" },
    { key: "제출일",        value: "2026-04-22" },
  ];
  info.forEach((row, i) => {
    s.addText(row.key, {
      x: 0.6, y: 4.5 + i * 0.45, w: 2, h: 0.4,
      fontSize: 13, color: "FFFFFF", bold: true, fontFace: FONT_BODY,
    });
    s.addText(row.value, {
      x: 2.8, y: 4.5 + i * 0.45, w: 9, h: 0.4,
      fontSize: 13, color: "FFFFFF", fontFace: FONT_BODY,
    });
  });
}

// ---------- Slide 2: 서비스 소개 ----------
{
  const s = pres.addSlide();
  addTitle(s, "서비스 개요", "Service Overview");

  const bullets = [
    { h: "3체계 교차분석 감정 서비스", b: "사주팔자 · 자미두수 · 서양점성술을 동시 해석해 일관성 높은 결과 제공" },
    { h: "1계정 N캐릭터 구조", b: "본인·가족·지인의 생년월일시로 \"캐릭터\"를 만들어 맞춤 감정 수행" },
    { h: "코인 지갑 결제", b: "선충전 방식. 코인 1개로 유료 감정 1건 이용. 유효기간 없음" },
    { h: "무료 진입점", b: "일일운세와 캐릭터 생성은 무료로 제공하여 저장벽 허용" },
  ];

  bullets.forEach((item, i) => {
    const y = 1.9 + i * 1.15;
    // 아이콘 원
    s.addShape(pres.ShapeType.ellipse, {
      x: 0.8, y: y + 0.1, w: 0.5, h: 0.5,
      fill: { color: COLORS.gold },
      line: { color: COLORS.gold, width: 0 },
    });
    s.addText(String(i + 1), {
      x: 0.8, y: y + 0.1, w: 0.5, h: 0.5,
      fontSize: 18, bold: true, color: "FFFFFF",
      align: "center", valign: "middle", fontFace: FONT_TITLE,
    });
    // 헤더
    s.addText(item.h, {
      x: 1.6, y, w: 11, h: 0.45,
      fontSize: 18, bold: true, color: COLORS.ink, fontFace: FONT_TITLE,
    });
    // 본문
    s.addText(item.b, {
      x: 1.6, y: y + 0.5, w: 11, h: 0.5,
      fontSize: 13, color: COLORS.sub, fontFace: FONT_BODY,
    });
  });

  addFooter(s, 2, TOTAL);
}

// ---------- Slide 3: 사업자 정보 ----------
{
  const s = pres.addSlide();
  addTitle(s, "사업자 정보", "Business Info");

  const rows = [
    ["상호",           "온아토"],
    ["대표자",         "임승균"],
    ["사업자등록번호", "607-29-96690"],
    ["사업장 주소",    "경기도 용인시 기흥구 신정로 25, 108동 2205호"],
    ["연락처",         "010-6889-8909"],
    ["이메일",         "lsk9105@gmail.com"],
  ];

  const tableRows = rows.map(([k, v]) => [
    { text: k, options: {
        bold: true, color: COLORS.gold, fontSize: 13,
        fontFace: FONT_BODY,
        fill: { color: COLORS.cream },
        valign: "middle",
        margin: 0.1,
      } },
    { text: v, options: {
        color: COLORS.ink, fontSize: 13,
        fontFace: FONT_BODY,
        valign: "middle",
        margin: 0.1,
      } },
  ]);

  s.addTable(tableRows, {
    x: 1.5, y: 2,
    w: 10.3,
    colW: [3, 7.3],
    rowH: 0.55,
    border: { type: "solid", color: COLORS.border, pt: 1 },
    fontFace: FONT_BODY,
  });

  s.addText("※ 토스페이먼츠 심사에 제출하는 사업자 기본정보입니다.", {
    x: 1.5, y: 6.3, w: 10.3, h: 0.4,
    fontSize: 11, italic: true, color: COLORS.sub, fontFace: FONT_BODY,
  });

  addFooter(s, 3, TOTAL);
}

// ---------- Slide 4: 결제 플로우 개요 ----------
{
  const s = pres.addSlide();
  addTitle(s, "결제 플로우 (8단계)", "End-to-end User Journey");

  const steps = [
    { n: 1, t: "랜딩",       d: "비로그인 진입" },
    { n: 2, t: "로그인",     d: "카카오 소셜" },
    { n: 3, t: "캐릭터 생성", d: "온보딩" },
    { n: 4, t: "허브",       d: "잔액 배지" },
    { n: 5, t: "지갑",       d: "/coins 패키지 선택" },
    { n: 6, t: "토스 결제창", d: "SDK 호출" },
    { n: 7, t: "충전 완료",   d: "/coins/success" },
    { n: 8, t: "감정 뽑기",   d: "1코인 차감" },
  ];

  const boxW = 1.5;
  const boxH = 1.2;
  const gap = 0.05;
  const startX = 0.45;
  const rowY = [2.4, 4.5];

  steps.forEach((step, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    // 한 행에 4개, 각각 3.1 간격
    const x = startX + col * 3.15;
    const y = rowY[row];

    // 박스
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: boxW, h: boxH,
      fill: { color: COLORS.cream },
      line: { color: COLORS.gold, width: 2 },
      rectRadius: 0.1,
    });
    // 번호
    s.addText(String(step.n), {
      x, y: y + 0.05, w: boxW, h: 0.4,
      fontSize: 14, bold: true, color: COLORS.gold,
      align: "center", fontFace: FONT_TITLE,
    });
    // 제목
    s.addText(step.t, {
      x, y: y + 0.45, w: boxW, h: 0.35,
      fontSize: 14, bold: true, color: COLORS.ink,
      align: "center", fontFace: FONT_TITLE,
    });
    // 설명
    s.addText(step.d, {
      x, y: y + 0.8, w: boxW, h: 0.35,
      fontSize: 10, color: COLORS.sub,
      align: "center", fontFace: FONT_BODY,
    });

    // 화살표 (다음 박스로, 같은 행일 때만)
    if (col < 3) {
      const arrowX = x + boxW + gap;
      s.addShape(pres.ShapeType.rightArrow, {
        x: arrowX, y: y + boxH / 2 - 0.15, w: 0.3, h: 0.3,
        fill: { color: COLORS.gold },
        line: { color: COLORS.gold, width: 0 },
      });
    }
  });

  // 2행 시작점 표시
  s.addText("→", {
    x: 0, y: 3.7, w: 13.3, h: 0.5,
    fontSize: 22, color: COLORS.gold,
    align: "center", fontFace: FONT_TITLE,
  });

  addFooter(s, 4, TOTAL);
}

// ---------- Helper: 스크린 슬라이드 (모바일 세로 캡처 기준 레이아웃) ----------
function addScreenSlide({ pageNum, title, subtitle, url, description, shotName }) {
  const s = pres.addSlide();
  addTitle(s, title, subtitle);

  // 좌측: 모바일 스크린샷 (세로 프레임, 390:844 ≈ 1:2.16 비율 고려)
  addScreenshotPlaceholder(s, 0.6, 1.9, 2.5, 5.2, url, shotName);

  // 우측: 설명
  const descX = 3.5;
  const descW = 9.3;

  s.addText("URL", {
    x: descX, y: 1.9, w: descW, h: 0.3,
    fontSize: 10, bold: true, color: COLORS.gold, charSpacing: 3, fontFace: FONT_BODY,
  });
  s.addText(url || "-", {
    x: descX, y: 2.2, w: descW, h: 0.4,
    fontSize: 13, color: COLORS.ink, fontFace: FONT_BODY,
    hyperlink: url ? { url } : undefined,
  });

  s.addShape(pres.ShapeType.line, {
    x: descX, y: 2.8, w: descW, h: 0,
    line: { color: COLORS.border, width: 1 },
  });

  s.addText("설명", {
    x: descX, y: 3.0, w: descW, h: 0.3,
    fontSize: 10, bold: true, color: COLORS.gold, charSpacing: 3, fontFace: FONT_BODY,
  });
  const descLines = Array.isArray(description) ? description : [description];
  s.addText(
    descLines.map((line) => ({ text: line, options: { breakLine: true, bullet: { code: "25CF" } } })),
    {
      x: descX, y: 3.3, w: descW, h: 3.5,
      fontSize: 13, color: COLORS.ink, fontFace: FONT_BODY,
      paraSpaceAfter: 8,
    },
  );

  addFooter(s, pageNum, TOTAL);
  return s;
}

// ---------- Slide 5: 홈 ----------
addScreenSlide({
  pageNum: 5,
  title: "1. 홈 — 비로그인 진입",
  subtitle: "Landing",
  url: "https://gatch-saju.onato.co.kr/landing",
  shotName: "05-landing",
  description: [
    "비로그인 방문자가 처음 보는 화면",
    "서비스 소개 + 카카오 로그인 CTA",
    "하단에 \"요금 안내\" 링크로 상품 페이지 진입 가능",
  ],
});

// ---------- Slide 6: 요금 안내 ----------
{
  const s = pres.addSlide();
  addTitle(s, "2. 요금 안내 — 상품·가격 공개", "Pricing");

  addScreenshotPlaceholder(s, 0.6, 1.9, 2.5, 5.2, "https://gatch-saju.onato.co.kr/pricing", "06-pricing");

  // 우측 URL + 패키지 표
  const descX = 3.5;
  const descW = 9.3;

  s.addText("URL", {
    x: descX, y: 1.9, w: descW, h: 0.3,
    fontSize: 10, bold: true, color: COLORS.gold, charSpacing: 3, fontFace: FONT_BODY,
  });
  s.addText("https://gatch-saju.onato.co.kr/pricing", {
    x: descX, y: 2.2, w: descW, h: 0.4,
    fontSize: 13, color: COLORS.ink, fontFace: FONT_BODY,
  });

  s.addShape(pres.ShapeType.line, {
    x: descX, y: 2.8, w: descW, h: 0,
    line: { color: COLORS.border, width: 1 },
  });

  s.addText("코인 패키지", {
    x: descX, y: 3.0, w: descW, h: 0.3,
    fontSize: 10, bold: true, color: COLORS.gold, charSpacing: 3, fontFace: FONT_BODY,
  });

  const header = [
    { text: "수량", options: { bold: true, color: "FFFFFF", fill: { color: COLORS.gold }, align: "center", fontFace: FONT_BODY } },
    { text: "가격", options: { bold: true, color: "FFFFFF", fill: { color: COLORS.gold }, align: "center", fontFace: FONT_BODY } },
    { text: "할인",  options: { bold: true, color: "FFFFFF", fill: { color: COLORS.gold }, align: "center", fontFace: FONT_BODY } },
  ];
  const rows = [
    ["1코인",  "990원",    "-"],
    ["3코인",  "2,700원",  "-9%"],
    ["5코인",  "4,200원",  "-15%"],
    ["10코인", "7,900원",  "-20%"],
  ];
  const tableBody = [header, ...rows.map((r) => r.map((c) => ({
    text: c,
    options: { color: COLORS.ink, align: "center", fontFace: FONT_BODY },
  })))];

  s.addTable(tableBody, {
    x: descX, y: 3.4,
    w: 6,
    colW: [1.8, 2.4, 1.8],
    rowH: 0.5,
    fontSize: 13,
    border: { type: "solid", color: COLORS.border, pt: 1 },
  });

  s.addText("※ 비로그인 상태로 /pricing 에서 상품·가격 확인 가능.\n   결제 버튼은 로그인 유도로 연결됩니다.", {
    x: descX, y: 6.0, w: descW, h: 0.8,
    fontSize: 12, color: COLORS.sub, italic: true, fontFace: FONT_BODY,
  });

  addFooter(s, 6, TOTAL);
}

// ---------- Slide 7: 로그인 ----------
addScreenSlide({
  pageNum: 7,
  title: "3. 로그인 (카카오)",
  subtitle: "Social Login",
  url: "https://gatch-saju.onato.co.kr/login",
  shotName: "07-login",
  description: [
    "카카오 계정으로 소셜 로그인",
    "네이버·구글은 현재 \"준비 중\" 상태 (비활성)",
    "NextAuth.js 기반, Redirect URI는 카카오 콘솔에 등록됨",
  ],
});

// ---------- Slide 8: 허브 ----------
addScreenSlide({
  pageNum: 8,
  title: "4. 허브 — 로그인 후 메인",
  subtitle: "Hub · Balance Badge",
  url: "https://gatch-saju.onato.co.kr/",
  shotName: "08-hub",
  description: [
    "상단 헤더에 현재 코인 잔액 배지 (✮ N) 항시 노출",
    "캐릭터 슬롯 리스트 — 본인/가족/지인 구분",
    "배지 클릭 시 /coins 지갑 페이지로 이동",
  ],
});

// ---------- Slide 9: 지갑 /coins ----------
addScreenSlide({
  pageNum: 9,
  title: "5. 지갑 — 패키지 선택 (실결제)",
  subtitle: "Wallet · Purchase",
  url: "https://gatch-saju.onato.co.kr/coins",
  shotName: "09-coins",
  description: [
    "4개 코인 패키지 카드 (1·3·5·10)",
    "카드 클릭 즉시 토스페이먼츠 결제창 호출",
    "상단에 현재 잔액 표시, 하단에 환불 정책 요약",
  ],
});

// ---------- Slide 10: 토스 결제창 ----------
addScreenSlide({
  pageNum: 10,
  title: "6. 토스페이먼츠 결제창",
  subtitle: "Toss Payments SDK",
  url: "tosspayments.com (SDK Popup)",
  shotName: "10-toss-checkout",
  description: [
    "Toss Payments SDK로 호출되는 공식 결제창",
    "카드 · 간편결제 · 계좌이체 등 사용자가 수단 선택",
    "customerKey는 서비스 내 사용자 ID로 전달하여 이력 추적",
    "orderName은 \"갓챠사주 코인 N개\" 형식으로 전달",
  ],
});

// ---------- Slide 11: 충전 완료 ----------
addScreenSlide({
  pageNum: 11,
  title: "7. 충전 완료",
  subtitle: "Charge Complete",
  url: "https://gatch-saju.onato.co.kr/coins/success",
  shotName: "11-coins-success",
  description: [
    "Toss 결제 승인 후 /api/payments/confirm 호출",
    "users.coins 증가 + coin_transactions 이력 기록",
    "사용자에게 충전 수량 · 현재 잔액 · \"뽑으러 가기\" CTA 표시",
    "returnTo 쿼리가 있으면 원래 경로로 자동 복귀",
  ],
});

// ---------- Slide 12: 결제 실패 ----------
addScreenSlide({
  pageNum: 12,
  title: "8. 결제 실패 화면",
  subtitle: "Payment Failure",
  url: "https://gatch-saju.onato.co.kr/coins/fail",
  shotName: "12-coins-fail",
  description: [
    "카드사 거절 · 결제 중단 · 시스템 오류 등 실패 케이스",
    "오류 코드 + 친절한 안내 문구 표시",
    "\"다시 시도\" 버튼으로 /coins 재진입, 홈으로 링크 제공",
  ],
});

// ---------- Slide 13: 감정 결과 ----------
addScreenSlide({
  pageNum: 13,
  title: "9. 코인 소비 → 감정 결과",
  subtitle: "Reading Result",
  url: "https://gatch-saju.onato.co.kr/reading/{id}",
  shotName: "13-reading",
  description: [
    "충전된 코인으로 감정을 뽑으면 트랜잭션 내 1코인 차감",
    "백그라운드에서 AI 감정 HTML 생성 (종합감정/년운/궁합 등)",
    "생성 완료 후 결과 페이지에서 표·섹션으로 구조화하여 표시",
    "스킬트리(/characters/{id})에서 이미 뽑은 감정 재열람 가능",
  ],
});

// ---------- Slide 14: 환불 정책 ----------
{
  const s = pres.addSlide();
  addTitle(s, "환불 정책", "Refund Policy");

  // 좌측: 정책 4대 원칙
  const policies = [
    { t: "7일 이내 미사용분 전액 환불", d: "결제일 기준 7일 이내, 사용되지 않은 코인에 한해 전액 환불" },
    { t: "사용된 코인 환불 제한",        d: "전자상거래법 제17조 제2항 제5호(디지털 콘텐츠 제공 개시) 적용" },
    { t: "부분 환불 지원",                d: "일부만 사용한 경우 남은 코인 비율만큼 부분 환불" },
    { t: "유효기간 없음",                 d: "충전한 코인은 회원 상태 유지 중 언제든 사용 가능" },
  ];

  policies.forEach((p, i) => {
    const y = 1.9 + i * 1.05;
    s.addShape(pres.ShapeType.rect, {
      x: 0.6, y, w: 0.08, h: 0.95,
      fill: { color: COLORS.gold },
      line: { color: COLORS.gold, width: 0 },
    });
    s.addText(p.t, {
      x: 0.9, y, w: 6, h: 0.4,
      fontSize: 16, bold: true, color: COLORS.ink, fontFace: FONT_TITLE,
    });
    s.addText(p.d, {
      x: 0.9, y: y + 0.45, w: 6, h: 0.5,
      fontSize: 11, color: COLORS.sub, fontFace: FONT_BODY,
    });
  });

  // 우측: 계산식 박스
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.4, y: 1.9, w: 5.3, h: 4.5,
    fill: { color: COLORS.cream },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.1,
  });
  s.addText("부분 환불 계산식", {
    x: 7.6, y: 2.1, w: 5, h: 0.4,
    fontSize: 14, bold: true, color: COLORS.gold, fontFace: FONT_TITLE,
  });
  s.addText("환불 금액 = 결제 금액 × (남은 코인 수 ÷ 구매한 코인 수)", {
    x: 7.6, y: 2.6, w: 5, h: 0.9,
    fontSize: 13, color: COLORS.ink, fontFace: FONT_BODY, italic: true,
  });

  s.addShape(pres.ShapeType.line, {
    x: 7.6, y: 3.6, w: 4.9, h: 0,
    line: { color: COLORS.border, width: 1, dashType: "dash" },
  });

  s.addText("적용 예시", {
    x: 7.6, y: 3.8, w: 5, h: 0.4,
    fontSize: 12, bold: true, color: COLORS.gold, fontFace: FONT_BODY, charSpacing: 2,
  });
  s.addText([
    { text: "5코인 4,200원 구매 → 2코인 사용", options: { breakLine: true, bullet: { code: "25CF" } } },
    { text: "남은 3코인 환불 대상", options: { breakLine: true, bullet: { code: "25CF" } } },
    { text: "환불 금액 = 4,200 × (3 ÷ 5) = 2,520원", options: { breakLine: true, bullet: { code: "25CF" }, bold: true, color: COLORS.gold } },
  ], {
    x: 7.6, y: 4.2, w: 5, h: 2,
    fontSize: 12, color: COLORS.ink, fontFace: FONT_BODY,
    paraSpaceAfter: 4,
  });

  addFooter(s, 14, TOTAL);
}

// ---------- Slide 15: 환불 경로 ----------
addScreenSlide({
  pageNum: 15,
  title: "환불 요청 경로",
  subtitle: "Refund Flow",
  url: "https://gatch-saju.onato.co.kr/mypage",
  shotName: "15-mypage",
  description: [
    "마이페이지 → 지갑 섹션 내 \"환불 요청\" 링크",
    "클릭 시 프리필된 이메일 양식 자동 작성 (가입 이메일·이름 포함)",
    "고객센터 접수 후 /api/payments/cancel 호출",
    "Toss cancelPayment API로 부분·전액 환불 처리 → 결제 수단 원복",
  ],
});

// ---------- Slide 16: 고객센터 ----------
{
  const s = pres.addSlide();
  addTitle(s, "고객센터", "Customer Support");

  // 중앙 카드
  s.addShape(pres.ShapeType.roundRect, {
    x: 2, y: 2, w: 9.3, h: 4.5,
    fill: { color: COLORS.cream },
    line: { color: COLORS.gold, width: 2 },
    rectRadius: 0.15,
  });

  const items = [
    { k: "담당자",   v: "임승균" },
    { k: "전화",     v: "010-6889-8909" },
    { k: "이메일",   v: "lsk9105@gmail.com" },
    { k: "운영시간", v: "평일 10:00 ~ 18:00 (주말·공휴일 제외)" },
    { k: "답변 소요", v: "영업일 기준 1~2일 내 회신" },
  ];
  items.forEach((item, i) => {
    const y = 2.4 + i * 0.75;
    s.addText(item.k, {
      x: 2.4, y, w: 2, h: 0.5,
      fontSize: 14, bold: true, color: COLORS.gold, fontFace: FONT_BODY,
    });
    s.addText(item.v, {
      x: 4.6, y, w: 6.5, h: 0.5,
      fontSize: 16, color: COLORS.ink, fontFace: FONT_TITLE,
    });
  });

  s.addText("갓챠사주는 이용자 문의를 성실하게 응대하며, 결제·환불 관련 사항은\n영업일 기준 신속히 처리합니다.", {
    x: 1, y: 6.7, w: 11.3, h: 0.6,
    fontSize: 11, italic: true, color: COLORS.sub, align: "center", fontFace: FONT_BODY,
  });

  addFooter(s, 16, TOTAL);
}

// ---------- Write ----------
await pres.writeFile({ fileName: OUTPUT });
console.log(`✓ Generated: ${OUTPUT}`);
