# Vercel 환경변수 설정 가이드

갓챠사주 프로덕션 배포에 필요한 환경변수와 각 값의 **발급처** · **등록 절차**.

---

## 1. 등록 경로

### A. 프로젝트 Import 중 (권장 — 첫 배포 전 한 번에)
1. https://vercel.com/dashboard → **Add New Project**
2. `Kyun92/gatch-saju` Import
3. **Configure Project** 화면 하단 **Environment Variables** 섹션 펼치기
4. `.env.vercel.example` 내용 복사 → **"Paste .env"** 로 한 번에 붙여넣기
   (또는 Key/Value 하나씩 Add)
5. **Deploy** 클릭

### B. 이후 수정 (Settings 경로)
1. Vercel 대시보드 → 프로젝트 클릭
2. 상단 탭 **Settings** → 좌측 **Environment Variables**
3. Key/Value 입력 → 환경 선택 (**Production / Preview / Development 셋 다 체크**)
4. **Save** → 반영하려면 **Redeploy** 필요

### C. CLI
```bash
vercel env add NEXTAUTH_SECRET production
# 프롬프트로 값 입력
```

---

## 2. 변수 목록과 발급처

| 변수 | 발급처 | 비고 |
|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → **API** → Project URL | `https://xxxxx.supabase.co` 형식 |
| `SUPABASE_SERVICE_ROLE_KEY` | 동일 화면 → `service_role` secret | ⚠ 절대 클라이언트 노출 금지 |
| `NEXTAUTH_SECRET` | 터미널 `openssl rand -base64 32` | 로컬/프로덕션 다르게 써도 됨 |
| `NEXTAUTH_URL` | 배포 도메인 | 예: `https://gatch-saju.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 | `NEXTAUTH_URL`과 동일 값 |
| `KAKAO_CLIENT_ID` | [카카오 개발자](https://developers.kakao.com) → 내 애플리케이션 → 앱 설정 → **REST API 키** | |
| `KAKAO_CLIENT_SECRET` | 동일 콘솔 → 제품 설정 → **카카오 로그인** → Client Secret 코드 | 미발급 상태면 '설정' → 코드 생성 + '사용함' 체크 |
| `NAVER_CLIENT_ID` | [네이버 개발자센터](https://developers.naver.com/apps) → 애플리케이션 등록 → **Client ID** | API 권한: '네이버 로그인' 추가 |
| `NAVER_CLIENT_SECRET` | 동일 콘솔 → **Client Secret** | |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → 사용자 인증 정보 만들기 → **OAuth 2.0 클라이언트 ID** | 애플리케이션 유형: 웹 |
| `GOOGLE_CLIENT_SECRET` | 동일 콘솔 → 클라이언트 시크릿 | |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) → Create API Key | |
| `TOSS_SECRET_KEY` | [토스페이먼츠 개발자센터](https://developers.tosspayments.com) → 내 개발 → **시크릿 키** | 라이브 키 발급까지 심사 통과 후 가능, 초기는 테스트 키로 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 동일 콘솔 → **클라이언트 키** | |

---

## 3. 도메인 변수 처리

`NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL`은 **배포 도메인 확정 후** 맞춰야 한다.

- Vercel이 자동 할당하는 기본 도메인: Settings → Domains 에서 확인
  - 예: `https://gatch-saju.vercel.app`
- 커스텀 도메인 연결 시: 해당 도메인으로 업데이트 + **Redeploy** 필요

**권장 절차**
1. 일단 기본 Vercel 도메인으로 배포 성공시킨 뒤
2. 도메인 확정되면 두 변수 수정 → Redeploy
3. 동시에 카카오 콘솔 Redirect URI 도 업데이트

---

## 4. OAuth 후속 작업 (3개 Provider)

환경변수 등록과 별개로 **각 Provider 콘솔**에서 Redirect URI 허용 목록에 프로덕션 URL을 추가해야 로그인이 동작한다.

### 카카오
- 콘솔 → 내 애플리케이션 → 제품 설정 → **카카오 로그인** → 활성화 ON
- Redirect URI: `https://{배포도메인}/api/auth/callback/kakao`

