-- ============================================================
-- Evil Larry Cat Bot — Supabase SQL Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS elc_users (
  user_id         TEXT PRIMARY KEY,
  username        TEXT NOT NULL,
  avatar_url      TEXT,
  peenar_balance  INTEGER DEFAULT 1,
  stolen_peenar   INTEGER DEFAULT 0,   -- count of stolen (unoriginal) PEENARs available for chamber
  status          TEXT DEFAULT 'Normal', -- 'Normal' or 'Larrified'
  protection_active BOOLEAN DEFAULT FALSE,
  protection_expires_at TIMESTAMPTZ,
  last_steal_time TIMESTAMPTZ,
  evil_level      INTEGER DEFAULT 0,
  evil_points     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- DESTROYED PEENAR LOG TABLE
CREATE TABLE IF NOT EXISTS elc_destroyed_peenar (
  id                  SERIAL PRIMARY KEY,
  destroyed_by_user_id TEXT NOT NULL REFERENCES elc_users(user_id),
  original_owner_id   TEXT NOT NULL REFERENCES elc_users(user_id),
  destroyed_at        TIMESTAMPTZ DEFAULT NOW()
);

-- STEAL LOG TABLE (optional, for audit)
CREATE TABLE IF NOT EXISTS elc_steal_log (
  id              SERIAL PRIMARY KEY,
  attacker_id     TEXT NOT NULL REFERENCES elc_users(user_id),
  victim_id       TEXT NOT NULL REFERENCES elc_users(user_id),
  success         BOOLEAN,
  stolen_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (recommended for Supabase)
ALTER TABLE elc_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE elc_destroyed_peenar ENABLE ROW LEVEL SECURITY;
ALTER TABLE elc_steal_log ENABLE ROW LEVEL SECURITY;

-- Allow all operations via service role (bot uses anon key with full access)
CREATE POLICY "Allow all for service" ON elc_users FOR ALL USING (true);
CREATE POLICY "Allow all for service" ON elc_destroyed_peenar FOR ALL USING (true);
CREATE POLICY "Allow all for service" ON elc_steal_log FOR ALL USING (true);
