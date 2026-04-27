# 갓챠사주 — 프로토타입 리뷰 문서 (화면 전수 + 유저 Flow)

> **목적**: 서비스 전체 화면·동선을 외부 AI/리뷰어가 평가할 수 있도록 최대한 세부 수준으로 정리한 문서.
>
> **대상 환경**: 프로덕션 `https://gatch-saju.onato.co.kr`
>
> **작성일**: 2026-04-22
>
> **핵심 개념**: 사주팔자·자미두수·서양점성술 3체계 교차분석 + 1계정 N캐릭터 + 코인 지갑 결제(4단계 차등할인) + 모바일 퍼스트 픽셀 RPG UI.

---

## 0. 한눈에 보는 아키텍처

| 영역 | 스택 |
|------|------|
| Framework | Next.js 16 (App Router, RSC, Turbopack) |
| Language | TypeScript strict |
| UI | Tailwind v4 + 픽셀 RPG 커스텀 테마 (라이트) |
| Auth | NextAuth v5 (카카오 OAuth, 네이버·구글은 "준비 중" 비활성) |
| DB | Supabase PostgreSQL (Auth 미사용, DB만) |
| AI | Gemini 3.1 Pro (종합감정 · 년운 · 궁합 · 카테고리) + 2.5 Flash (일일운세 · 스탯) |
| 결제 | Toss Payments (코인 패키지 4종: 1/3/5/10코인, 최대 -20%) |
| 사주 엔진 | lunar-javascript · iztro · circular-natal-horoscope-js |
| 호스팅 | Vercel + 커스텀 도메인(CNAME on 가비아) |

### 브랜드 톤
- 서비스명: **갓챠사주** (영문 slug `gatcha-saju`)
- 부제: "운명의 RPG 사주풀이"
- 영문 태그라인: "ARCADE FORTUNE CABINET"
- 색상: 골드 `#9a7040` · 크림 `#f5f0e8` · 잉크 `#2c2418`
- 폰트: 제목 NeoDungGeunMo(픽셀) / 본문 Noto Sans KR / 감정결과 RIDIBatang
- 오행 색상: 목 `#2e8b4e` 화 `#d04040` 토 `#a87838` 금 `#6878a0` 수 `#3070c0`

---

## 1. 화면 인벤토리

### 1.1 캡처 완료 (19장)

모바일 뷰포트 `390×844`, `deviceScaleFactor 2`, fullPage. `docs/screenshots/` 저장.

| # | 파일 | 경로 | 인증 | 높이 | 역할 |
|---|------|------|------|------|------|
| 01 | `01-landing.png` | `/landing` | ✗ | 1932 | 비로그인 진입점, 가챠 머신 히어로 + "INSERT COIN" CTA |
| 02 | `02-login.png` | `/login` | ✗ | 1932 | 카카오 활성, 네이버·구글 비활성 |
| 03 | `03-pricing.png` | `/pricing` | ✗ | 2074 | 4개 코인 패키지 + 결제·환불 안내 |
| 04 | `04-terms.png` | `/terms` | ✗ | 6884 | 이용약관 11조 |
| 05 | `05-privacy.png` | `/privacy` | ✗ | 7236 | 개인정보처리방침 + 처리위탁 표 |
| 06 | `06-refund.png` | `/refund` | ✗ | 5486 | 환불정책 7일·부분환불 공식 |
| 07 | `07-contact.png` | `/contact` | ✗ | 3650 | 고객센터 + 운영주체 표 + FAQ 7 |
| 08 | `08-not-found.png` | `/존재X` | ✗ | 1932 | **실제로는 /landing 리다이렉트** |
| 09 | `09-hub.png` | `/` | ✓ | 1637 | 허브 · 잔액 배지 · 캐릭터 슬롯 |
| 10 | `10-characters-new.png` | `/characters/new` | ✓ | 1014 | 새 캐릭터 추가 폼 |
| 11 | `11-mypage.png` | `/mypage` | ✓ | 1445 | 지갑·환불·내 명부·로그아웃 |
| 12 | `12-coins.png` | `/coins` | ✓ | 1014 | 지갑 · 4패키지 · 실결제 |
| 13 | `13-coins-fail.png` | `/coins/fail?code=...` | ✓ | 845 | 결제 실패 안내 |
| 14 | `14-compatibility.png` | `/compatibility` | ✓ | 1014 | 궁합 — 캐릭터 2명 선택 |
| 16 | `16-reading-new.png` | `/reading/new?cid=&type=` | ✓ | 1014 | 감정 상품 확인 + 뽑기 |
| 17 | `17-daily.png` | `/daily?cid=` | ✓ | 2055 | 일일운세 + 월별 캘린더 |
| 18 | `18-character-detail.png` | `/characters/[id]` | ✓ | 1014 | 캐릭터 스킬트리 |
| 19 | `19-reading-detail.png` | `/reading/[id]` | ✓ | 1783 | 종합감정 결과 HTML 12섹션 |
| 20 | `20-reading-generating.png` | `/reading/generating/[id]` | ✓ | 1014 | 가챠머신 로딩 + 팁카드 |

### 1.2 미캡처 — 자동화 불가

