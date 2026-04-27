// CDP(9222)로 기존 로그인된 크롬 세션에 붙어 로그인 페이지 전수 캡처.
// 사전 조건:
//   open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-profile
//   카카오 로그인 완료 + 캐릭터 1명 이상 + 결제 1회 + 감정 1건 완료 상태 권장.
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

const VIEWPORT = { width: 390, height: 844 };

// body overflow-hidden + 내부 스크롤 구조 때문에 fullPage 캡처가 viewport만
// 찍히는 이슈 회피용.
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

async function newPageWithViewport() {
  const page = await context.newPage();
  try {
    await page.setViewportSize(VIEWPORT);
  } catch {
    // CDP 크롬의 일부 탭 타입에서 resize 실패 가능, 무시
  }
  return page;
}

async function capture(name, url, { waitFor = 1500, fullPage = true, scroll = 0 } = {}) {
  const page = await newPageWithViewport();
  console.log(`→ ${name}: ${url}`);
  try {
    // networkidle은 일부 페이지(허브 등)에서 오래 걸려 timeout 유발.
    // load 시점 + 수동 waitFor 조합이 더 안정적.
    const res = await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    await page.waitForTimeout(waitFor);
    if (scroll > 0) {
      await page.evaluate((y) => {
        const el = document.querySelector("body > div:first-child");
        if (el) el.scrollTop = y;
        else window.scrollTo(0, y);
      }, scroll);
      await page.waitForTimeout(300);
    }
    if (fullPage) {
      await page.addStyleTag({ content: UNLOCK_SCROLL });
      // CDP 크롬에서는 addStyleTag `!important`가 오버라이드 못 하는 케이스가
      // 있어 인라인 스타일까지 강제 주입.
      await page.evaluate(() => {
        const force = "height:auto !important; min-height:0 !important; overflow:visible !important;";
        document.documentElement.style.cssText += force;
        document.body.style.cssText += force + "display:block !important;";
        const sc = document.querySelector("body > div:first-child");
        if (sc) {
          sc.style.cssText +=
            force + "flex:none !important; display:block !important;";
        }
      });
      await page.waitForTimeout(400);
    }
    const out = path.join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: out, fullPage });
    console.log(`  ✓ ${out} (status ${res?.status() ?? "?"}, final ${page.url()})`);
    return { page, ok: true };
  } catch (e) {
    console.error(`  × ${name} 실패: ${e.message}`);
    return { page, ok: false };
  }
}

// ---------- Phase 1: 파라미터 불필요 페이지 ----------

{
  const { page } = await capture("09-hub", `${BASE}/`);
  // 허브에서 첫 미해금/해금 캐릭터 id와 해금된 캐릭터 id 추출
  var characterIds = [];
  var unlockedCharacterId = null;
  var lockedCharacterId = null;
  try {
    const ids = await page.evaluate(() => {
      const lockedLinks = Array.from(
        document.querySelectorAll('a[href^="/reading/preview?characterId="]'),
      ).map((a) => a.getAttribute("href"));
      const unlockedLinks = Array.from(
        document.querySelectorAll('a[href^="/characters/"]'),
      )
        .map((a) => a.getAttribute("href"))
        .filter((h) => h && /^\/characters\/[0-9a-f-]{36}$/.test(h));
      return { lockedLinks, unlockedLinks };
    });
    const parseId = (href) => {
      const m = href?.match(/characterId=([0-9a-f-]{36})/) || href?.match(/\/characters\/([0-9a-f-]{36})/);
      return m ? m[1] : null;
    };
    lockedCharacterId = parseId(ids.lockedLinks[0]);
    unlockedCharacterId = parseId(ids.unlockedLinks[0]);
    characterIds = [lockedCharacterId, unlockedCharacterId].filter(Boolean);
    console.log(
      `  · 감지된 id — locked: ${lockedCharacterId ?? "-"} / unlocked: ${unlockedCharacterId ?? "-"}`,
    );
  } catch (e) {
    console.error(`  × 허브 DOM 파싱 실패: ${e.message}`);
  }
  await page.close();
}

await capture("10-characters-new", `${BASE}/characters/new`);
await capture("11-mypage", `${BASE}/mypage`);
await capture("12-coins", `${BASE}/coins`);
await capture(
  "13-coins-fail",
  `${BASE}/coins/fail?code=PAY_PROCESS_CANCELED&message=%EA%B2%B0%EC%A0%9C%EA%B0%80%20%EC%B7%A8%EC%86%8C%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4.`,
);
await capture("14-compatibility", `${BASE}/compatibility`);

// ---------- Phase 2: characterId 기반 ----------

const targetCid = unlockedCharacterId ?? lockedCharacterId;

if (lockedCharacterId) {
  await capture("15-reading-preview", `${BASE}/reading/preview?characterId=${lockedCharacterId}`);
} else {
  console.log("  ⚠ 미해금 캐릭터 없음 — 15-reading-preview 건너뜀");
}

if (targetCid) {
  await capture(
    "16-reading-new",
    `${BASE}/reading/new?characterId=${targetCid}&type=comprehensive`,
  );
  await capture("17-daily", `${BASE}/daily?characterId=${targetCid}`);
}

if (unlockedCharacterId) {
  await capture("18-character-detail", `${BASE}/characters/${unlockedCharacterId}`);
}

// ---------- Phase 3: reading id 기반 (해금된 사용자의 최신 감정) ----------

if (unlockedCharacterId) {
  const probe = await newPageWithViewport();
  try {
    await probe.goto(`${BASE}/characters/${unlockedCharacterId}`, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
    await probe.waitForTimeout(1200);
    const readingId = await probe.evaluate(() => {
      const anchors = Array.from(
        document.querySelectorAll('a[href^="/reading/"]'),
      ).map((a) => a.getAttribute("href"));
      const match = anchors.find((h) => /\/reading\/[0-9a-f-]{36}$/.test(h ?? ""));
      return match ? match.split("/").pop() : null;
    });
    console.log(`  · 최신 reading id: ${readingId ?? "-"}`);
    if (readingId) {
      await capture("19-reading-detail", `${BASE}/reading/${readingId}`);
      // generating 페이지는 status=pending일 때만 의미있음 — 캡처만 시도
      await capture("20-reading-generating", `${BASE}/reading/generating/${readingId}`, {
        waitFor: 2500,
      });
    }
  } catch (e) {
    console.error(`  × reading id 탐색 실패: ${e.message}`);
  } finally {
    await probe.close();
  }
}

// ---------- Phase 4: /coins/success 는 실결제 플로우 필요, 건너뜀 ----------
console.log(
  "\n⚠ /coins/success 는 실결제 승인 후에만 정상 표시됩니다. 수동 캡처 권장.",
);
console.log("⚠ /onboarding 은 이미 캐릭터가 있으면 / 로 리다이렉트됩니다.");
console.log("⚠ Toss 결제창(외부 SDK)은 약관상 자동 캡처 금지.");

console.log("\n완료. 크롬 창은 열어둔 채로 둡니다.");
process.exit(0);
