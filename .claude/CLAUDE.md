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

# 천명 (天命) — 운명의 RPG 사주풀이

## 프로젝트 정체성

990원 건별 결제의 AI 사주 서비스. 사주팔자 + 자미두수 + 서양점성술 **3체계 교차분석**이 핵심 차별점.
UI는 **모던 픽셀 RPG** (Celeste/Stardew Valley) 스타일의 **라이트 테마**로, 운세를 게임 캐릭터 스탯시트처럼 표현한다.

- 타겟: 한국 20-30대 (MZ세대)
- 벤치마크: saju-kid.com (사주아이) — 단, 사주아이는 사주 1체계만 사용
- 비즈니스 모델: 무료 일일운세 → 990원 종합감정 건별 결제 (박리다매)

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
├── app/                    # Next.js App Router 페이지
│   ├── login/              # RPG 타이틀 화면 (소셜 로그인)
│   ├── onboarding/         # 캐릭터 생성 마법사 (3단계 + MBTI)
│   ├── dev/                # 더미 데이터 UI 프리뷰 (개발용)
│   ├── (main)/             # 인증 필요 페이지 그룹
│   │   ├── daily/          # 일일 퀘스트 보드
│   │   ├── reading/        # 종합감정 (스탯시트 + 탭)
│   │   ├── compatibility/  # 궁합 VS 대결
│   │   └── mypage/         # 마이페이지
│   └── api/                # API 라우트
│       ├── auth/           # NextAuth
│       ├── daily/          # 일일운세 생성
│       ├── reading/        # 비동기 종합감정 (generate/status/[id])
│       └── payments/       # Toss 결제 승인
├── components/
│   ├── ui/                 # 픽셀 디자인 시스템 (PixelFrame, PixelButton, StatBar, ElementTag)
│   ├── character/          # CharacterCard (오행 캐릭터)
│   ├── reading/            # ReadingStatSheet, ReadingTabNav, ReadingSection
│   └── layout/             # PixelNavBar, PixelPageWrapper
├── lib/
│   ├── ai/                 # Gemini 클라이언트, 프롬프트, 스탯 스코어러, HTML 새니타이저
│   ├── charts/             # 사주/자미두수/서양점성술 계산 엔진
│   ├── character/          # 오행 프리셋 매핑 + 레벨 계산
│   ├── payments/           # Toss Payments API (confirmPayment, cancelPayment)
│   ├── supabase/           # Supabase 서버 클라이언트
│   ├── data/               # 도시 좌표 매핑
│   └── utils/              # 시간 파싱
└── types/                  # NextAuth 타입 확장, lunar-javascript.d.ts
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

### 종합감정 비동기 패턴
- 결제 승인 → readings INSERT (status='pending') → Background Function에서 생성
- 클라이언트 3초 폴링 → 완료 시 결과 페이지
- 실패 시 자동 재시도 1회 → 최종 실패 시 Toss cancelPayment 자동 환불

### 캐릭터 시스템
- 오행 5종 × 성별 2종 = 10종 프리셋
- 레벨 = 만 나이
- 아바타 경로: `/characters/{element}-{gender}.png`
- 프리셋 매핑: 일간(日干) → 오행 자동 결정

### 보안
- AI 생성 HTML은 반드시 DOMPurify 통과 후 렌더링
- Supabase service_role_key는 서버 사이드에서만 사용
- NextAuth JWT에 userId, profileComplete, mbti 저장

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

## 참고 문서
- `.omc/specs/deep-interview-fortune-web.md` — Deep Interview 스펙 (요구사항 정의)
- `.omc/plans/nextjs-migration.md` — 마이그레이션 구현 계획 (Consensus 승인)
- `.omc/plans/pixel-rpg-theme.md` — 픽셀 RPG 테마 계획 (Consensus 승인)
- `docs/character-prompts.md` — 10종 캐릭터 AI 생성 프롬프트
- `docs/task-06-mbti-integration.md` — MBTI 통합 설계
- `supabase/schema.sql` — PostgreSQL DDL