| # | 경로 | 사유 | 대체 방법 |
|---|------|------|----------|
| 15 | `/reading/preview?cid=` (미해금) | 현재 테스트 계정은 **캐릭터가 이미 해금됨** → preview가 `/characters/[id]`로 redirect | 새 테스트 계정으로 캐릭터 1명 생성 직후 접근 |
| 21 | `/coins/success` | `paymentKey` + `orderId` + `amount` + `packageId` 쿼리 전부 필요. Toss 서명된 키라 위조 불가 | 실결제 1회 수행 후 수동 캡처 |
| 22 | Toss 결제창 | 외부 SDK 팝업. 약관·iframe 보안상 자동 캡처 금지 | 실결제 중 브라우저 스크린샷 |
| 23 | `/onboarding` | 로그인 + 캐릭터 0명일 때만 진입. 캐릭터 있으면 `/`로 강제 | 신규 테스트 계정으로 최초 진입 시 캡처 |

---

## 2. 상세 화면 카드 (리뷰 포인트 포함)

각 화면에 대해 **목적 · UI 요소 · 인터랙션 · 백엔드 효과 · 엣지케이스 · 리뷰 포인트**를 정리.

### 2.1 `/landing` — 비로그인 진입점

- **파일**: `src/app/landing/page.tsx` (client)
- **스크린샷**: `01-landing.png`
- **목적**: 서비스를 모르고 들어온 방문자에게 컨셉을 1초 안에 전달, 가장 굵은 CTA로 로그인 진입.
- **UI 요소**:
  - 상단: 로고 (`/logo-2x.png`) + 태그라인 `ARCADE FORTUNE CABINET`
  - 중앙: `GachaHero` 컴포넌트 (가챠 머신 SVG + 헤드라인 "새 캡슐이 네 운명을 알려주지" + 4운명학 요약)
  - 하단: `InsertCoinCTA` ("지금 가챠 돌리기" 버튼 + "한 판 990원부터 · 묶음 살수록 할인") + `요금 안내` 링크
  - 배경: 크림톤 + 오행 색상의 radial-gradient overlay + PixelStarfield 반짝이 애니메이션
  - Footer: 법문서 4링크 + 사업자정보(온아토·607-29-96690·주소·010-6889-8909·이메일)
- **인터랙션**:
  - `InsertCoinCTA` 클릭 → `LoginModal` 열림
  - "요금 안내" 클릭 → `/pricing`
  - Footer 법문서 클릭 → `/terms` · `/privacy` · `/refund` · `/contact`
- **리뷰 포인트**:
  - 모바일 기준 가챠 머신이 중앙에 배치되어 시각적 후킹 효과
  - "한 판 990원" 문구가 가격 정보를 우선 제시 — 심사관·신규 방문자에게 안심감
  - 이모지 일절 없음 (디자인 일관성)

### 2.2 `/login` — 로그인

- **파일**: `src/app/login/page.tsx` (client)
- **스크린샷**: `02-login.png`
- **UI 요소**:
  - 상단: 로고 이미지 + 부제 "네 운명, 한 판 뽑아봐" + `TriSystemSymbol` (사주·자미·점성 3원 교차 · 중심에 命) + "사주 × 자미두수 × 서양점성술"
  - 중앙: `PixelFrame` accent 카드 내부
    - 카카오 버튼 (노란색 `#FEE500`, 활성)
    - 네이버 버튼 (`준비 중` 비활성, 반투명)
    - 구글 버튼 (`준비 중` 비활성, 반투명)
  - 하단: "다음 캡슐엔 뭐가 들었을까" 점멸 텍스트
- **인터랙션**:
  - 카카오 클릭 → NextAuth `signIn("kakao", { callbackUrl: "/daily" })` → 카카오 OAuth → 콜백 → 미들웨어가 DB 확인 → 캐릭터 0명 `/onboarding` / 있음 `/`
  - 비활성 버튼 클릭 → 아무 동작 없음(disabled)
- **백엔드**: `users` + `accounts` 테이블에 OAuth profile 저장. JWT에는 `userId`만.
- **리뷰 포인트**:
  - OAuth 단일 제공자 전략: 카카오만 우선 활성 → Toss 심사 복잡도 최소화
  - 비활성 버튼도 완전 제거 대신 "준비 중"으로 노출해 향후 확장 예고

### 2.3 `/pricing` — 비로그인 요금 안내

- **파일**: `src/app/pricing/page.tsx` (server)
- **스크린샷**: `03-pricing.png`
- **목적**: Toss 심사관이 로그인 없이 상품·가격 확인 가능하도록 공개.
- **접근 제어**: 미들웨어 STATIC_PATHS에 포함. 로그인 시 `/coins`로 redirect.
- **UI 요소**:
  - 상단 헤더: `← 홈` · 중앙 "요금 안내" · `로그인`
  - 타이틀: "코인 패키지"
  - 4개 패키지 카드 (수량·라벨·개당가·정가·할인뱃지)
    - 1코인 / 990원 / 개당 990원 / 할인 없음
    - 3코인 / 2,700원 / 개당 900원 / **-9%**
    - 5코인 / 4,200원 / 개당 840원 / **-15%**
    - 10코인 / 7,900원 / 개당 790원 / **-20%**
  - CTA: "로그인하고 충전하기" → `/login`
  - 결제·환불 안내 박스 (토스페이먼츠 · 유효기간 없음 · 7일 환불)
  - 하단: `문의: 010-6889-8909 · lsk9105@gmail.com`
- **리뷰 포인트**:
  - 심사관 대응용 "비로그인 상품 공개" 페이지. 일반 유저는 `/coins`로 자동 우회.
  - 할인율 시각적 대비 강조 (빨간 뱃지)

### 2.4 `/terms`, `/privacy`, `/refund`, `/contact` — 법문서 4종