### 네이버
- [네이버 개발자센터](https://developers.naver.com/apps) → 애플리케이션 등록
- 사용 API: '네이버 로그인' 체크
- 서비스 환경: PC 웹
- 서비스 URL: `https://{배포도메인}`
- Callback URL: `https://{배포도메인}/api/auth/callback/naver`

### 구글
- [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → 사용자 인증 정보 만들기 → OAuth 2.0 클라이언트 ID
- 애플리케이션 유형: 웹
- 승인된 리디렉션 URI: `https://{배포도메인}/api/auth/callback/google`
- (선택) 승인된 자바스크립트 출처: `https://{배포도메인}`

> 커스텀 도메인 사용 시 **두 개 모두** 등록 (vercel.app + 커스텀) 해두면 안전.

### Provider 가드 (코드)
`lib/auth.ts`는 env가 누락된 Provider를 자동으로 등록하지 않는다. NAVER/GOOGLE env가 비어 있으면 해당 버튼은 클릭 시 NextAuth 에러가 나므로, Provider 활성화 전엔 외부 콘솔 등록 + env 주입을 먼저 끝내야 한다.

---

## 5. 등록 금지 변수 (중요)

### ❌ `USE_MOCK_READINGS`
- 로컬 개발용 플래그. 프로덕션 env에 절대 넣지 말 것.
- 코드상 `NODE_ENV === "production"`일 때 강제 false safeguard가 있지만 **이중 방어**.
- 실수로 등록될 경우 결제는 정상이나 감정 생성이 mock 데이터로 돌아가 참사.

### ✅ `NAVER_*`, `GOOGLE_*` (활성화됨 — 2026-04-29)
- UI 활성화 완료. env 누락 시 코드 측에서 Provider 미등록 (런타임 에러 X).
- env 주입 + 외부 콘솔 Redirect URI 등록 후 정상 동작.

---

## 6. 검증

배포 완료 후:

```bash
# Vercel 함수 로그에서 env 누락 에러가 없는지
# Dashboard → Logs → Functions 탭
```

- `/landing` 열림 → 배포 성공
- 카카오 로그인 → 콜백 성공 → 온보딩 진입
- `/coins` 패키지 클릭 → Toss 결제창 → 테스트 카드 결제 → 잔액 증가 확인

하나라도 실패하면 **Vercel Logs**에서 관련 env 변수 이름이 에러 메시지에 나오는지 확인.

---

## 7. 코드 점검 결과 (2026-04-28)

### 환경변수 매트릭스 (14종)

| 변수 | 노출 범위 | 등록 필수 | 사용처 |
|------|---------|---------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 클라이언트 | ✅ | `lib/supabase/server.ts` |
| `NEXT_PUBLIC_SITE_URL` | 클라이언트 | ✅ | `app/sitemap.ts` |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 클라이언트 | ✅ | `coins/CoinsClient.tsx` |
| `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용** | ✅ | `lib/supabase/server.ts` |
| `NEXTAUTH_SECRET` | **서버 전용** | ✅ | NextAuth 자동 |
| `NEXTAUTH_URL` | **서버 전용** | ✅ | NextAuth 자동 |
| `KAKAO_CLIENT_ID` | **서버 전용** | ✅ | `lib/auth.ts` |
| `KAKAO_CLIENT_SECRET` | **서버 전용** | ✅ | `lib/auth.ts` |
| `NAVER_CLIENT_ID` | **서버 전용** | ✅ | `lib/auth.ts` (조건부 Provider 등록 — env 누락 시 미등록) |
| `NAVER_CLIENT_SECRET` | **서버 전용** | ✅ | 동일 |
| `GOOGLE_CLIENT_ID` | **서버 전용** | ✅ | `lib/auth.ts` (조건부 Provider 등록 — env 누락 시 미등록) |
| `GOOGLE_CLIENT_SECRET` | **서버 전용** | ✅ | 동일 |
| `GEMINI_API_KEY` | **서버 전용** | ✅ | `lib/ai/gemini.ts`, `stat-scorer.ts`, `free-stat-scorer.ts` |
| `TOSS_SECRET_KEY` | **서버 전용** | ✅ | `lib/payments/toss.ts` |
| `USE_MOCK_READINGS` | **dev only** | ❌ | `lib/reading/generate-reading.ts` (production 강제 false 가드) |
| `NODE_ENV` | (자동) | — | Vercel 자동 |

### 안전 점검 결과

- ✅ `SUPABASE_SERVICE_ROLE_KEY` 사용처: `lib/supabase/server.ts` 1곳 (서버 사이드만, `"use client"` 컴포넌트에서 import 0)
- ✅ `USE_MOCK_READINGS` production 가드: `process.env.NODE_ENV !== "production" && ...` 이중 방어
- ✅ `/dev`, `/api/dev` production 리다이렉트 (`middleware.ts:24`)
- ✅ TypeScript strict 모드 빌드 통과
- ✅ Production build (`next build`) PASS — 39 페이지 정상

---

## 8. 배포 단계별 실행 체크리스트

### Step 1. 사전 검증 (로컬)
- [x] `npx tsc --noEmit` PASS
- [x] `npm run build` PASS
- [ ] `.env.local` 값들이 모두 채워져 있는지 (로컬 테스트 통과 확인)

### Step 2. Vercel 프로젝트 Import
- [ ] https://vercel.com/dashboard → Add New Project → `Kyun92/gatch-saju`
- [ ] Framework: Next.js 자동 감지 확인
- [ ] Build Command: `next build` (기본값)
- [ ] Output Directory: `.next` (기본값)

### Step 3. 환경변수 등록 (Step 2 진행 중)
- [ ] §7 매트릭스 14개 모두 등록 (NAVER/GOOGLE은 더미 값이라도)
- [ ] `USE_MOCK_READINGS`는 **절대 등록 금지**
- [ ] 환경 선택: Production / Preview / Development 모두 체크

### Step 4. 첫 배포
- [ ] Deploy 클릭 → 빌드 로그 확인
- [ ] Functions 로그에 env 누락 에러 없는지 확인
- [ ] 임시 도메인(`*.vercel.app`)에서 `/landing` 열림 확인

### Step 5. 커스텀 도메인 연결
- [ ] Settings → Domains → `gatch-saju.onato.co.kr` 추가
- [ ] DNS 레코드(Vercel이 안내) 적용
- [ ] SSL 자동 발급 확인
- [ ] `NEXTAUTH_URL` + `NEXT_PUBLIC_SITE_URL` 갱신 → Redeploy

### Step 6. 카카오 OAuth Redirect URI 등록
- [ ] 카카오 콘솔 → 카카오 로그인 → Redirect URI 추가:
  - `https://gatch-saju.onato.co.kr/api/auth/callback/kakao`
  - `https://{vercel-default-domain}/api/auth/callback/kakao` (백업)

### Step 7. Toss 결제 환경 점검
- [ ] Toss 콘솔에서 `successUrl` / `failUrl` 도메인 화이트리스트 확인
  - `successUrl`: `https://gatch-saju.onato.co.kr/coins/success`
  - `failUrl`: `https://gatch-saju.onato.co.kr/coins/fail`
- [ ] 실 라이브 키 발급 전까지는 테스트 키 사용

### Step 8. Smoke Test (프로덕션 도메인)
- [ ] `/landing` — 비로그인 마케팅 페이지 정상
- [ ] `/login` → 카카오 로그인 → 콜백 성공 → `/onboarding` 진입
- [ ] 캐릭터 생성 (본인) → 허브 진입 → 본인 슬롯에 골드 라이닝 + "나" 배지 보이는지
- [ ] `/mypage` → OAuth 이미지 자리에 본인 캐릭터 아바타가 표시되는지
- [ ] `/coins` → 패키지 클릭 → Toss 창 → 테스트 카드 결제 → 잔액 증가 확인
- [ ] `/reading/preview` → 종합감정 캡슐 뽑기 → generating 페이지 → 결과 정상
- [ ] `/daily` → 일일운세 → 5섹션 분리 + 오늘의 점수 라벨 정상

### Step 9. 사후 점검
- [ ] Vercel Analytics 활성화 (선택)
- [ ] Sentry 또는 로그 모니터링 도구 연결 (선택)
- [ ] `/dev`, `/api/dev` 접근 시 `/`로 리다이렉트 확인 (보안)

---

## 9. 자주 발생하는 배포 에러

| 증상 | 원인 | 조치 |
|---|---|---|
| `MissingSecretError` | `NEXTAUTH_SECRET` 미등록 | env에 추가 후 Redeploy |
| `Failed to fetch dynamic import` (NAVER/GOOGLE) | NAVER/GOOGLE env 누락 | 더미 값이라도 등록 (UI에서 비활성 상태라도 코드 import 시 필요) |
| 카카오 로그인 후 콜백 실패 | Redirect URI 미등록 | 카카오 콘솔에서 프로덕션 URL 추가 |
| Toss 결제창 미열림 | `NEXT_PUBLIC_TOSS_CLIENT_KEY` 누락/오타 | env 재확인 + Redeploy |
| 결제 후 mock 데이터 노출 | `USE_MOCK_READINGS=true` 잘못 등록 | env 삭제 + Redeploy (있으면 절대 금물) |
