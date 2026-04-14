# 작업 완료 요약 — 2026-04-10

## 전체 진행률: ~95% → 기본 플로우 1사이클 동작 확인

---

## 완료된 태스크

### Task 01: Toss Payments 연동
- Stripe → Toss Payments 교체 (일회성, 빌링키 구독, 웹훅, 월별 자동결제 크론)
- 📄 `docs/task-01-toss-payments.md`

### Task 02: 종합 운세 프롬프트 개선
- 7섹션 → 12섹션 (김창욱 사주해설 퀄리티), Sonnet 모델 + 8192 토큰
- 📄 `docs/task-02-prompt-enhancement.md`

### Task 03: UI 페이지 (랜딩/등록/결제)
- 랜딩, 등록, 결제 페이지 + 다크 우주 테마
- 📄 `docs/task-03-ui-pages.md`

### Task 04: OAuth 소셜 로그인 + 인증 인프라
- 카카오/네이버/구글 OAuth, JWT HttpOnly Cookie, 미들웨어
- 📄 `docs/task-04-oauth-auth.md`

### Task 05: 로그인 + 온보딩 + 대시보드 UI
- 소셜 로그인, 생년월일 온보딩, 마이페이지
- 📄 `docs/task-05-ui-auth-pages.md`

### 버그 수정 (세션 중 해결)
- 생년월일/출생시간 → 커스텀 드롭다운 (Safari 호환)
- `type="tel"` → `type="text"` + `inputmode="numeric"` (패턴 에러 해결)
- 전화번호 중복 시 기존 계정 반환
- SQLite 마이그레이션 문법 수정 (IF NOT EXISTS, ALTER COLUMN)
- Hono 라우트 매칭 순서 (`/me`를 `/:provider` 위로)
- birth-info 완료 시 JWT 갱신 누락 수정
- `claude-opus-4-6-20250514` → `claude-sonnet-4-20250514` 모델 수정
- users 테이블 phone/birth 필드 nullable 변환 (테이블 재생성)

---

## 동작 확인된 전체 플로우

```
1. 랜딩(/) → "시작하기"
2. /login → "카카오로 시작하기" 클릭
3. 카카오 OAuth 인증 → /auth/kakao/callback → JWT 쿠키 설정
4. /onboarding → 생년월일/시간/도시/성별 입력 → 차트 생성 + JWT 갱신
5. /payment → 결제하기 → POST /api/readings/comprehensive → Claude AI 종합풀이 생성
6. 결과 HTML 페이지 표시 (사주+자미두수+서양점성 교차분석)
7. /dashboard → 내 풀이 목록, 구독 관리
```

---

## 다음 세션에서 할 일

### 높음
| 항목 | 설명 |
|------|------|
| 네이버 OAuth 설정 | 네이버 개발자 콘솔 앱 등록 → .env에 키 추가 |
| 구글 OAuth 설정 | Google Cloud Console 앱 등록 → .env에 키 추가 |
| Toss 실제 연동 | Toss 가맹점 등록 → .env에 실제 키 + payment.html에 SDK 로드 |

### 중간
| 항목 | 설명 |
|------|------|
| 대시보드 API 구현 | GET /api/dashboard/readings, /subscription, /payments 엔드포인트 |
| register.html 정리 | /login으로 리다이렉트 또는 제거 |
| 종합풀이 품질 테스트 | 프롬프트 12섹션이 잘 생성되는지 실제 결과 검토 |
| Git 초기화 | git init + .gitignore 확인 + 초기 커밋 |

### 낮음
| 항목 | 설명 |
|------|------|
| 프로덕션 배포 | PM2/systemd + HTTPS + 도메인 설정 |
| 에러 처리 강화 | 전역 에러 핸들러, 사용자 친화적 에러 페이지 |
| 모니터링 | 로그 수집, 결제 알림 |

---

## 환경 설정 현황

| 키 | 상태 |
|----|------|
| ANTHROPIC_API_KEY | ✅ 설정됨 |
| KAKAO_CLIENT_ID | ✅ 설정됨 |
| KAKAO_CLIENT_SECRET | ✅ 설정됨 |
| JWT_SECRET | ✅ 설정됨 |
| BASE_URL | ✅ http://localhost:3000 |
| NAVER_CLIENT_ID/SECRET | ❌ 미설정 |
| GOOGLE_CLIENT_ID/SECRET | ❌ 미설정 |
| TOSS_SECRET_KEY/CLIENT_KEY | ⚠️ placeholder |

---

## 서버 실행 방법

```bash
cd /Users/kyun/Desktop/project/fortune_imgessage
npx tsx src/index.ts
# http://localhost:3000
```

## DB 마이그레이션 (최초 또는 스키마 변경 시)

```bash
npx tsx scripts/migrate-toss.ts
npx tsx scripts/migrate-auth.ts
```
