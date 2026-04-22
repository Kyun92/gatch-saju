// 로그인 세션이 유지되는 크롬(CDP)에 붙어 로그인 필요 페이지를 캡처.
// 사전 조건:
//   open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-profile
//   해당 크롬 창에서 카카오 로그인 완료 + 캐릭터 1개 이상 생성된 상태
// Usage: node scripts/capture-logged-in-screens.mjs

import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, "..", "docs", "screenshots");
const BASE = "https://gatch-saju.onato.co.kr";
const CDP_ENDPOINT = "http://localhost:9222";

// 캡처 대상 — Toss 결제창(10)과 감정 결과(13)는 현 세션에서 유효한 상태가 필요해 선택적
const TARGETS = [
  {
    name: "08-hub",
    url: `${BASE}/`,
    description: "허브 페이지 (잔액 배지 포함)",
    waitFor: 1500,
  },
  {
    name: "09-coins",
    url: `${BASE}/coins`,
    description: "지갑 — 4개 코인 패키지",
    waitFor: 1500,
  },
  {
    name: "12-coins-fail",
    url: `${BASE}/coins/fail?code=PAY_PROCESS_CANCELED&message=%EA%B2%B0%EC%A0%9C%EA%B0%80%20%EC%B7%A8%EC%86%8C%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4.`,
    description: "결제 실패 화면 (쿼리로 시뮬)",
    waitFor: 1000,
  },
  {
    name: "15-mypage",
    url: `${BASE}/mypage`,
    description: "마이페이지 — 지갑 섹션 + 환불 요청",
    waitFor: 1500,
  },
];

await fs.mkdir(OUT_DIR, { recursive: true });

console.log(`CDP 연결 시도: ${CDP_ENDPOINT}`);
const browser = await chromium.connectOverCDP(CDP_ENDPOINT);

const contexts = browser.contexts();
if (contexts.length === 0) {
  console.error("연결된 컨텍스트가 없습니다. 크롬 창이 열려있는지 확인.");
  process.exit(1);
}
const context = contexts[0];
console.log(`✓ 연결 성공 (기존 탭 ${context.pages().length}개)`);

// CDP 세션은 기존 크롬 프로파일 그대로라 viewport를 바꿀 수 없음.
// 대신 각 페이지마다 뷰포트를 모바일 크기로 resize.
async function capture(target) {
  const page = await context.newPage();
  console.log(`→ ${target.name}: ${target.url}`);
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(target.url, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(target.waitFor);
    const out = path.join(OUT_DIR, `${target.name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`  ✓ ${out}`);
  } catch (e) {
    console.error(`  × ${target.name} 실패: ${e.message}`);
  } finally {
    await page.close();
  }
}

for (const target of TARGETS) {
  await capture(target);
}

// CDP 연결은 닫지 않음 — 사용자 크롬 세션 유지
console.log("\n완료. 크롬 창은 열어둔 채로 둡니다.");
process.exit(0);
