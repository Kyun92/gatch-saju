-- ============================================================
-- 갓챠사주 — Supabase PostgreSQL Schema
-- ============================================================

-- Users (NextAuth fields only — fortune profile moved to characters)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT,
  email         TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Accounts (NextAuth OAuth)
CREATE TABLE IF NOT EXISTS accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                TEXT NOT NULL,
  provider            TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          INTEGER,
  token_type          TEXT,
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT,
  UNIQUE (provider, provider_account_id)
);

-- Sessions (NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires       TIMESTAMPTZ NOT NULL
);

-- Verification tokens (NextAuth)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Characters (1:N per user — fortune profile + birth info)
CREATE TABLE IF NOT EXISTS characters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  birth_date  DATE NOT NULL,
  birth_time  TIME NOT NULL DEFAULT '12:00',
  birth_city  TEXT NOT NULL DEFAULT '서울',
  birth_lat   DOUBLE PRECISION,
  birth_lng   DOUBLE PRECISION,
  gender      TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  timezone    TEXT DEFAULT 'Asia/Seoul',
  mbti        TEXT CHECK (mbti IS NULL OR mbti IN (
    'INTJ','INTP','ENTJ','ENTP',
    'INFJ','INFP','ENFJ','ENFP',
    'ISTJ','ISFJ','ESTJ','ESFJ',
    'ISTP','ISFP','ESTP','ESFP'
  )),
  is_self     BOOLEAN NOT NULL DEFAULT TRUE,
  unlocked    BOOLEAN NOT NULL DEFAULT FALSE,
  free_stat_scores JSONB,
  free_summary TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Charts (JSONB, one per character+type)
CREATE TABLE IF NOT EXISTS charts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('saju', 'ziwei', 'western')),
  data         JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (character_id, type)
);

-- Readings (fortune readings with payment status)
CREATE TABLE IF NOT EXISTS readings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  character_id_2  UUID REFERENCES characters(id) ON DELETE SET NULL,
  type            TEXT NOT NULL DEFAULT 'comprehensive',
  year            INTEGER,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'generating', 'complete', 'error')),
  content         TEXT,
  stat_scores     JSONB,
  character_title TEXT,
  charts_data     JSONB,
  tokens_used     INTEGER,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payment log (user_id retained for payment owner tracking)
CREATE TABLE IF NOT EXISTS payment_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id   UUID REFERENCES readings(id) ON DELETE SET NULL,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  amount       INTEGER NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'KRW',
  provider     TEXT NOT NULL DEFAULT 'toss',
  payment_key  TEXT,
  order_id     TEXT UNIQUE,
  order_name   TEXT,
  method       TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'fail', 'cancelled')),
  approved_at  TIMESTAMPTZ,
  raw          JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_character_id ON charts(character_id);
CREATE INDEX IF NOT EXISTS idx_readings_character_id ON readings(character_id);
CREATE INDEX IF NOT EXISTS idx_payment_log_user_id ON payment_log(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_log_character_id ON payment_log(character_id);
CREATE INDEX IF NOT EXISTS idx_payment_log_reading_id ON payment_log(reading_id);

-- "1메인(본인) + N타인" 정체성: user당 본인 캐릭터(is_self=true)는 1명만.
-- onboarding/actions.ts의 silent 가드와 함께 이중 방어.
CREATE UNIQUE INDEX IF NOT EXISTS idx_characters_user_self_unique
  ON characters(user_id)
  WHERE is_self = TRUE;

-- ============================================================
-- Credit Wallet (Coins) — 2026-04 추가
-- Credit Wallet 모델: users.coins 잔액 + coin_transactions 이력
-- ============================================================

-- users: 코인 잔액 (CHECK로 음수 차단)
ALTER TABLE users ADD COLUMN IF NOT EXISTS coins INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_coins_nonneg;
ALTER TABLE users ADD CONSTRAINT users_coins_nonneg CHECK (coins >= 0);

-- 코인 이력: 충전(+N) / 차감(-1) / 환불(-N)
CREATE TABLE IF NOT EXISTS coin_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta           INTEGER NOT NULL CHECK (delta <> 0),
  reason          TEXT NOT NULL CHECK (reason IN ('purchase','spend','refund')),
  payment_log_id  UUID REFERENCES payment_log(id) ON DELETE SET NULL,
  reading_id      UUID REFERENCES readings(id) ON DELETE SET NULL,
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- payment_log: 코인 충전 결제임을 명시
ALTER TABLE payment_log ADD COLUMN IF NOT EXISTS coin_quantity INTEGER;
ALTER TABLE payment_log ADD COLUMN IF NOT EXISTS package_id TEXT;

-- readings: 소비된 코인 트랜잭션 연결
ALTER TABLE readings ADD COLUMN IF NOT EXISTS coin_transaction_id UUID REFERENCES coin_transactions(id) ON DELETE SET NULL;

-- 코인 이력 인덱스
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON coin_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_payment_log ON coin_transactions(payment_log_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_reading ON coin_transactions(reading_id);
CREATE INDEX IF NOT EXISTS idx_readings_coin_tx ON readings(coin_transaction_id);

-- Atomic 코인 증감 (음수 잔액 차단)
-- p_delta > 0 (충전), < 0 (차감/환불)
-- 잔액 부족 시 'insufficient_coins' 예외
CREATE OR REPLACE FUNCTION adjust_user_coins(
  p_user_id UUID,
  p_delta   INTEGER
) RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE users
     SET coins      = coins + p_delta,
         updated_at = now()
   WHERE id = p_user_id
     AND coins + p_delta >= 0
  RETURNING coins INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'insufficient_coins';
  END IF;

  RETURN v_new_balance;
END;
$$;
