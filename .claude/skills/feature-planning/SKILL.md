---
name: feature-planning
description: 갓챠사주 신규 기능 스펙을 7대 축(차트 엔진/DB/API/UI/미들웨어·라우팅/결제/AI 프롬프트)에 매핑하여 영향도 분석과 작업 분해표를 만드는 방법론. feature-planner 에이전트가 "이 기능을 어떻게 추가하지?", "영향도 분석해줘", "작업 분해해줘", "이 변경이 어디에 영향을 주지?" 같은 요구를 받았을 때 반드시 사용. 신규 페이지·신규 API·신규 상품·신규 캐릭터 항목·신규 차트 데이터 추가 시 항상 트리거된다.
---

# 갓챠사주 신규 기능 기획 방법론

## 7대 축 매핑

신규 기능 스펙을 받으면 가장 먼저 다음 7개 축에 영향이 있는지 매핑한다.

| 축 | 핵심 파일 | 변경 신호 |
|---|---|---|
| 1. 차트 엔진 | `src/lib/charts/saju.ts`, `ziwei.ts`, `western.ts` | 새 차트 데이터 항목, LLM 입력 보강 |
| 2. DB | `supabase/schema.sql`, `characters`/`charts`/`readings`/`payment_log` | 새 컬럼·테이블, JSONB 필드 |
| 3. API | `src/app/api/**/route.ts`, `src/lib/{ai,payments,reading,supabase}` | 새 엔드포인트, 결제·AI 호출 |
| 4. UI | `src/app/(main)/**/page.tsx`, `src/components/**` | 새 페이지·컴포넌트, 디자인 변경 |
| 5. 미들웨어·라우팅 | `src/middleware.ts` | 비로그인 접근 허용, 새 보호 경로 |
| 6. 결제 | `src/lib/payments`, `src/app/api/payments/`, `payment_log` | 새 상품, 가격, 해금 전제조건 |
| 7. AI 프롬프트 | `src/lib/ai/prompts/*` (9종), `free-stat-scorer.ts` | 새 운세 종류, 비유 체계 변경 |

> 1개라도 매칭되지 않는 요구는 "범위 외"로 표시하고 리더에게 보고한다.

## 영향도 분석 (`01_planner_impact.md`) 템플릿

```markdown
# 영향도 분석: {기능명}

## 요구 요약
{사용자 요구 1~3줄}

## 7대 축 영향 매트릭스
| 축 | 변경 여부 | 변경 단위 | 위험도 | 비고 |
|---|---|---|---|---|
| 차트 엔진 | ❌ / ⚠️ / ✅ | {파일·심볼} | low/med/high | |
...

## 핵심 위험
- {라우터 정책 위반 가능성, 결제 전제조건 영향, 1계정 N캐릭터 깨짐 등}

## 사용자 확인 필요
- {모호한 부분 항목화}
```

## 작업 분해표 (`02_planner_breakdown.md`) 템플릿

```markdown
# 작업 분해: {기능명}

## 의존 그래프
db-migrator → api-builder → ui-builder → integration-qa

## 작업 목록
| # | 담당 | 변경 파일 | 의존 | 산출물 |
|---|---|---|---|---|
| 1 | db-migrator | supabase/schema.sql | - | 새 컬럼 X |
| 2 | api-builder | src/app/api/.../route.ts | 1 | POST /api/... |
| 3 | ui-builder | src/app/(main)/.../page.tsx | 2 | 새 페이지 |
| 4 | integration-qa | (검증) | 1,2,3 | qa report |

## 비즈니스 규칙 점검 결과
- 1계정 N캐릭터 소유권: {유지 / 영향}
- 결제 해금 전제조건: {유지 / 영향}
- DOMPurify 새니타이징: {유지 / 영향}
- 라우터 정책: {유지 / STATIC_PATHS 추가 필요 / 미들웨어 분기 추가 필요}
- 인라인 스타일 금지: {준수 / 주의}

## 사용자 확인 필요
- {모호한 부분이 있으면 여기에 옮겨 적음}
```

## 분해 원칙

- **변경 단위는 파일 또는 심볼**까지 내려가야 한다. "DB 변경" 같은 추상 항목은 작업 분해가 아니다.
- 의존 순서: 거의 항상 **DB → API → UI → QA**. UI 먼저가 필요하면 그 이유를 명시.
- `integration-qa`는 마지막 1회가 아니라, 각 모듈 완성 직후 점진 호출되도록 분해표에 의존성을 명시한다.

## 모호한 요구 처리

추측 금지. 다음 중 하나라도 불명확하면 "사용자 확인 필요" 섹션에 옮긴다:
- 신규 상품의 가격 (전부 990원이 기본이지만 예외인지)
- 신규 페이지의 인증 요구사항 (비로그인 접근 가능?)
- 새 컬럼의 NOT NULL / NULL 허용 여부
- AI 프롬프트의 출력 형식 (HTML 섹션 수, plain text)
- MBTI 영향 (있는지/없는지)

## 이전 산출물 갱신

`_workspace/01_planner_impact.md`가 이미 있으면 새로 쓰지 않고 변경된 부분만 갱신. 기존 작업 분해의 이미 완료된 항목은 보존.