- **파일**: `src/app/(legal)/*/page.tsx` (server)
- **스크린샷**: `04~07`
- **공통 레이아웃**: `(legal)/layout.tsx` — 헤더(로고·"약관 및 정책") + 중앙 카드(`max-w-2xl`) + Footer
- **내용 요약**:
  - **terms**: 제1~11조 + 부칙. 제6조 유료 서비스는 "코인 결제" 기준, 제7조 청약철회는 7일 미사용분 환불 + 부분환불 규정.
  - **privacy**: 수집항목(OAuth 프로필 + 생년월일시 + 출생지 + MBTI + 결제정보) · 처리위탁 표(Toss·Supabase·Vercel·Google·카카오) · DPO(임승균 · 010-6889-8909) · 침해 신고센터 링크.
  - **refund**: 7일 환불 정책 · 부분환불 공식 (`환불금액 = 결제금액 × 남은코인/구매코인`) · 절차 · 미성년자 조항.
  - **contact**: 연락처 callout + 운영주체 표 + FAQ 7문항 (결제·환불·캐릭터·시각 미상·계정 삭제·결과 저장·개인정보).
- **리뷰 포인트**:
  - 전자상거래법 제17조 제2항 제5호 명시적 인용으로 법적 정합성 확보
  - "AI" 단어 미노출 (사용자 요구: 해석 원리 비노출)
  - `CUSTOMER_SUPPORT` 상수 중앙화 → 번호 교체 시 1곳 수정으로 전역 반영

### 2.5 `/` — 허브 (로그인 기본 진입)

- **파일**: `src/app/page.tsx` (server)
- **스크린샷**: `09-hub.png`
- **목적**: 로그인 유저가 자신의 캐릭터들을 한눈에 보고 행동을 고를 수 있는 대시보드.
- **UI 요소**:
  - `HubHeader`: 로고(왼쪽) · **잔액 배지 `✮ N`**(`/coins` 링크) · 유저명(마이페이지 링크)
  - 섹션 타이틀: "갓챠 도감" + `CollectionCounter` (보유 캐릭터 수)
  - 캐릭터 슬롯 목록 (`CharacterSlot`):
    - 해금 캐릭터: 오행 배경색 + 아바타 + Lv·이름·간지·칭호·MBTI + 6스탯 미니바 + `오늘의 운세` + `심화 특성` 버튼
    - 미해금 캐릭터: 회색톤 + `운명 열기 · 코인 1` CTA (→ `/reading/preview`)
  - "가족·친구 추가" CTA (→ `/characters/new`)
  - `TrustBadge`: 3체계 심볼 + "정통 운명학 3체계 교차분석" 문구
- **리뷰 포인트**:
  - 잔액 배지가 헤더에 상시 노출 → 결제 시도 전 잔액 인지 가능 (retention 개선 포인트)
  - 미해금/해금 상태를 색상·흐림으로 즉시 구분
  - RPG 게임 "캐릭터 선택 화면" 메타포로 사용자 친근감

### 2.6 `/onboarding` — 캐릭터 생성 마법사 (신규)

- **파일**: `src/app/onboarding/page.tsx` (client, server action 호출)
- **스크린샷**: **캡처 불가** (현재 테스트 계정은 이미 캐릭터 있음 → `/`로 리다이렉트)
- **언제 보이나**: 로그인 + `characters` 테이블에 해당 user_id 행 0개일 때만.
- **UI 플로우**: 단일 페이지에 3스텝 progressive disclosure
  1. 이름 입력
  2. 생년월일 + 출생시각(PixelSelect 년/월/일/시/분) + "모름" 옵션
  3. 출생지(전국 주요 도시 dropdown) + 성별 + MBTI(선택)
- **Submit 동작**:
  1. `createCharacter` server action
  2. `characters` INSERT (unlocked=false, is_self=true 기본)
  3. `generateAllCharts` 동기 호출 → `charts` 테이블에 saju/ziwei/western 3행 저장
  4. `generateFreeStatScores` 호출 (Gemini 2.5 Flash, JSON mode) → free_stat_scores + free_summary 업데이트
  5. 성공 시 `/`로 이동
- **백엔드**: 약 1~2초 소요 (Flash 모델). 실패 시 non-blocking (자유 스탯 없이도 캐릭터 생성됨)
- **엣지케이스**: users 테이블에 해당 userId 없으면 FK 위반 → "세션 만료" 에러 → 재로그인 유도

### 2.7 `/characters/new` — 추가 캐릭터 생성

- **파일**: `src/app/(main)/characters/new/page.tsx`
- **스크린샷**: `10-characters-new.png`
- **구성**: `/onboarding`과 유사하되 `is_self=false` 기본값, "가족/지인의 생년월일시 입력" 컨텍스트.
- **진입**: 허브 "+ 가족·친구 추가" 링크 / 마이페이지 동일 링크.
- **리뷰 포인트**: 본인 캐릭터는 is_self=true로 삭제 불가, 타인 캐릭터는 삭제 가능 (`src/app/(main)/characters/[id]/actions.ts`)

### 2.8 `/characters/[id]` — 캐릭터 상세 · 스킬트리

