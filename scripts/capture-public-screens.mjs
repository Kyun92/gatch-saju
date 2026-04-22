// 공개 페이지 자동 캡처 (비로그인 접근 가능).
// Usage: node scripts/capture-public-screens.mjs

import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, "..", "docs", "screenshots");

const BASE = "https://gatch-saju.onato.co.kr";

const PAGES = [
  { name: "05-landing", url: `${BASE}/landing`, waitFor: 2000 },
  { name: "06-pricing", url: `${BASE}/pricing`, waitFor: 1200 },
  { name: "07-login", url: `${BASE}/login`, waitFor: 1200 },
];

await fs.mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  // 앱이 모바일 퍼스트 UI (max-w-md)라 iPhone 14 뷰포트로 캡처.
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "ko-KR",
  timezoneId: "Asia/Seoul",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

for (const { name, url, waitFor } of PAGES) {
  const page = await context.newPage();
  console.log(`→ ${name}: ${url}`);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(waitFor);
    const out = path.join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`  ✓ ${out}`);
  } catch (e) {
    console.error(`  × 실패: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("\n완료.");
