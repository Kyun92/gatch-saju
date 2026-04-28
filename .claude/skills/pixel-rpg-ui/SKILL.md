---
name: pixel-rpg-ui
description: 갓챠사주 모던 픽셀 RPG 라이트 테마 UI 작성 컨벤션. Tailwind v4 우선, CSS Module 차선, globals.css @layer components 보조 - 인라인 스타일 절대 금지. NeoDungGeunMo 픽셀 폰트, #f5f0e8 크림 배경, 오행 5색, PixelFrame/PixelButton 재사용, DOMPurify, 캡슐머신 가챠 컨셉. ui-builder 에이전트가 "페이지 추가", "컴포넌트 만들기", "디자인", "픽셀 RPG", "스타일링" 요청을 받았을 때 반드시 사용한다.
---

# 갓챠사주 픽셀 RPG UI 가이드

## CSS 우선순위 (절대 규칙)

```
1. Tailwind 유틸리티 클래스         ← 기본
2. CSS Module (.module.css)          ← Tailwind로 표현 어려운 복잡한 셀렉터
3. globals.css @layer components     ← 반복 패턴 클래스화
4. 인라인 style={{ }}                ← 동적 props 기반 값만 예외 (오행 색 등)
```

**`style={{ }}` 일반 사용은 즉시 결함**으로 간주한다. CLAUDE.md의 디자인 규칙을 위반하기 때문.

## 색상 토큰

```css
배경        #f5f0e8  (크림/양피지)
카드        #ffffff
텍스트      #2c2418
골드 액센트 #9a7040  (라이트 모드용 깊은 골드)
보더 골드   #b8944c

오행 5색
  wood     #2e8b4e
  fire     #d04040
  earth    #a87838
  metal    #6878a0
  water    #3070c0
```

Tailwind에서는 arbitrary value로:
```tsx
className="bg-[#f5f0e8] text-[#2c2418] border-[#b8944c]"
```

## 폰트

```tsx
font-[family-name:var(--font-pixel)]  // NeoDungGeunMo - 제목, 라벨, 버튼, CTA
font-[family-name:var(--font-body)]   // Noto Sans KR - 본문
```

## 픽셀 보더 / RPG 윈도우

- `border-radius: 0` (둥근 모서리 금지)
- 이중선 + 픽셀 드롭 셰도우
- 신규 카드/모달은 `<PixelFrame>` 재사용. 새로 만들지 말 것.

## 버튼

- CTA는 `<PixelButton>` 재사용
- 결제 CTA 통일 워딩: **"운명 캡슐 뽑기 — 990원"** + 캡슐머신 아이콘
- 톤 가이드: MZ 타겟의 모던 톤. 올드한 워딩(예: "당신의 운명을 알아보세요!") 금지. 가챠/캡슐/RPG 비유 유지.

## AI HTML 렌더링

```tsx
import DOMPurify from "isomorphic-dompurify";

const safe = DOMPurify.sanitize(htmlFromServer);
return <div dangerouslySetInnerHTML={{ __html: safe }} />;
```

> 서버에서 이미 새니타이즈했더라도 클라이언트에서 한 번 더 통과시키는 것이 안전.

## 라우팅 / 미들웨어 영향

신규 페이지를 만들 때 다음을 점검:

| 상황 | 처리 |
|---|---|
| 비로그인 접근 가능해야 함 (예: 정책 페이지) | `feature-planner`에게 미들웨어 STATIC_PATHS 추가 요청 |
| 로그인 필요, 캐릭터 없는 사용자도 접근 | onboarding 분기 영향 검토 요청 |
| 로그인 + 캐릭터 있음만 | 기본 — 미들웨어 변경 불필요 |

## 로딩/대기 패턴

기존 컴포넌트 재사용:
- `<GachaMachine>` — 결과 생성 중 풀스크린
- `<GachaCapsuleOpen>` — 캡슐 열림 효과
- `<GachaLeverPull>` — 결제 직후 레버 인터랙션

새로 만들지 말고 props로 커스터마이즈한다.

## 캘린더 / 스킬트리

- 캘린더는 `DailyCalendar.module.css`가 선례. Tailwind로 안 되는 부분은 CSS Module 사용.
- 스킬트리는 `<SkillTree>` 재사용. 신규 노드 추가는 props로.

## 변경 요약 (`05_ui_changes.md`) 템플릿

```markdown
# UI 변경 요약: {기능명}

## 신규/수정 페이지
| 경로 | 인증 요구 | 사용 API | 사용 컴포넌트 |
|---|---|---|---|
| /foo | 로그인 + 캐릭터 | POST /api/foo | PixelFrame, PixelButton |

## 신규/수정 컴포넌트
| 파일 | 역할 | 재사용 가능 여부 |
|---|---|---|

## 미들웨어 영향
- {STATIC_PATHS 추가 필요 여부}
- {라우터 정책 표 영향}

## CSS 우선순위 준수
- 인라인 스타일 0개
- {Tailwind / CSS Module / globals.css} 사용 분포

## 후속 작업 요청
- integration-qa: 페이지 회귀 + 시각적 점검
```

## 자주 하는 실수 (피할 것)

- ❌ `style={{ color: "#9a7040" }}` → ✅ `className="text-[#9a7040]"` 또는 globals.css 클래스
- ❌ `rounded-md` 같은 둥근 모서리 → ✅ `rounded-none` 또는 명시 안 함
- ❌ 새로운 버튼 컴포넌트 작성 → ✅ `<PixelButton>` props 확장
- ❌ AI HTML을 그대로 렌더링 → ✅ DOMPurify 통과 후
- ❌ 새 폰트 import → ✅ NeoDungGeunMo / Noto Sans KR 두 가지만 사용
- ❌ "운세 보기" 같은 올드 CTA → ✅ "운명 캡슐 뽑기 — 990원"