- **파일**: `src/app/(main)/characters/[id]/page.tsx` (server)
- **스크린샷**: `18-character-detail.png`
- **UI 요소**:
  - 상단: 오행 배경 `CharacterHero` (아바타·Lv·일간+클래스·칭호·MBTI)
  - `CharacterActions`: 이름·MBTI 편집 · is_self=false면 삭제 버튼
  - `SkillTree` 그리드 (8노드):
    - 루트(넓이 full): **종합감정** — 미해금이면 "구매 가능 `✮ 1`" / 해금이면 `CLEAR` 뱃지
    - 2×4 서브 그리드: 년운·연애운·직업운·금전운·건강운·학업운·궁합
    - 각 노드 3상태: `locked`(잠김) · `available`(구매 가능) · `purchased`(CLEAR)
    - `available` 노드 클릭 → `/reading/new?characterId=&type=`
    - `purchased` 노드 클릭 → `/reading/{id}` (결과 재열람)
- **접근 제어**: 미해금 캐릭터 접근 시에도 스킬트리 표시되지만 모든 서브 노드가 locked 상태.

### 2.9 `/reading/preview?characterId=` — 종합 미리보기 (미해금 전용)

- **파일**: `src/app/(main)/reading/preview/page.tsx` (server)
- **스크린샷**: 현재 상황 미캡처
- **언제 보이나**: 로그인 + `characters.unlocked=false` 인 캐릭터. 해금되면 `/characters/{id}`로 redirect.
- **UI 요소**:
  - `CharacterHero` (element 기반 아바타)
  - `StatGrid` — free_stat_scores 6종 + 칭호
  - `free_summary` 카드 (Flash가 생성한 한줄 요약)
  - **블러된 7개 섹션 placeholder** (사주원국 분석·오행균형·일주 심층·성격·직업재물·연애·건강개운법) → 잠재력 미리보기
  - 하단: `GachaCapsuleSvg` + `PullCapsuleButton` (직접 뽑기)
- **뽑기 버튼 클릭 플로우**:
  - POST `/api/reading/generate { characterId, type: "comprehensive" }`
  - 402 insufficient_balance → `router.push("/coins?returnTo=/reading/preview?characterId=X")`
  - 200 readingId → `router.push("/reading/generating/{readingId}")`
- **리뷰 포인트**:
  - 잠재력 teaser(블러) + 즉시 뽑기 버튼의 조합으로 구매 유도력 극대화
  - retention 핵심: `returnTo` 쿼리로 충전 후 자동 복귀 → 홈 리셋 방지

### 2.10 `/reading/new?characterId=&type=` — 감정 상품 확인

- **파일**: `src/app/(main)/reading/new/page.tsx` (client)
- **스크린샷**: `16-reading-new.png`
- **언제 보이나**: 스킬트리에서 추가 상품(년운·궁합·카테고리) 클릭 시. (comprehensive는 preview 경유)
- **UI 요소**:
  - 상단: `READING_CONFIG[type]` 기반 타이틀·서브타이틀
  - 캡슐 SVG + mockKeywords 3개 (예: "잠재력 S등급", "전체 운세 요약")
  - 블러된 가짜 감정 본문 (paywall 유도)
  - 하단 `PixelFrame` 카드: features 리스트 + 뽑기 버튼 + "잔액이 부족하면 충전 페이지로 이동합니다"
- **뽑기 동작**: preview와 동일 (`/api/reading/generate` → 402 또는 200 → generating)

### 2.11 `/reading/generating/[id]` — 생성 중 (가챠머신)

- **파일**: `src/app/(main)/reading/generating/[id]/page.tsx` (client)
- **스크린샷**: `20-reading-generating.png`
- **UI 요소**:
  - 전체화면 배경 크림톤
  - `GachaMachine` SVG (흔들림 애니메이션 + 돔 안 캡슐 4개 바운스)
  - 단계별 메시지 (AnimatePresence 페이드 전환):
    - 0~20%: "사주팔자의 기둥을 세우는 중..."
    - 20~45%: "자미두수 12궁에 별을 배치하는 중..."
    - 45~70%: "서양 점성술 차트를 계산하는 중..."
    - 70~95%: "세 체계를 교차 해석하는 중..."
  - `LoadingProgress`: 진행바 + 4단계 체크리스트 + 경과/예상 시간 (예상 02:00)
  - `FortuneTipCard`: 8초마다 개인화/일반 팁 로테이션 (분석 대상·첫인상·MBTI·사주상식·자미·점성)
  - 하단 안내: "감정에는 평균 1~2분 소요돼요. 창을 닫아도 생성은 계속됩니다."
- **폴링**: 3초 간격 `GET /api/reading/status/[id]` → status complete/error 확인
- **완료 전환**: status=complete 시 `GachaCapsuleOpen` 애니메이션 → `/reading/[id]` 이동
- **에러**: status=error → 에러 메시지 + 홈 버튼
- **리뷰 포인트**:
  - 1~2분이라는 긴 대기를 **개인화 팁카드 + 단계별 메시지**로 체감 시간 단축
  - "창 닫아도 생성 계속" 안내로 이탈 걱정 완화

### 2.12 `/reading/[id]` — 감정 결과

- **파일**: `src/app/(main)/reading/[id]/page.tsx` (server)
- **스크린샷**: `19-reading-detail.png`
- **UI 구성 (type별 분기)**:
  - **comprehensive**: 12섹션 HTML (본질·성격·오행균형·대운·직업재물·연애·건강 등) + 스탯시트
  - **yearly**: 7섹션 (`YearlyReadingView`) — 년운 요약·직업·재물·연애·건강·12월운·개운법
  - **compatibility**: `CompatibilityAccordion` — 두 사람 VS 레이아웃 + 오행 상생상극 + 연애/결혼/사업 점수
  - **love/career/wealth/health/study**: 4섹션 `CategoryReadingView`
  - **daily**: 별도 `/daily` 경로 (여기로 오지 않음)
