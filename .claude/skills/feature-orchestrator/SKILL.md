---
name: feature-orchestrator
description: 갓챠사주 신규 기능 풀스택 워크플로우 오케스트레이터. 사용자 요구를 받아 feature-planner → db-migrator → api-builder → ui-builder → integration-qa 5인 에이전트 팀을 구성하고 진행을 조율한다. "신규 기능 추가", "페이지 만들어줘", "API 추가해줘", "새 상품 추가", "이 기능을 만들어줘", "차트에 항목 추가", "결제 흐름 추가", "스킬트리 노드 추가", 또는 풀스택 변경이 필요한 작업 요청 시 반드시 사용한다. 부분 재실행("X만 다시", "Y 부분 수정", "이전 결과 기반으로", "QA만 다시 돌려줘")도 처리한다.
---

# 갓챠사주 풀스택 기능 오케스트레이터

갓챠사주 신규 기능을 **DB → API → UI → QA** 파이프라인으로 처리하는 5인 에이전트 팀의 리더.

## 실행 모드

**에이전트 팀** (TeamCreate + SendMessage + TaskCreate). 팀원 5명:

| 에이전트 | 단계 | 핵심 산출물 |
|---|---|---|
| feature-planner | Phase 1 | `01_planner_impact.md`, `02_planner_breakdown.md` |
| db-migrator | Phase 2 | `supabase/schema.sql`, `03_db_changes.md` |
| api-builder | Phase 3 | `src/app/api/...`, `04_api_changes.md` |
| ui-builder | Phase 4 | `src/app/(main)/...`, `05_ui_changes.md` |
| integration-qa | Phase 2~5 | `06_qa_report.md` (점진적) |

모든 에이전트는 `model: "opus"`. Agent 도구 호출 시 반드시 명시.

## 작업 디렉토리

```
.omc/state/feature-{slug}/_workspace/
  ├── 01_planner_impact.md
  ├── 02_planner_breakdown.md
  ├── 03_db_changes.md
  ├── 04_api_changes.md
  ├── 05_ui_changes.md
  └── 06_qa_report.md
```

`{slug}`은 사용자 요구에서 추출 (예: "월간 운세 추가" → `monthly-fortune`).

## Phase 0: 컨텍스트 확인

워크플로우 시작 전 **반드시** 실행 모드를 결정한다:

1. `.omc/state/feature-{slug}/_workspace/`가 존재하는가?
   - **존재하지 않음** → **초기 실행** (Phase 1부터)
   - **존재 + 사용자가 부분 수정 요청** ("X만 다시", "QA만 다시") → **부분 재실행** (해당 에이전트만)
   - **존재 + 사용자가 새 입력 제공** → 기존 디렉토리를 `_workspace_prev/`로 이동 후 **새 실행**

2. 사용자 요구에서 slug를 추출하지 못하면 사용자에게 짧게 확인한다.

## Phase 1: 기획 (planner 단독)

```
TeamCreate(team_name="feature-{slug}-plan", members=["feature-planner"])
TaskCreate("영향도 분석 + 작업 분해", owner="feature-planner")
```

산출물 검사: `01_planner_impact.md`, `02_planner_breakdown.md` 생성 확인. "사용자 확인 필요" 섹션이 있으면 사용자에게 질문 후 분해표 갱신.

검사 통과 후 Phase 1 팀 해체:
```
TeamDelete("feature-{slug}-plan")
```

## Phase 2~4: 구현 (4인 팀)

```
TeamCreate(team_name="feature-{slug}-build", members=[
  "db-migrator", "api-builder", "ui-builder", "integration-qa"
])
```

작업은 의존성을 명시한 TaskCreate로 분배. **integration-qa는 각 모듈 직후 점진적으로 실행** (전체 끝난 뒤 1회 X):

| Task | 담당 | blockedBy |
|---|---|---|
| T2 DB 변경 | db-migrator | - |
| T2.qa DB ↔ 타입 검증 | integration-qa | T2 |
| T3 API 작성 | api-builder | T2.qa |
| T3.qa API ↔ DB 경계면 검증 | integration-qa | T3 |
| T4 UI 작성 | ui-builder | T3.qa |
| T4.qa API ↔ UI 경계면 검증 | integration-qa | T4 |
| T5 빌드/타입체크 | integration-qa | T4.qa |

