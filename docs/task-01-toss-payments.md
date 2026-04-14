# Task 01: Toss Payments 연동 (Stripe 교체)

**상태:** 완료  
**완료 시각:** 2026-04-10  
**검증:** TypeScript 컴파일 통과 (tsc --noEmit, 0 errors)

---

## 변경 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/db/schema.ts` | stripeCustomerId/stripeSubscriptionId → tossCustomerKey/tossPaymentKey/tossBillingKey + amount/currency 추가, paymentLog 테이블 신규 |
| `src/config.ts` | TOSS_SECRET_KEY, TOSS_CLIENT_KEY, MONTHLY_BILLING_CRON 환경변수 추가 |
| `src/payments/toss.ts` | **신규** - Toss Payments API 클라이언트 (confirmPayment, issueBillingKey, executeBilling, cancelPayment) |
| `src/api/routes/payment.ts` | **신규** - 결제 승인, 빌링키 발급, 자동결제, 웹훅, 결제 내역 API |
| `src/api/router.ts` | paymentRoutes 등록 |
| `src/scheduler/cron.ts` | 월별 자동결제 크론 (runMonthlyBillingPipeline) 추가 |
| `scripts/migrate-toss.ts` | **신규** - DB 마이그레이션 스크립트 |

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/payments/confirm | 일회성 결제 승인 |
| POST | /api/payments/billing/issue | 빌링키 발급 + 구독 생성 |
| POST | /api/payments/billing/execute | 자동결제 실행 |
| POST | /api/payments/webhook | Toss 웹훅 수신 |
| GET | /api/payments/:userId/history | 결제 내역 조회 |

## 운영 전 필요 작업

1. `.env`에 키 설정:
   ```
   TOSS_SECRET_KEY=test_sk_xxxx
   TOSS_CLIENT_KEY=test_ck_xxxx
   ```
2. DB 마이그레이션 실행:
   ```bash
   npx tsx scripts/migrate-toss.ts
   ```