- **보안**: 서버에서 DOMPurify sanitizeReadingHtml 후 렌더 (XSS 방어)
- **접근 제어**: `readings.character_id`의 소유자만 접근

### 2.13 `/coins` — 지갑 (실결제)

- **파일**: `src/app/(main)/coins/page.tsx` (server) + `CoinsClient.tsx` (client)
- **스크린샷**: `12-coins.png`
- **UI 요소**:
  - `WALLET` 배지 + 잔액 `✮ N` + "코인" 라벨
  - 타이틀: "코인 충전"
  - (returnTo 있으면) TIP 배너: "충전이 끝나면 원래 뽑으려던 곳으로 바로 돌아갑니다"
  - 4개 패키지 카드 — 각 카드 클릭 → Toss SDK `requestPayment`
  - 하단 안내: 결제 즉시 반영 · 7일 환불 · 유효기간 없음
- **결제 호출 파라미터**:
  - `customerKey`: `session.user.userId` (심사 추적용)
  - `orderId`: `COIN_{timestamp}_{random}`
  - `amount`: `pkg.price` (클라이언트 조작 방어 위해 서버 재검증)
  - `orderName`: `갓챠사주 코인 N개`
  - `successUrl`: `/coins/success?packageId=&returnTo=`
  - `failUrl`: `/coins/fail`
- **리뷰 포인트**:
  - returnTo 전파로 "지갑 ↔ 뽑기" 왕복 편의 극대화
  - Toss customerKey가 익명이 아닌 실 userId → 분쟁 시 추적 가능

### 2.14 `/coins/success` — 충전 완료

- **파일**: `src/app/(main)/coins/success/page.tsx` (client)
- **스크린샷**: 미캡처 (실결제 필요)
- **UI 요소**:
  - 초기: `CoinSvg` 회전 + "충전 확인 중..."
  - 완료: `CHARGE COMPLETE` + `+N` 큰 숫자 + 현재 잔액 카드 + CTA
  - returnTo 있음: "뽑으러 가기" (주 CTA) / "허브로 가기" (보조)
  - returnTo 없음: "캐릭터 선택하러 가기" / "마이페이지"
- **API 흐름**: `POST /api/payments/confirm { paymentKey, orderId, amount, packageId }`
  1. Toss `confirmPayment` 호출 → status DONE 확인
  2. `payment_log` INSERT (user_id, paymentKey, orderId, amount, method, approvedAt, coin_quantity, package_id)
  3. `adjust_user_coins(userId, +quantity)` RPC (atomic, 음수 방지)
  4. `coin_transactions` INSERT (delta=+N, reason=purchase, payment_log_id)
- **이전 레버 연출 제거**: 사용자 피드백("충전이 곧 뽑기와 혼동됨")으로 GachaLeverPull 제거, 간단한 확인 화면.

### 2.15 `/coins/fail` — 결제 실패

- **파일**: `src/app/(main)/coins/fail/page.tsx` (client)
- **스크린샷**: `13-coins-fail.png`
- **UI 요소**: `X` 큰 글자 + "결제 실패" + 에러 메시지 + 오류 코드 + "다시 시도" → `/coins` · "홈으로" · Footer
- **Toss 에러 코드 매핑**: `PAY_PROCESS_CANCELED`, `PAY_PROCESS_ABORTED`, `REJECT_CARD_COMPANY`, `USER_CANCEL` → 친절한 한국어 메시지

### 2.16 `/mypage` — 마이페이지

- **파일**: `src/app/(main)/mypage/page.tsx` (server)
- **스크린샷**: `11-mypage.png`
- **UI 요소**:
  - 계정 정보 카드 (프로필이미지·이름·이메일·가입일)
  - **지갑 섹션** (`WALLET` 배지 · 잔액 · "충전하기" 링크 · "환불 요청" mailto 링크)
  - 내 명부 (보유 캐릭터 `MyPageCharacterCard` 목록 + "가족·친구 추가")
  - 로그아웃 버튼
- **환불 mailto 링크**: 가입 이메일·이름·주문번호 공란·사유 공란이 자동 프리필된 이메일 양식.
- **사업자 정보**: Footer가 전역이라 마이페이지에는 중복 노출 안 함.

### 2.17 `/daily?characterId=` — 일일운세

- **파일**: `src/app/(main)/daily/page.tsx` (server) + `DailyFortuneClient.tsx`
- **스크린샷**: `17-daily.png`
- **UI 요소**:
  - 헤더: "오늘의 퀘스트" + 캐릭터명·MBTI
  - 오늘 결과 있음: 결과 카드 (칭호·운세 본문·행운 아이템 그리드)
  - 오늘 결과 없음: "오늘의 운세가 아직 열리지 않았습니다" + "오늘의 운세를 확인하세요" 버튼 → 생성 시작 시 전체화면 오버레이(GachaMachine + 메시지 페이드 + FortuneTipCard) → 완료 시 페이지 새로고침
  - 하단: `DailyCalendar` (월별 점수 컬러블록) + `UpsellBanner` ("3체계 교차분석 캡슐 · 코인 1개" → `/reading/new`)
- **백엔드**: `GET /api/daily?characterId=` → Gemini Flash + 오늘의 천간지지(`getTodayGanZhi()`) + 캐릭터 차트 요약 → `[SCORE:XX]` 태그에서 점수 추출 → readings INSERT (type=daily, status=complete, stat_scores={daily_score, lucky_items})
- **비용**: 무료, 코인 차감 없음
- **리뷰 포인트**: 캘린더 컬러블록으로 과거 점수 시각화 — 일일 재방문 유도