각 에이전트는 자기 작업 완료 시 **다음 에이전트에게 SendMessage**로 신호. integration-qa가 결함을 발견하면 직접 SendMessage로 수정 요청.

## Phase 5: 종합 검증

integration-qa의 `06_qa_report.md`에 FAIL이 있으면:
- 1회 자동 수정 사이클 (해당 에이전트에 수정 요청 → 재검증)
- 2회 실패 시 사용자에게 에스컬레이션

PASS 시 사용자에게 변경 요약 보고:
- 변경된 파일 목록
- 신규/수정 엔드포인트
- 미들웨어 / 결제 / 보안 영향
- 후속 작업 제안

## 데이터 전달 프로토콜

| 종류 | 방식 |
|---|---|
| 진행 상태 | TaskCreate / TaskUpdate |
| 산출 명세 (영향도, API shape 등) | `_workspace/*.md` 파일 |
| 실시간 협의 (스펙 모호, shape 충돌) | SendMessage |
| 수정 요청 (QA → 빌더) | SendMessage + 파일·라인 명시 |

## 에러 핸들링

| 에러 유형 | 정책 |
|---|---|
| 에이전트 1회 실패 | 자동 1회 재시도 |
| 재시도 후도 실패 | 해당 산출물 누락으로 진행, 보고서에 누락 명시 |
| 스펙 모호 | feature-planner에게 SendMessage, "사용자 확인 필요" 갱신 |
| 빌드/타입체크 환경 부재 | 정적 검증만 수행하고 보고서에 명시 |
| 보안 결함 (소유권 누락 등) | 절대 진행 금지, 사용자 에스컬레이션 |

## 부분 재실행 패턴

사용자가 "X만 다시"라고 하면:

1. `_workspace/`에서 해당 에이전트의 산출물 파일을 backup
2. 해당 에이전트만 호출 (나머지는 기존 산출물 신뢰)
3. 변경된 산출물에 의해 영향받는 하류 에이전트가 있으면 추가 호출
4. integration-qa는 변경 범위에 한정해서 재검증

예: "API shape만 다시 작성해줘" → api-builder만 호출 → ui-builder가 fetch 코드 갱신 필요한지 점검 → integration-qa가 API ↔ UI 경계면만 재검증.

## 후속 작업 키워드 (트리거)

이 스킬은 다음 표현에도 트리거되어야 한다:
- "다시 실행", "재실행", "업데이트", "수정", "보완"
- "{기능명}의 {부분작업}만 다시"
- "이전 결과 기반으로", "결과 개선"
- "QA만 다시 돌려줘", "API만 수정해줘"

## 테스트 시나리오

### 정상 흐름
1. 사용자: "월간 운세 상품 추가해줘"
2. Phase 1: feature-planner가 영향도 분석 → readings.type='monthly' 추가, 신규 API, 신규 페이지, 결제 전제(종합감정 해금) 식별
3. Phase 2: db-migrator (필요 시 인덱스 추가)
4. Phase 3: api-builder가 `/api/reading/monthly` + Gemini Pro 프롬프트 추가
5. Phase 4: ui-builder가 결과 페이지 + 결제 페이지 분기 추가
6. Phase 5: integration-qa가 소유권/결제 전제/DOMPurify/타입 검증
7. PASS → 사용자에게 변경 요약 보고

### 에러 흐름 (보안 결함 발견)
1. ui-builder 완료 후 integration-qa가 `/api/reading/monthly`에 characterId 소유권 체크 누락 발견
2. CRITICAL 보고 + api-builder에게 SendMessage 수정 요청
3. api-builder 수정 후 재검증 → PASS
4. 동일 패턴이 2회 반복되면 → CLAUDE.md 변경 이력에 "API 보안 회귀" 기록 권장

## CLAUDE.md 변경 이력 갱신

기능 1건 추가가 끝나면 **반드시** 프로젝트 CLAUDE.md의 "## 하네스: 갓챠사주 풀스택 기능 추가" 섹션의 변경 이력 테이블에 1행 추가:

```
| 2026-04-28 | 월간 운세 상품 추가 | api/ui/db | 신규 상품 |
```

이력은 하네스 진화 추적용이며, 같은 결함 패턴이 반복되면 에이전트/스킬 개선의 근거가 된다.
