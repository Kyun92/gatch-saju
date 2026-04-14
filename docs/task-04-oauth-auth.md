# Task 04: OAuth 소셜 로그인 + 인증 인프라

**상태:** 완료  
**완료 시각:** 2026-04-10  
**검증:** TypeScript 컴파일 통과 + DB 마이그레이션 성공

---

## 신규 파일

| 파일 | 용도 |
|------|------|
| `src/auth/jwt.ts` | JWT sign/verify (jose 라이브러리, 7일 만료) |
| `src/auth/middleware.ts` | requireAuth, requireProfile, optionalAuth 미들웨어 |
| `src/auth/providers/types.ts` | OAuthProfile 인터페이스 |
| `src/auth/providers/kakao.ts` | 카카오 OAuth (buildAuthUrl, exchangeCode, fetchProfile) |
| `src/auth/providers/naver.ts` | 네이버 OAuth |
| `src/auth/providers/google.ts` | 구글 OAuth |
| `src/api/routes/auth.ts` | OAuth 라우트 (로그인 리다이렉트, 콜백, /me, 로그아웃) |
| `scripts/migrate-auth.ts` | DB 마이그레이션 스크립트 |

## 수정 파일

| 파일 | 변경 |
|------|------|
| `src/db/schema.ts` | users 테이블 OAuth 컬럼 추가, phone nullable, oauthAccounts 테이블 |
| `src/config.ts` | JWT_SECRET, BASE_URL, OAuth 6개 키 |
| `src/api/router.ts` | /auth 라우트 마운트, /login /onboarding /dashboard 페이지, 미들웨어 적용 |
| `src/api/routes/chart.ts` | POST /api/profile/birth-info 추가 (OAuth 온보딩) |
| `src/api/routes/reading.ts` | userId를 JWT에서 추출 |
| `src/api/routes/payment.ts` | userId를 JWT에서 추출 |
| `src/scheduler/cron.ts` | phone null 가드 추가 |

## OAuth 플로우

```
GET /auth/kakao → 302 카카오 인증 → GET /auth/kakao/callback
→ code 교환 → 프로필 조회 → 유저 upsert → JWT 쿠키 설정
→ profileComplete ? /dashboard : /onboarding
```

## 운영 전 필요 작업

```env
JWT_SECRET=실제-시크릿-32자-이상
NAVER_CLIENT_ID=xxx
NAVER_CLIENT_SECRET=xxx
KAKAO_CLIENT_ID=xxx
KAKAO_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```
