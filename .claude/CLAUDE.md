<!-- OMC:START -->
<!-- OMC:VERSION:4.11.2 -->

# oh-my-claudecode - Intelligent Multi-Agent Orchestration

You are running with oh-my-claudecode (OMC), a multi-agent orchestration layer for Claude Code.
Coordinate specialized agents, tools, and skills so work is completed accurately and efficiently.

<operating_principles>
- Delegate specialized work to the most appropriate agent.
- Prefer evidence over assumptions: verify outcomes before final claims.
- Choose the lightest-weight path that preserves quality.
- Consult official docs before implementing with SDKs/frameworks/APIs.
</operating_principles>

<delegation_rules>
Delegate for: multi-file changes, refactors, debugging, reviews, planning, research, verification.
Work directly for: trivial ops, small clarifications, single commands.
Route code to `executor` (use `model=opus` for complex work). Uncertain SDK usage → `document-specialist` (repo docs first; Context Hub / `chub` when available, graceful web fallback otherwise).
</delegation_rules>

<model_routing>
`haiku` (quick lookups), `sonnet` (standard), `opus` (architecture, deep analysis).
Direct writes OK for: `~/.claude/**`, `.omc/**`, `.claude/**`, `CLAUDE.md`, `AGENTS.md`.
</model_routing>

<skills>
Invoke via `/oh-my-claudecode:<name>`. Trigger patterns auto-detect keywords.
Tier-0 workflows include `autopilot`, `ultrawork`, `ralph`, `team`, and `ralplan`.
Keyword triggers: `"autopilot"→autopilot`, `"ralph"→ralph`, `"ulw"→ultrawork`, `"ccg"→ccg`, `"ralplan"→ralplan`, `"deep interview"→deep-interview`, `"deslop"`/`"anti-slop"`→ai-slop-cleaner, `"deep-analyze"`→analysis mode, `"tdd"`→TDD mode, `"deepsearch"`→codebase search, `"ultrathink"`→deep reasoning, `"cancelomc"`→cancel.
Team orchestration is explicit via `/team`.
Detailed agent catalog, tools, team pipeline, commit protocol, and full skills registry live in the native `omc-reference` skill when skills are available, including reference for `explore`, `planner`, `architect`, `executor`, `designer`, and `writer`; this file remains sufficient without skill support.
</skills>

<verification>
Verify before claiming completion. Size appropriately: small→haiku, standard→sonnet, large/security→opus.
If verification fails, keep iterating.
</verification>

<execution_protocols>
Broad requests: explore first, then plan. 2+ independent tasks in parallel. `run_in_background` for builds/tests.
Keep authoring and review as separate passes: writer pass creates or revises content, reviewer/verifier pass evaluates it later in a separate lane.
Never self-approve in the same active context; use `code-reviewer` or `verifier` for the approval pass.
Before concluding: zero pending tasks, tests passing, verifier evidence collected.
</execution_protocols>

<hooks_and_context>
Hooks inject `<system-reminder>` tags. Key patterns: `hook success: Success` (proceed), `[MAGIC KEYWORD: ...]` (invoke skill), `The boulder never stops` (ralph/ultrawork active).
Persistence: `<remember>` (7 days), `<remember priority>` (permanent).
Kill switches: `DISABLE_OMC`, `OMC_SKIP_HOOKS` (comma-separated).
</hooks_and_context>

<cancellation>
`/oh-my-claudecode:cancel` ends execution modes. Cancel when done+verified or blocked. Don't cancel if work incomplete.
</cancellation>

<worktree_paths>
State: `.omc/state/`, `.omc/state/sessions/{sessionId}/`, `.omc/notepad.md`, `.omc/project-memory.json`, `.omc/plans/`, `.omc/research/`, `.omc/logs/`
</worktree_paths>

## Setup

Say "setup omc" or run `/oh-my-claudecode:omc-setup`.

<!-- OMC:END -->

---

# 갓챠사주 — 운명의 RPG 사주풀이

## 프로젝트 정체성

990원 건별 결제의 AI 사주 서비스. 사주팔자 + 자미두수 + 서양점성술 **3체계 교차분석**이 핵심 차별점.
UI는 **모던 픽셀 RPG** (Celeste/Stardew Valley) 스타일의 **라이트 테마**로, 운세를 게임 캐릭터 스탯시트처럼 표현한다.

