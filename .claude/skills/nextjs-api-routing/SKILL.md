---
name: nextjs-api-routing
description: 갓챠사주 Next.js 16 App Router API 작성 패턴. NextAuth v5 세션 + characterId 소유권 검증, Zod 입력 검증, executeReadingGeneration 래퍼, Toss 결제 승인, Gemini AI 호출, USE_MOCK_READINGS 분기, DOMPurify, 사용자 친화 에러 메시지. api-builder 에이전트가 "API 라우트 추가", "엔드포인트 만들기", "Gemini 연동", "결제 승인 API" 요청을 받았을 때 반드시 사용한다.
---

# 갓챠사주 API 작성 가이드

## 모든 API의 공통 골격

```ts
// src/app/api/<feature>/route.ts
import { auth } from "@/lib/auth";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const InputSchema = z.object({
  characterId: z.string().uuid(),
  // ...
});

export async function POST(req: Request) {
  // 1. 세션 확인
  const session = await auth();
  if (!session?.user?.userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // 2. 입력 검증
  const body = await req.json();
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  // 3. 소유권 검증 (필수)
  const supabase = createServerSupabaseClient();
  const { data: character } = await supabase
    .from("characters")
    .select("id, user_id, unlocked")
    .eq("id", parsed.data.characterId)
    .single();

  if (!character || character.user_id !== session.user.userId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // 4. 비즈니스 규칙 (예: 결제 전제조건 = 종합감정 해금)
  // 5. 실제 처리
  // 6. 응답
}
```

## 절대 빠뜨리면 안 되는 것

1. **NextAuth 세션 검증** — `await auth()` 후 `session.user.userId` 존재 확인.
2. **characterId 소유권 검증** — `character.user_id === session.user.userId`. 누락은 critical 보안 결함.
3. **Zod 입력 검증** — `safeParse`. JSON 파싱 실패도 함께 처리.
4. **사용자 친화 에러 메시지** — `console.error`로 상세 로그, 응답에는 일반화된 코드 (`INVALID_INPUT`, `FORBIDDEN`, `INTERNAL_ERROR`).
5. **AI 공급자 정보 비노출** — "Gemini" 같은 단어를 응답 메시지에 포함하지 않는다.

## AI 호출 패턴

`src/lib/reading/generate-reading.ts`의 `executeReadingGeneration` 공통 래퍼를 사용한다:

```ts
import { executeReadingGeneration } from "@/lib/reading/generate-reading";

const result = await executeReadingGeneration({
  characterId,
  type: "love", // readings.type
  // ...
});
```

이 래퍼는 1회 자동 재시도 + 사용자 친화 에러 메시지를 책임진다. **직접 Gemini SDK를 호출하지 않는다** (래퍼를 우회하면 재시도/에러 정책이 깨짐).

### Mock 분기

```ts
if (process.env.USE_MOCK_READINGS === "true") {
  return mockReading; // src/lib/reading/mock-data.ts
}
```

> ⚠️ Vercel 환경변수에 `USE_MOCK_READINGS`를 설정하면 안 된다. 이를 PR 설명/주석에 반드시 명시.

## DOMPurify 새니타이징

AI가 만든 HTML은 저장 전 또는 응답 전에 DOMPurify를 통과시킨다:

```ts
import DOMPurify from "isomorphic-dompurify";
const safe = DOMPurify.sanitize(rawHtml);
```

- 서버 측에서 새니타이즈 후 DB 저장이 기본.
- UI 측 dangerouslySetInnerHTML로 받기 전에도 한 번 더 새니타이즈 권장.

## 결제 (Toss) 패턴

결제 승인 API는 **읽기 시점 해금 전제조건**을 반드시 점검:

```ts
// 신규 상품(love/career/...)은 종합감정 해금이 전제
if (type !== "comprehensive") {
  if (!character.unlocked) {
    return NextResponse.json({ error: "COMPREHENSIVE_LOCKED" }, { status: 403 });
  }
}
```

승인 후 `payment_log` INSERT + `readings` INSERT (`status: 'pending'`). 백그라운드 생성은 `executeReadingGeneration`로 위임.

## 응답 shape 컨벤션

- 성공: `{ ok: true, data: ... }` 또는 도메인별 키
- 실패: `{ ok: false, error: "ERROR_CODE", message?: "사용자에게 보여줄 메시지" }`
- 신규 API의 정확한 shape은 `_workspace/04_api_changes.md`에 기록한다 (UI 빌더가 그대로 사용).

## 변경 요약 (`04_api_changes.md`) 템플릿

```markdown
# API 변경 요약: {기능명}

## 신규/수정 엔드포인트
| 메서드 | 경로 | 입력 (Zod) | 출력 | 권한 |
|---|---|---|---|---|
| POST | /api/foo | { characterId } | { ok, data } | 로그인 + 소유 |

## 비즈니스 규칙
- 종합감정 해금 전제조건: {적용/미적용}
- 결제: {필요/불필요}, 금액 {원}

## TypeScript 타입
- export 위치: `src/lib/types/foo.ts`

## 후속 작업 요청
- ui-builder: 이 shape 그대로 fetch
- integration-qa: 소유권/결제 전제 회귀 검증
```

## 점검 체크리스트

- [ ] 세션 검증
- [ ] Zod 입력 검증
- [ ] characterId 소유권 검증
- [ ] 결제 전제조건 (해당 시)
- [ ] AI 호출은 executeReadingGeneration 래퍼 경유
- [ ] DOMPurify 새니타이징 (HTML 응답 시)
- [ ] 사용자 응답에 AI/내부 정보 비노출
- [ ] service_role_key는 서버 사이드만
- [ ] 응답 shape을 `_workspace/04_api_changes.md`에 기록
