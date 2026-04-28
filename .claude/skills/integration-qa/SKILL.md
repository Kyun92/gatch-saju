---
name: integration-qa
description: 갓챠사주 풀스택 변경의 경계면 정합성 검증 방법론. API ↔ UI shape 교차 비교, characterId 소유권 회귀, 미들웨어 라우팅 회귀, DOMPurify 누락, 결제 전제조건 회귀, 인라인 스타일 침투, tsc 타입체크. integration-qa 에이전트가 "검증해줘", "통합 점검", "QA", "회귀 확인", "빌드 체크" 요청을 받거나 다른 에이전트의 모듈 완성 직후 호출될 때 반드시 사용한다.
---

# 갓챠사주 통합 QA 방법론

## 핵심 원칙: 경계면 교차 비교

"존재 확인"이 아니라 **"두 파일을 동시에 읽고 shape이 같은가"**를 본다.

| 안 좋은 예 | 좋은 예 |
|---|---|
| "타입 X가 export되어 있다 → PASS" | "API 응답 shape과 UI fetch 결과 shape을 같이 읽고 키 단위 비교 → 차이 발견" |
| "엔드포인트가 200 응답 → PASS" | "실제 응답 키와 클라이언트 useState 타입이 매칭되는가" |

## 점진적 실행 원칙

전체 완성 후 1회가 아니라, **각 모듈 완성 직후**:

1. `db-migrator` 완성 → schema.sql ↔ TypeScript 타입 비교
2. `api-builder` 완성 → API shape ↔ Zod 스키마 ↔ DB shape 비교
3. `ui-builder` 완성 → UI fetch ↔ API shape 비교

각 단계에서 결함 발견 시 수정 요청 후 재검증.

## 검증 체크리스트 (전체)

### A. DB ↔ API
- [ ] schema.sql의 컬럼 목록 == api-builder가 사용한 SELECT 컬럼 목록
- [ ] NOT NULL 컬럼이 API 응답에서 옵셔널로 다뤄지지 않는가
- [ ] JSONB 필드의 키가 TypeScript 타입과 일치하는가

### B. API ↔ UI
- [ ] API 응답 shape (`_workspace/04_api_changes.md`)과 UI fetch 결과 shape이 같은가
- [ ] 에러 코드(`UNAUTHORIZED`, `FORBIDDEN` 등) 처리 분기가 UI에 있는가

### C. 보안
- [ ] **모든** 신규 API에 `await auth()` + `session.user.userId` 검증
- [ ] **모든** characterId 사용 API에 `character.user_id === session.user.userId` 검증
- [ ] AI 응답을 그대로 dangerouslySetInnerHTML 하지 않는가 (DOMPurify 통과)
- [ ] 응답 메시지에 "Gemini" / "OpenAI" / 내부 모델 이름 노출되지 않는가
- [ ] `service_role_key` import가 서버 측 파일(`src/lib/supabase/server.ts` 등)에만 있는가

### D. 결제
- [ ] 신규 상품 생성 API에 종합감정 해금(`character.unlocked`) 체크가 있는가
- [ ] Toss 결제 승인 후 `payment_log` INSERT + `readings` INSERT 둘 다 있는가
- [ ] `USE_MOCK_READINGS` 분기는 dev only 주석이 있는가

### E. 라우팅
- [ ] 신규 페이지 경로가 미들웨어 STATIC_PATHS와 충돌하지 않는가
- [ ] 비로그인 접근이 필요한 신규 페이지면 STATIC_PATHS에 추가됐는가
- [ ] 로그인 후 캐릭터 없는 상태의 분기가 onboarding으로 빠지는가

### F. UI 컨벤션
- [ ] 신규 파일에 `style={{` 패턴 0건 (`grep -rn "style={{" src/app/<신규경로>`)
- [ ] PixelFrame / PixelButton 재사용 (새로 만들지 않음)
- [ ] DOMPurify 통과 후 dangerouslySetInnerHTML

### G. 빌드
- [ ] `npx tsc --noEmit` PASS (가능한 환경에서)
- [ ] (선택) `npx next build` PASS

## 검증 실행 명령어

```bash
# 신규 파일에 인라인 스타일이 있는지
grep -rn "style={{" src/app/<신규경로> src/components/<신규컴포넌트>

# 신규 API에 auth() 호출 누락 확인
grep -L "auth()" src/app/api/<신규경로>/route.ts

# 신규 API에 소유권 체크 패턴 확인
grep -E "user_id\s*!==?\s*session" src/app/api/<신규경로>/route.ts

# 타입체크
npx tsc --noEmit
```

## 보고서 (`06_qa_report.md`) 템플릿

```markdown
# QA Report: {기능명}

## 요약
- PASS: {N}건
- FAIL: {N}건 (critical {x} / high {y} / medium {z})

## 결함 (FAIL)

### [CRITICAL] {제목}
- 위치: `src/app/api/foo/route.ts:42`
- 기대: characterId 소유권 검증 존재
- 실제: 검증 누락
- 수정 요청 대상: api-builder

### [HIGH] {제목}
...

## 통과 (PASS)
- DB ↔ API shape 일치 (3개 컬럼 매칭)
- 미들웨어 STATIC_PATHS 갱신 확인
- DOMPurify 통과 확인 (2개 위치)

## 빌드/타입체크
- `npx tsc --noEmit`: PASS / FAIL (stderr 발췌)

## 후속
- {수정 후 재검증 필요}
```

## 결함 처리 원칙

- **수정하지 않는다.** 보고만 한다 — 작성/검토 분리 원칙.
- 결함 보고에는 반드시 **파일·라인·기대값·수정 대상 에이전트**를 포함.
- 1회 수정 요청 후 재검증해도 FAIL이면 리더에게 에스컬레이션.
- 동일 결함(예: 소유권 누락)이 2회 이상 반복되면 → 하네스 진화 신호 (CLAUDE.md 변경 이력에 기록 권장).

## 환경 제약

- 빌드/테스트 실행이 불가능한 환경(node_modules 없음, 권한 부족)이면 **정적 검증만** 수행하고, 보고서에 "빌드 미실행 — 정적 검증만"을 명시.
- 실패 stderr는 보고서에 발췌(처음 30줄)로 포함하여 디버깅 단서 제공.