- 타겟: 한국 20-30대 (MZ세대)
- 벤치마크: saju-kid.com (사주아이) — 단, 사주아이는 사주 1체계만 사용
- 비즈니스 모델: 무료(일일운세+캐릭터생성) → 990원 건별 결제 (박리다매, 9종 상품)
- 핵심 컨셉: **1계정 N캐릭터** — 본인/가족/친구 사주를 RPG 캐릭터처럼 관리

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router, RSC, Turbopack) |
| Language | TypeScript (strict) |
| CSS | Tailwind CSS v4 + 픽셀 RPG 커스텀 테마 |
| Auth | NextAuth.js v5 (카카오/네이버/구글 OAuth) |
| DB | Supabase PostgreSQL (DB만 사용, Auth 미사용) |
| AI (종합풀이) | Gemini 3.1 Pro Preview (`gemini-3.1-pro-preview`) |
| AI (일일운세) | Gemini 2.5 Flash (`gemini-2.5-flash`) |
| AI (스탯 점수) | Gemini 2.5 Flash (JSON mode, 2단계 분리 호출) |
| 결제 | Toss Payments (990원 건별) |
| 사주 엔진 | lunar-javascript |
| 자미두수 엔진 | iztro |
| 서양점성술 엔진 | circular-natal-horoscope-js (CJS, serverExternalPackages) |
| HTML 새니타이징 | isomorphic-dompurify |
| 검증 | Zod |
| 호스팅 | Vercel |
| 픽셀 폰트 | NeoDungGeunMo (Neo둥근모, public/fonts/) |

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router 페이지
│   ├── landing/                # 비로그인 마케팅 랜딩 (캡슐머신 비주얼 + 3체계 소개)
│   ├── login/                  # 소셜 로그인 (캡슐 뽑기 톤)
│   ├── onboarding/             # 첫 캐릭터 생성 마법사 (3단계 + MBTI)
│   ├── dev/                    # 더미 데이터 UI 프리뷰 (hub/daily/skilltree/reading)
│   ├── (main)/                 # 인증 필요 페이지 그룹
│   │   ├── daily/              # 일일 퀘스트 보드 + 캘린더
│   │   ├── reading/            # 감정 결과 (종합/년운/카테고리별 분기)
│   │   │   ├── preview/        # 종합 분석 미리보기 (스탯+블러 잠금+CTA)
│   │   │   ├── new/            # 상품 구매 (캡슐머신 결제 UI)
│   │   │   ├── generating/[id] # 생성 중 폴링
│   │   │   └── [id]/           # 결과 상세 (type별 레이아웃)
│   │   ├── characters/         # 캐릭터 관리
│   │   │   ├── new/            # 추가 캐릭터 생성
│   │   │   └── [id]/           # 캐릭터 상세 + 스킬트리
│   │   ├── compatibility/      # 궁합 분석 (캐릭터 2개 선택)
│   │   └── mypage/             # 마이페이지 (계정 + 캐릭터 목록)
│   └── api/
│       ├── auth/               # NextAuth
│       ├── daily/              # 일일운세 생성 (characterId 기반)
│       ├── reading/            # 감정 생성 (type 분기: comprehensive/yearly/love/career/...)
│       ├── payments/           # Toss 결제 승인 (결제 전 해금 체크)
│       └── dev/                # 개발용 테스트 API
├── components/
│   ├── ui/                     # PixelFrame, PixelButton, StatBar, ElementTag, PixelSelect, PixelDivider, GachaCapsuleSvg
│   ├── hub/                    # HubHeader, CharacterSlot, SkillTree, TriSystemSymbol, ServiceCard, NewCharacterSlot
│   ├── character/              # CharacterCard, CharacterHero
│   ├── reading/                # ReadingAccordion, ReadingSection, YearlyReadingView, CategoryReadingView, CompatibilityAccordion
│   ├── daily/                  # DailyCalendar (CSS Module), DailyFortuneDetail, UpsellBanner
│   ├── loading/                # GachaMachine, GachaCapsuleOpen, GachaLeverPull (결제 후 레버 인터랙션)
│   └── layout/                 # SubPageHeader, PixelPageWrapper
├── lib/
│   ├── ai/                     # Gemini 클라이언트 (9종 프롬프트), 스탯 스코어러, 무료 스탯 스코어러, HTML 새니타이저
│   ├── charts/                 # 사주/자미두수/서양점성술 계산 엔진 + getYearlyGanZhi
│   ├── reading/                # executeReadingGeneration (공통 재시도 래퍼)
│   ├── payments/               # Toss Payments API
│   ├── supabase/               # Supabase 서버 클라이언트
│   └── data/                   # 도시 좌표 매핑
└── types/                      # NextAuth 타입, lunar-javascript.d.ts (LiuNian/LiuYue)
```

## 핵심 규칙

### 디자인
- **라이트 테마**: 배경 `#f5f0e8` (크림/양피지), 카드 `#ffffff`, 텍스트 `#2c2418`
- **픽셀 보더**: border-radius: 0, 이중선 RPG 윈도우, 픽셀 드롭 셰도우
- **폰트**: 제목/라벨/버튼은 `var(--font-pixel)` (NeoDungGeunMo), 본문은 `var(--font-body)` (Noto Sans KR)
- **골드 액센트**: `#9a7040` (라이트 모드용 깊은 골드)
- **오행 색상**: wood=#2e8b4e, fire=#d04040, earth=#a87838, metal=#6878a0, water=#3070c0

