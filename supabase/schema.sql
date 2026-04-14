-- ============================================================
-- 천명 — Supabase PostgreSQL Schema
-- ============================================================

-- Users (NextAuth fields + fortune profile)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT,
  email         TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image         TEXT,
  -- Fortune profile fields
  birth_date    DATE,
  birth_time    TIME,
  birth_city    TEXT,
  birth_lat     DOUBLE PRECISION,
  birth_lng     DOUBLE PRECISION,
  gender        TEXT CHECK (gender IN ('male', 'female')),
  timezone      TEXT DEFAULT 'Asia/Seoul',
  mbti          TEXT CHECK (mbti IS NULL OR mbti IN (
    'INTJ','INTP','ENTJ','ENTP',
    'INFJ','INFP','ENFJ','ENFP',
    'ISTJ','ISFJ','ESTJ','ESFJ',
    'ISTP','ISFP','ESTP','ESFP'
  )),
  profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
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

-- Charts (JSONB, one per user+type)
CREATE TABLE IF NOT EXISTS charts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('saju', 'ziwei', 'western')),
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, type)
);

-- Readings (fortune readings with payment status)
CREATE TABLE IF NOT EXISTS readings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL DEFAULT 'comprehensive',
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

-- Payment log
CREATE TABLE IF NOT EXISTS payment_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id  UUID REFERENCES readings(id) ON DELETE SET NULL,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'KRW',
  provider    TEXT NOT NULL DEFAULT 'toss',
  payment_key TEXT,
  order_id    TEXT UNIQUE,
  order_name  TEXT,
  method      TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'fail', 'cancelled')),
  approved_at TIMESTAMPTZ,
  raw         JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_log_user_id ON payment_log(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_log_reading_id ON payment_log(reading_id);