### 2.18 `/compatibility` — 궁합 분석

- **파일**: `src/app/(main)/compatibility/page.tsx` (server) + `CompatibilitySelector.tsx` (client)
- **스크린샷**: `14-compatibility.png`
- **UI 요소**:
  - 해금 캐릭터 2명 이상 없으면: "캐릭터 2명 이상 해금 필요" 안내 + 홈 버튼
  - 있으면: 2개 drop-down (A 선택 · B 선택) · 동일 캐릭터 제한 · "궁합 분석하기 — 코인 1개" 버튼
- **뽑기 동작**: `POST /api/reading/generate { characterId, characterId2, type: "compatibility" }` → 402 → `/coins?returnTo=/compatibility` / 200 → `/reading/generating/{id}`
- **결과**: `readings.character_id_2`에 두 번째 캐릭터 저장, 결과는 VS 레이아웃으로 표시

### 2.19 `error.tsx` · `not-found.tsx` · `global-error.tsx`

- **error.tsx** (`src/app/error.tsx`): 런타임 에러 시 PixelFrame 카드 + `!` 심볼 + "예상치 못한 오류" + 에러 digest + "다시 시도"(reset) · "홈으로" 링크
- **not-found.tsx**: 404 전용. `404` 큰 글자 + "캡슐을 찾을 수 없어요" + 홈 CTA + 고객센터 링크
- **global-error.tsx**: 루트 layout 자체가 실패한 최후 fallback. 자체 `<html><body>` + 최소 스타일 + 재시도 버튼
- **접근 한계**: 비로그인 상태에서 존재하지 않는 URL은 미들웨어가 `/landing`으로 먼저 리다이렉트 → not-found.tsx는 **로그인 사용자에게만** 노출.

---

## 3. 유저 Flow (스토리보드)

### 3.1 비로그인 첫 방문 Flow

```
 유저 (첫 방문)
   ↓
 /landing  [01]
   │  ├─ "지금 가챠 돌리기" 클릭 → LoginModal 열림 → 카카오 버튼
   │  ├─ "요금 안내" 클릭 → /pricing [03]
   │  └─ Footer 법문서 클릭 → /terms·privacy·refund·contact [04~07]
   ↓ 카카오 OAuth 성공
 (미들웨어: users 존재 + characters.count)
   ├─ 신규: /onboarding [미캡처, 23]
   │         → createCharacter server action (차트 3종 + free stats 생성)
   │         → /
   └─ 복귀: / [09]
```

### 3.2 첫 뽑기 Flow (핵심 결제)

```
 / [09] 허브 (잔액 ✮ 0, 캐릭터 1명 미해금)
   ↓ "운명 열기 · 코인 1" 클릭
 /reading/preview?characterId=X [15, 미캡처]
   │  free stats + free_summary + 블러 7섹션
   ↓ "운명 캡슐 뽑기 — 코인 1개" 클릭
 POST /api/reading/generate
   ↓ 402 insufficient_balance
 /coins?returnTo=/reading/preview?characterId=X [12]
   │  TIP 배너 "충전이 끝나면 원래 뽑으려던 곳으로 복귀"
   ↓ "5코인 4,200원" 클릭 (-15%)
 Toss SDK 결제창 [22, 외부]
   ↓ 테스트카드 승인
 /coins/success?paymentKey=&orderId=&amount=&packageId=coin_5&returnTo=... [21, 미캡처]
   │  POST /api/payments/confirm
   │    → payment_log INSERT
   │    → adjust_user_coins(+5) (RPC)
   │    → coin_transactions INSERT (delta=+5, reason=purchase)
   │  "뽑으러 가기" 클릭
   ↓
 /reading/preview?characterId=X [15]  (returnTo 복귀)
   ↓ "뽑기" 재클릭 (잔액 5)
 POST /api/reading/generate
   │  트랜잭션:
   │    adjust_user_coins(-1) (atomic, 음수 차단)
   │    coin_transactions INSERT (delta=-1, reason=spend)
   │    readings INSERT (status=pending, coin_transaction_id)
   │  (실패 시 +1 롤백 + coin_transactions 삭제)
   │  백그라운드에서 executeReadingGeneration (Gemini Pro 1~2분)
   ↓ readingId 반환
 /reading/generating/{id} [20]
   │  3초마다 GET /api/reading/status/{id} 폴링
   │  가챠머신 + 팁카드 + 진행도
   ↓ status=complete
 GachaCapsuleOpen 연출 → /reading/{id} [19]
   │  첫 comprehensive 완료 시 characters.unlocked=true 플래그
   └  12섹션 HTML 결과
```

### 3.3 재방문 / 추가 상품 Flow

```
 / [09] 허브 (해금 캐릭터 존재)
   ├─ "오늘의 운세" 클릭
   │    → /daily?characterId=X [17]
   │    → "오늘의 운세를 확인하세요" → GET /api/daily (무료) → 풀스크린 가챠 오버레이
   │    → readings INSERT(type=daily) → 결과 카드 + 캘린더
   │
   └─ "심화 특성" 클릭
        → /characters/[id] [18] (스킬트리)
        ├─ 년운/카테고리 노드 클릭 → /reading/new?type= [16]
        │    → "뽑기" → 3.2의 결제 플로우와 동일 흐름
        └─ 궁합 노드 클릭 → /compatibility [14]
             → 캐릭터 2명 선택 → "궁합 분석하기 — 코인 1개" → 결제 플로우
```