### CSS 컨벤션 (필수)
- **인라인 스타일(`style={{ }}`) 사용 금지**. 절대 사용하지 마라.
- **우선순위**: Tailwind 유틸리티 클래스 > CSS Module (.module.css) > globals.css 커스텀 클래스
- **Tailwind arbitrary values** 적극 사용: `text-[#9a7040]`, `bg-[#f5f0e8]`, `border-[#b8944c]`, `font-[family-name:var(--font-pixel)]`
- **반복되는 패턴**은 globals.css의 `@layer components { }` 안에 클래스로 정의
- **Tailwind v4에서 커스텀 클래스가 안 먹히면** CSS Module(`.module.css`)로 전환 — DailyCalendar.module.css가 선례
- **동적 값**(오행 색상 등 props에 따라 변하는 것)만 예외적으로 inline style 허용, 그것도 최소한으로
- 기존 인라인 스타일 코드는 리팩토링 대상 (점진적으로 Tailwind/CSS Module로 전환)

### 차트 데이터 (LLM 입력의 핵심)
모든 운세(종합풀이, 일일운세, 궁합)는 **차트 엔진이 생성한 JSON 데이터**를 기반으로 LLM이 해석한다.
차트 엔진 3개가 생년월일시+출생지로 계산한 결과가 곧 운세의 원본 데이터이며, LLM은 이 데이터를 읽고 해석하는 역할이다.

- **사주팔자** (`src/lib/charts/saju.ts`): fourPillars, tenGods, fiveElements, dayMaster, luckCycles, raw (전체 원본)
- **자미두수** (`src/lib/charts/ziwei.ts`): 12궁(palaces) × 주성/부성/잡성 + brightness/mutagen + 12신살(changsheng12/boshi12/jiangqian12/suiqian12) + 대한(decadal) + 활성나이(ages) + 명주성(soul)/신주성(body)
- **서양점성술** (`src/lib/charts/western.ts`): ASC/MC, 행성 배치(sign/degree/house/retrograde), 어스펙트, 하우스 시스템
- **MBTI** (사용자 입력, 선택): 16유형 중 하나. 4번째 축으로 3체계와 교차 해석. null이면 3체계만으로 풀이.

LLM에 전달되는 데이터: 사주 JSON + 자미두수 JSON + 서양점성술 JSON + MBTI (있는 경우)
`example.json`이 데이터 형식의 기준. 차트 엔진 수정 시 이 파일과 동일 수준의 상세도를 유지할 것.

### AI 프롬프트
- MBTI가 있으면 **각 섹션에 자연스럽게 녹여넣기** (별도 섹션 금지)
- **비유 체계** 사용: 한자 직접 사용 금지, 괄호 보조만 허용 (예: "깊은 바다 타입(壬水)")
- 스탯 점수는 **2단계 분리 호출**: Step1 종합풀이 HTML (Gemini Pro) → Step2 스탯 JSON (Gemini Flash JSON mode)
- **무료 스탯**: 캐릭터 생성 시 차트 JSON만으로 Flash가 스탯 6종 + 칭호 + 한줄요약 생성 (`src/lib/ai/free-stat-scorer.ts`)

### 라우터 정책 (미들웨어)

