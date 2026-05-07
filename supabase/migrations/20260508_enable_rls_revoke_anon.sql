-- 2026-05-08: RLS 활성화 + anon/authenticated REVOKE
--
-- 목적: defense-in-depth. service_role 키 누출 시 1차 방어선 + 향후 anon key
-- 클라이언트 사용 도입 시 즉시 안전망 확보. Supabase Dashboard "RLS Disabled"
-- 경고 해소.
--
-- 안전성: 현재 코드는 service_role 단독 사용 → service_role은 RLS 우회.
-- 따라서 ENABLE만으로 애플리케이션 동작에 영향 없음.
--
-- 향후 정책 추가 시점:
--   - 클라이언트에서 supabase-js + anon key 직접 호출 도입할 때
--   - 그때 각 테이블에 SELECT/INSERT/UPDATE 정책 명시적으로 추가
--
-- 점검 쿼리 (적용 후):
--   SELECT schemaname, tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public' AND rowsecurity = false;
--   -- 0행이어야 함 (모든 사용자 데이터 테이블 RLS 활성)

-- 1) RLS ENABLE
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters          ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions   ENABLE ROW LEVEL SECURITY;

-- 2) anon/authenticated 권한 REVOKE
REVOKE ALL ON users, accounts, sessions, verification_tokens,
              characters, charts, readings, payment_log, coin_transactions
  FROM anon, authenticated;

-- 롤백:
--   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
--   -- (각 테이블 동일)
--   GRANT ALL ON users, accounts, ... TO anon, authenticated;
