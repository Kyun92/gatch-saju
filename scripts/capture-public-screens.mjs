// 공개 페이지 전체 자동 캡처 (비로그인 접근 가능).
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
  { name: "01-landing", url: `${BASE}/landing`, waitFor: 2000, label: "랜딩" },
  { name: "02-login", url: `${BASE}/login`, waitFor: 1200, label: "로그인" },
  { name: "03-pricing", url: `${BASE}/pricing`, waitFor: 1200, label: "요금 안내" },
  { name: "04-terms", url: `${BASE}/terms`, waitFor: 1000, label: "이용약관" },
  { name: "05-privacy", url: `${BASE}/privacy`, waitFor: 1000, label: "개인정보처리방침" },
  { name: "06-refund", url: `${BASE}/refund`, waitFor: 1000, label: "환불정책" },
  { name: "07-contact", url: `${BASE}/contact`, waitFor: 1000, label: "고객센터" },
  {
    name: "08-not-found",
    url: `${BASE}/__does-not-exist-xyz__`,
    waitFor: 1000,
    label: "404 (not-found)",
  },
];

await fs.mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "ko-KR",
  timezoneId: "Asia/Seoul",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const results = [];

// 루트 layout에 body overflow-hidden + inner scroll 구조라
// fullPage가 viewport만 캡처됨. 스타일을 풀어 전체 콘텐츠 펼친 뒤 캡처.
const UNLOCK_SCROLL = `
  html, body {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  body > div:first-child {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    flex: none !important;
    display: block !important;
  }
`;

for (const { name, url, waitFor, label } of PAGES) {
  const page = await context.newPage();
  console.log(`→ ${name} (${label}): ${url}`);
  try {
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
    await page.waitForTimeout(waitFor);
    await page.addStyleTag({ content: UNLOCK_SCROLL });
    await page.waitForTimeout(200);
    const out = path.join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    const finalUrl = page.url();
    const status = response?.status() ?? 0;
    results.push({ name, label, finalUrl, status, ok: true });
    console.log(`  ✓ ${out}  (status ${status}, final ${finalUrl})`);
  } catch (e) {
    results.push({ name, label, error: e.message, ok: false });
    console.error(`  × 실패: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

console.log("\n===== 요약 =====");
for (const r of results) {
  console.log(
    r.ok
      ? `  ${r.name} (${r.label}) → ${r.status} · ${r.finalUrl}`
      : `  ${r.name} (${r.label}) · FAIL: ${r.error}`,
  );
}