| 상태 | 접근 | 결과 |
|------|------|------|
| 비로그인 | `/login`, `/landing` | 통과 |
| 비로그인 | 그 외 | → `/landing` (callbackUrl 보존) |
| 로그인 + JWT userId가 DB에 없음 | 어디든 | 세션 쿠키 삭제 → `/login` |
| 로그인 + 캐릭터 없음 | 어디든 | → `/onboarding` |
| 로그인 + 캐릭터 있음 | `/login`, `/onboarding`, `/landing` | → `/` (허브) |
| 로그인 + 캐릭터 있음 | `/` | 허브 페이지 (캐릭터 선택화면) |
| 로그인 + 캐릭터 있음 | 기타 | 정상 접근 |

- STATIC_PATHS (인증 없이 통과): `/api/auth`, `/api/dev`, `/dev`, `/_next`, `/fonts`, `/favicon.ico`
- 인증: accounts 테이블의 provider+provider_account_id로 매칭 (email 불필요)
- JWT에는 userId만 저장 (profileComplete/mbti 제거됨)

### 상품 라인업 (전부 990원)

| 상품 | readings.type | AI 모델 | 출력 형식 | 상태 |
|------|--------------|---------|----------|------|
| 종합감정 | comprehensive | Gemini Pro | HTML 12섹션 | ✅ |
| 년운 분석 | yearly | Gemini Pro | HTML 7섹션 | ✅ |
| 궁합 분석 | compatibility | Gemini Pro | HTML 7섹션 | ✅ |
| 연애운 | love | Gemini Pro | HTML 4섹션 | ✅ |
| 직업운 | career | Gemini Pro | HTML 4섹션 | ✅ |
| 금전운 | wealth | Gemini Pro | HTML 4섹션 | ✅ |
| 건강운 | health | Gemini Pro | HTML 4섹션 | ✅ |
| 학업운 | study | Gemini Pro | HTML 4섹션 | ✅ |
| 일일운세 | daily | Gemini Flash | plain text + 점수 | ✅ (무료) |

- **캐릭터 생성 = 무료** (차트 엔진 + Flash 스탯 생성, AI 비용 ~$0.001)
- **캐릭터 생성 시**: Flash 모델로 free_stat_scores(6종) + free_summary(한줄 운명 요약) 자동 생성
- **종합감정 = 캐릭터 해금** (characters.unlocked = true)
- **다른 상품 구매 전제조건**: 종합감정 해금 필요 (결제 전 체크)
- **월운 = 년운에 포함** (별도 상품 아님)

### 감정 생성 비동기 패턴
- Toss 결제 → success 페이지 → **레버 당기기 인터랙션**(GachaLeverPull) + 결제 승인 API **병렬 실행**
- 레버 완료 + API 완료 → GachaMachine 로딩 → generating 페이지로 이동
- 결제 승인 → readings INSERT (status='pending') → Background에서 생성
- 클라이언트 3초 폴링 → 완료 시 결과 페이지
- 실패 시 자동 재시도 1회 → 최종 실패 시 사용자 친화 에러 메시지 (AI 공급자 정보 비노출)
- 공통 래퍼: `src/lib/reading/generate-reading.ts`의 `executeReadingGeneration()`
- **Dev/Live 분기**: `USE_MOCK_READINGS=true` 환경변수로 Gemini 호출 없이 mock 데이터 사용 가능
  - mock 데이터: `src/lib/reading/mock-data.ts` (임승균 캐릭터 실제 결과 기반)
  - ⚠️ **프로덕션 배포 시 `USE_MOCK_READINGS`를 반드시 제거하거나 `false`로 설정**
  - Vercel 환경변수에는 이 값을 절대 설정하지 말 것

### DB 구조 (1계정 N캐릭터)

```
users: id, name, email, image (OAuth 정보만)
characters: id, user_id, name, birth_date, birth_time, birth_city, gender, mbti, is_self, unlocked, free_stat_scores(JSONB), free_summary
charts: id, character_id, type(saju/ziwei/western), data(JSONB)
readings: id, character_id, type, status, content, stat_scores, character_title, year, character_id_2
payment_log: id, user_id, character_id, amount, payment_key, order_id, reading_id
```

- characters → charts, readings는 character_id FK
- 궁합: readings.character_id_2로 두 번째 캐릭터 참조
- 모든 API에서 소유권 확인: character.user_id === session.userId

