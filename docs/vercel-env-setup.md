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

## 4. 카카오 OAuth 후속 작업

환경변수 등록과 별개로 **카카오 개발자 콘솔**에서 Redirect URI 허용 목록에 프로덕션 URL을 추가해야 로그인이 동작한다.

- 카카오 콘솔 → 내 애플리케이션 → 제품 설정 → **카카오 로그인** → 활성화 ON
- Redirect URI에 다음 추가:
  ```
  https://{배포도메인}/api/auth/callback/kakao
  ```
- 커스텀 도메인 사용 시 **두 개 모두** 등록 (vercel.app + 커스텀) 해두면 안전

---

## 5. 등록 금지 변수 (중요)

### ❌ `USE_MOCK_READINGS`
- 로컬 개발용 플래그. 프로덕션 env에 절대 넣지 말 것.
- 코드상 `NODE_ENV === "production"`일 때 강제 false safeguard가 있지만 **이중 방어**.
- 실수로 등록될 경우 결제는 정상이나 감정 생성이 mock 데이터로 돌아가 참사.

### ❌ `NAVER_*`, `GOOGLE_*`
- 현재 네이버/구글 로그인은 UI에서 "준비 중"으로 비활성화됨.
- 해당 키 등록 불필요. 나중에 활성화 시 카카오와 동일 절차로 추가.

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