### 3.4 환불 Flow

```
 /mypage [11]
   ↓ 지갑 섹션 "환불 요청" 링크
 mailto:lsk9105@gmail.com?subject=&body= (프리필)
   ↓ 고객센터 수동 응대 (영업일 1~3일)
 관리자 POST /api/payments/cancel { paymentKey, reason }
   │  1. payment_log 조회 (user_id·status=success·approved_at)
   │  2. 결제일 7일 내 확인
   │  3. 해당 결제 이후 spend+refund 합계 계산
   │  4. refundable = purchased - used
   │  5. actualRefund = min(refundable, users.coins)
   │  6. refundAmount = amount × actualRefund / purchased
   │  7. Toss cancelPayment(paymentKey, reason, refundAmount)
   │  8. adjust_user_coins(-actualRefund) (RPC)
   │  9. coin_transactions INSERT (delta=-N, reason=refund)
   │ 10. payment_log.status='cancelled'
   ↓
 원결제 수단으로 부분/전액 환불
```

### 3.5 일일운세 Flow (무료)

```
 /daily?characterId=X [17]
   │  오늘 결과 없음 상태
   ↓ "오늘의 운세를 확인하세요" 버튼
 GET /api/daily?characterId=X
   │  DOM: FullscreenOverlay (createPortal) 활성
   │    - GachaMachine 흔들림
   │    - 4종 메시지 페이드 로테이션 (2.5초 간격)
   │    - FortuneTipCard (8초 로테이션)
   ↓ Gemini Flash (~3~5초)
 readings INSERT (type=daily, status=complete, stat_scores={daily_score, lucky_items})
   ↓ window.location.reload()
 /daily 결과 카드 + 캘린더에 오늘 컬러블록 추가
```

---

## 4. 시스템 규칙

### 4.1 미들웨어 리다이렉트 매핑

| 조건 | 결과 |
|------|------|
| 비로그인 + `/landing`·`/login` | 통과 |
| 비로그인 + STATIC_PATHS (`/pricing`·법문서·API auth) | 통과 |
| 비로그인 + 그 외 | `/landing?callbackUrl=<원경로>` |
| 로그인 + JWT userId가 DB에 없음 | 쿠키 삭제 → `/login` |
| 로그인 + 캐릭터 0명 + 임의 경로 | `/onboarding` 강제 |
| 로그인 + 캐릭터 1+ + `/onboarding`·`/login`·`/landing` | `/` |
| 로그인 + `/pricing` | `/coins` (구매 플로우 유도) |
| 프로덕션 + `/dev`·`/api/dev` | `/` (NODE_ENV 조건부 차단) |

### 4.2 결제/환불 규칙

- **1코인 = 유료 상품 1건** (종합/년운/궁합/카테고리 5종 동가)
- **일일운세 무료**
- **웰컴 보너스 없음**
- **유효기간 없음**
- **환불 가능**: 결제일 7일 이내 미사용분 (부분환불 = 비례 공식)
- **환불 불가**: 쓴 코인 (전자상거래법 제17조 제2항 제5호 — 디지털 콘텐츠 제공 개시)
- **race 방지**: `adjust_user_coins(user_id, delta)` PL/pgSQL 함수가 `coins + delta >= 0` 조건으로 atomic UPDATE, 위반 시 `insufficient_coins` 예외

### 4.3 DB 스키마 핵심

```
users (id, name, email, image, coins)
characters (id, user_id, name, birth_*, gender, mbti, is_self, unlocked,
            free_stat_scores JSONB, free_summary)
charts (id, character_id, type∈{saju,ziwei,western}, data JSONB)
readings (id, character_id, character_id_2, type, status, content,
          stat_scores, character_title, charts_data, coin_transaction_id)
payment_log (id, user_id, character_id, amount, payment_key, order_id,
             order_name, method, status, approved_at, coin_quantity, package_id)
coin_transactions (id, user_id, delta, reason∈{purchase,spend,refund},
                   payment_log_id, reading_id, note)
```

### 4.4 보안

- AI 생성 HTML → `sanitizeReadingHtml` (isomorphic-dompurify) → 화이트리스트 태그만 허용
- Supabase service_role_key는 서버에서만 사용
- NextAuth JWT에 userId만 저장
- 모든 API에서 `character.user_id === session.userId` 소유권 검증
- AI 호출 타임아웃 40초 (`withAiTimeout`, Vercel 60초 제한 내)
- 프로덕션에서 `USE_MOCK_READINGS` 강제 false (safeguard)

### 4.5 SEO & 접근성

- robots.txt: 공개 경로만 Allow (/landing, /pricing, /login, 법문서) · /api /dev /mypage 등 Disallow
- sitemap.ts: 공개 7경로 등록
- layout.tsx metadata: title·description·keywords·og:*·robots
- 시맨틱 구조: `<header>`, `<main>`, `<footer>` 사용
- aria-label: 로고·CTA·잔액 배지에 부여

### 4.6 레이아웃 구조

```
html (h-full, lang="ko")
└─ body (h-screen, flex-col, overflow-hidden)
   ├─ div.flex-1.overflow-y-auto.flex.flex-col   ← 내부 스크롤 컨테이너
   │    ├─ (각 페이지의 sticky top-0 헤더)
   │    └─ main 컨텐츠
   └─ Footer (body flex 마지막 item, 하단 영구 고정)
```