### 캐릭터 시스템
- 오행 5종 × 성별 2종 = 10종 프리셋
- 레벨 = 만 나이
- 아바타 경로: `/characters/{element}-{gender}.png`
- 프리셋 매핑: 일간(日干) → 오행 자동 결정
- 스킬트리: 종합감정(루트) → 년운/연애운/직업운/금전운/건강운/학업운/궁합(가지)

### 보안
- AI 생성 HTML은 반드시 DOMPurify 통과 후 렌더링
- AI 에러 메시지는 서버 로그에만, 사용자에게는 일반 메시지
- Supabase service_role_key는 서버 사이드에서만 사용
- NextAuth JWT에 userId만 저장
- 모든 API에서 characterId 소유권 검증

## 환경변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=
TOSS_SECRET_KEY=
TOSS_CLIENT_KEY=
```

## 로드맵

### 완료 ✅
- [x] Supabase 연결 + 스키마 (1:N 캐릭터)
- [x] 카카오 OAuth (accounts 테이블 매칭)
- [x] 1계정 N캐릭터 시스템
- [x] 캐릭터 생성 (커스텀 PixelSelect, 년/월/일/시/분)
- [x] 허브 페이지 (RPG 캐릭터 선택, 오행 배경색)
- [x] 종합감정 (Gemini Pro, HTML 12섹션, 스탯, 비동기)
- [x] 일일운세 (Gemini Flash, 점수, 캘린더 컬러블록)
- [x] 년운 분석 (대운+세운+12월운, HTML 7섹션)
- [x] 궁합 분석 (캐릭터 2개 선택, VS 레이아웃)
- [x] 카테고리 특화 5종 (연애/직업/금전/건강/학업, HTML 4섹션)
- [x] 스킬트리 UI (심화 특성 그리드, 전 노드 활성)
- [x] 마이페이지 (계정 + 캐릭터 목록 + 로그아웃)
- [x] 캘린더 UI (점수 기반 컬러블록, CSS Module)
- [x] 미들웨어 (세션 무효 감지, 라우팅 정책)
- [x] 인라인 스타일 → Tailwind 리팩토링
- [x] Toss Payments 결제 연동 (SDK + 결제 승인 API + 성공/실패 페이지)
- [x] 캐릭터 픽셀 아바타 이미지 10종 (오행 5종 × 성별 2종)
- [x] 무료 스탯 미리보기 (캐릭터 생성 시 Flash로 스탯 6종 + 한줄요약 생성)
- [x] 종합 분석 미리보기 페이지 (`/reading/preview` — 스탯+블러 잠금+CTA)
- [x] 구매 유도 동선 개선 (허브 → 미리보기 → 결제, 스킬트리 우회)
- [x] 결제 페이지 리디자인 (캡슐머신 SVG + 가챠 컨셉)
- [x] CTA 버튼 통일 (캡슐머신 아이콘 + "운명 캡슐 뽑기 — 990원")
- [x] 가챠 컨셉 리브랜딩 (보물상자→캡슐머신, 레버 인터랙션, 랜딩페이지)
- [x] 캐릭터 삭제/편집 기능 (이름/MBTI 편집, is_self 삭제 차단, CASCADE 삭제)
- [x] 일일운세 로딩 오버레이 수정 (SSR portal 마운트 + 센터링)
- [x] 업셀 배너 개선 (가격 직접 노출 → 자연스러운 유도 링크)

### 미완료 (우선순위순)
- [ ] Vercel 배포 (환경변수, 도메인)
- [ ] 네이버/구글 OAuth 설정
- [x] 비로그인 마케팅 랜딩 페이지 (`/landing` — 캡슐머신 비주얼 + 3체계 소개)
- [ ] SNS 공유 (결과 이미지 생성)
- [ ] 스킬트리 연결선 CSS (2차)

## 참고 문서
- `.omc/specs/deep-interview-hub-redesign-v3.md` — N캐릭터 + 허브 리디자인 스펙
- `.omc/specs/deep-interview-product-expansion.md` — 상품 라인업 확장 스펙
- `.omc/plans/hub-redesign-n-characters.md` — N캐릭터 구현 계획 (Ralplan 합의)
- `.omc/plans/product-expansion-skilltree.md` — 상품 확장 + 스킬트리 계획 (Ralplan 합의)
- `docs/references/` — PET 앱 UI 레퍼런스, 캘린더 레퍼런스
- `supabase/schema.sql` — PostgreSQL DDL (characters, charts, readings, payment_log)
