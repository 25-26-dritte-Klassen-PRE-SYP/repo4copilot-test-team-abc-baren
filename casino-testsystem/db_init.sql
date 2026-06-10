-- PostgreSQL initial schema for Casino Testsystem

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  current_balance NUMERIC(10, 2) NOT NULL DEFAULT 1000.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (username, current_balance)
VALUES ('guest', 1000.00)
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS blackjack_games (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL DEFAULT 1 REFERENCES users(id),
  player_name TEXT NOT NULL,
  bet_amount NUMERIC(10, 2) NOT NULL,
  player_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  dealer_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  deck_state JSONB NOT NULL DEFAULT '[]'::jsonb,
  player_score INTEGER NOT NULL DEFAULT 0,
  dealer_score INTEGER NOT NULL DEFAULT 0,
  game_status TEXT NOT NULL,
  result TEXT,
  user_balance_after NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Single-row application state table
CREATE TABLE IF NOT EXISTS app_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure a seed row exists (id = 1) to store global app state for clients without login
INSERT INTO app_state (id, state)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