**효과**: 헤더/Footer가 viewport에 고정되고 중간 컨텐츠만 스크롤. 모바일에서 `h-dvh` 대신 `h-screen`으로 브라우저 호환성 확보.

---

## 5. 리뷰 관점별 체크포인트

### 5.1 UX 리뷰 포인트
- [ ] 비로그인 → 첫 결제까지 6단계 이하 유지됨 (landing → login → OAuth → onboarding → preview → 결제 → 뽑기)
- [ ] 잔액 배지 항상 헤더 노출로 결제 전 잔액 인지
- [ ] returnTo로 충전 후 원래 위치 복귀 (홈 리셋 방지)
- [ ] 블러 teaser로 paywall 심리적 저항 완화
- [ ] 긴 대기(1~2분)를 팁카드·단계별 메시지로 체감 단축
- [ ] 일일운세 무료 제공으로 재방문 hook
- [ ] 캘린더 컬러블록으로 과거 점수 시각화

### 5.2 상업적 리뷰 포인트
- [ ] 4단계 차등 할인 (990→900→840→790, 최대 -20%)으로 AOV 상승 유도
- [ ] 유효기간 없음 + 7일 환불로 구매 저항 최소화
- [ ] 상품 9종을 스킬트리 RPG 메타포로 배치 — 탐험·수집 욕구 자극
- [ ] 1계정 N캐릭터로 가족·지인까지 구매 확장

### 5.3 법적/심사 리뷰 포인트
- [ ] 법문서 4종 구비 (이용약관·개인정보·환불·고객센터)
- [ ] Footer 사업자정보 전역 노출 (상호·대표·사업자등록번호·주소·전화·이메일)
- [ ] 전자상거래법 제17조 제2항 제5호 명시적 근거
- [ ] Toss customerKey = userId로 분쟁 추적 가능
- [ ] 미성년자 결제 조항
- [ ] 개인정보 처리위탁 표 (Toss·Supabase·Vercel·Google·카카오)

### 5.4 기술/운영 리뷰 포인트
- [ ] DB race condition 방지 (`adjust_user_coins` atomic RPC)
- [ ] API 소유권 검증 (모든 endpoint에서 user_id 매칭)
- [ ] AI 타임아웃 40초 (Vercel 60초 내)
- [ ] AI 생성 HTML DOMPurify 살균
- [ ] error.tsx·not-found.tsx·global-error.tsx 3종 에러 바운더리
- [ ] 프로덕션에서 DEV 라우트 자동 차단
- [ ] USE_MOCK_READINGS 이중 safeguard

### 5.5 개선 가능 영역 (리뷰어에게 질문 던질 포인트)
- 네이버·구글 OAuth 실 연동 시 전환율 변화는?
- Toss 결제창 대신 원페이지 자체 결제창으로 전환율 개선 여지?
- 환불 경로를 mailto에서 셀프 서비스 UI(결제 이력 + 버튼)로 자동화하면 심사관 평가 상승?
- 캐릭터 아바타 10종(오행×성별) 확장 여지 (예: 나이·MBTI별 세분화)?
- 일일운세의 SCORE 기반 컬러블록 외에 "연속 방문 스트릭" 게이미피케이션 추가?
- 종합감정 결과 12섹션의 정보 밀도가 모바일에서 과도한가?
- 첫 결제 컨버전 개선 — 무료 체험(1코인 웰컴)을 다시 검토할 가치?
- 스킬트리 8노드 중 사용 빈도가 낮은 상품 (예: 학업운) 묶음 할인/번들?

---

## 6. 재현 가이드

### 6.1 공개 페이지 캡처
```bash
rm -f docs/screenshots/0[1-8]-*.png
node scripts/capture-public-screens.mjs
```

### 6.2 로그인 페이지 캡처 (CDP)
```bash
# 1. 기존 크롬 종료 후
open -na "Google Chrome" --args \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug-profile

# 2. 해당 크롬에서 카카오 로그인 완료 + 테스트 상태 세팅

# 3. 캡처 실행
node scripts/capture-logged-in-screens.mjs
```

### 6.3 Toss PPT 재생성
```bash
node scripts/build-toss-ppt.mjs
# → docs/toss-payment-flow.pptx (스크린샷 자동 삽입)
```

### 6.4 프로덕션 재배포
```bash
git add -A && git commit -m "..." && git push
# → Vercel 자동 빌드 · 배포
```

---

## 7. 참고 파일

| 파일 | 역할 |
|------|------|
| `scripts/capture-public-screens.mjs` | 비로그인 8장 자동 캡처 (Playwright launch) |
| `scripts/capture-logged-in-screens.mjs` | CDP 기존 세션 경유 11장 캡처 |
| `scripts/build-toss-ppt.mjs` | pptxgenjs로 16슬라이드 PPT 자동 생성 |
| `docs/screenshots/` | 캡처 원본 (19장) |
| `docs/toss-payment-flow.pptx` | 심사 제출용 (이미지 8장 자동 삽입, placeholder 3장) |
| `docs/toss-payments-사업준비.md` | 사업자·업종 등록 가이드 |
| `docs/vercel-env-setup.md` | 환경변수 등록 가이드 |
| `src/middleware.ts` | 라우트 접근 제어 원본 |
| `src/lib/coins/packages.ts` | 코인 패키지 상수 (단일 소스) |
| `src/lib/copy/contact.ts` | 고객센터·사업자 정보 상수 |
| `supabase/schema.sql` | DB 스키마 + `adjust_user_coins` RPC |
