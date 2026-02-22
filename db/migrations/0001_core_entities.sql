-- Day 2 migration skeleton: core entities
-- PostgreSQL dialect

BEGIN;

-- Optional extension for UUID generation (choose one strategy across project)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gameplay_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  game_type TEXT NOT NULL,
  stakes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS hands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES gameplay_sessions(id) ON DELETE CASCADE,
  hand_number BIGINT,
  street TEXT NOT NULL DEFAULT 'preflop',
  pot_size INTEGER NOT NULL DEFAULT 0,
  result_bb NUMERIC(10,2),
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coach_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  hand_id UUID REFERENCES hands(id) ON DELETE SET NULL,
  suggested_action TEXT NOT NULL,
  confidence NUMERIC(4,3) NOT NULL,
  rationale JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hand_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hand_id UUID NOT NULL REFERENCES hands(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  mistakes JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  range_label TEXT NOT NULL,
  sessions_played INTEGER NOT NULL DEFAULT 0,
  hands_reviewed INTEGER NOT NULL DEFAULT 0,
  average_score NUMERIC(5,2),
  leak_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS domain_events (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  user_id UUID NOT NULL REFERENCES users(id),
  session_id UUID,
  hand_id UUID,
  occurred_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  correlation_id UUID,
  causation_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gameplay_sessions_user_id ON gameplay_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_hands_session_id ON hands(session_id);
CREATE INDEX IF NOT EXISTS idx_hand_reviews_user_id ON hand_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_snapshots_user_id ON progress_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_events_name_occurred_at ON domain_events(name, occurred_at DESC);

COMMIT;
