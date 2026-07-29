/*
# Placement Tracker — 55-Day SDE Prep Schema

1. New Tables
- `problem_attempts`: Tracks each DSA problem attempt (time, accuracy, status)
- `study_sessions`: Tracks time spent on each study block per day
- `focus_logs`: Camera-based focus tracking data (focused minutes, distracted, away)
- `weak_topics`: User-marked weak topics with reminder scheduling
- `daily_notes`: Per-day notes and reflections

2. Security
- Single-tenant app (no sign-in). All tables allow anon + authenticated CRUD.
- RLS enabled on all tables with permissive policies for anon access.
*/

-- Problem attempts table
CREATE TABLE IF NOT EXISTS problem_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL,
  problem_title text NOT NULL,
  problem_topic text NOT NULL,
  difficulty text DEFAULT 'Medium',
  status text DEFAULT 'unsolved',
  time_spent_seconds integer DEFAULT 0,
  accuracy real DEFAULT 0,
  code_content text DEFAULT '',
  language text DEFAULT 'cpp',
  solved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_problem_attempts" ON problem_attempts;
CREATE POLICY "anon_select_problem_attempts" ON problem_attempts FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_problem_attempts" ON problem_attempts;
CREATE POLICY "anon_insert_problem_attempts" ON problem_attempts FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_problem_attempts" ON problem_attempts;
CREATE POLICY "anon_update_problem_attempts" ON problem_attempts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_problem_attempts" ON problem_attempts;
CREATE POLICY "anon_delete_problem_attempts" ON problem_attempts FOR DELETE
  TO anon, authenticated USING (true);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL,
  block_name text NOT NULL,
  topic text NOT NULL,
  planned_duration_minutes integer DEFAULT 0,
  actual_duration_seconds integer DEFAULT 0,
  started_at timestamptz,
  ended_at timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_study_sessions" ON study_sessions;
CREATE POLICY "anon_select_study_sessions" ON study_sessions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_study_sessions" ON study_sessions;
CREATE POLICY "anon_insert_study_sessions" ON study_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_study_sessions" ON study_sessions;
CREATE POLICY "anon_update_study_sessions" ON study_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_study_sessions" ON study_sessions;
CREATE POLICY "anon_delete_study_sessions" ON study_sessions FOR DELETE
  TO anon, authenticated USING (true);

-- Focus logs table (camera-based AI tracking)
CREATE TABLE IF NOT EXISTS focus_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL,
  session_start timestamptz,
  session_end timestamptz,
  total_seconds integer DEFAULT 0,
  focused_seconds integer DEFAULT 0,
  distracted_seconds integer DEFAULT 0,
  away_seconds integer DEFAULT 0,
  focus_score real DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE focus_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_focus_logs" ON focus_logs;
CREATE POLICY "anon_select_focus_logs" ON focus_logs FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_focus_logs" ON focus_logs;
CREATE POLICY "anon_insert_focus_logs" ON focus_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_focus_logs" ON focus_logs;
CREATE POLICY "anon_update_focus_logs" ON focus_logs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_focus_logs" ON focus_logs;
CREATE POLICY "anon_delete_focus_logs" ON focus_logs FOR DELETE
  TO anon, authenticated USING (true);

-- Weak topics table
CREATE TABLE IF NOT EXISTS weak_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_name text NOT NULL,
  topic_category text DEFAULT 'DSA',
  notes text DEFAULT '',
  severity text DEFAULT 'medium',
  reminder_enabled boolean DEFAULT true,
  last_reminded timestamptz,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weak_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_weak_topics" ON weak_topics;
CREATE POLICY "anon_select_weak_topics" ON weak_topics FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_weak_topics" ON weak_topics;
CREATE POLICY "anon_insert_weak_topics" ON weak_topics FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_weak_topics" ON weak_topics;
CREATE POLICY "anon_update_weak_topics" ON weak_topics FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_weak_topics" ON weak_topics;
CREATE POLICY "anon_delete_weak_topics" ON weak_topics FOR DELETE
  TO anon, authenticated USING (true);

-- Daily notes table
CREATE TABLE IF NOT EXISTS daily_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL UNIQUE,
  note_text text DEFAULT '',
  energy_level integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_daily_notes" ON daily_notes;
CREATE POLICY "anon_select_daily_notes" ON daily_notes FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_daily_notes" ON daily_notes;
CREATE POLICY "anon_insert_daily_notes" ON daily_notes FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_daily_notes" ON daily_notes;
CREATE POLICY "anon_update_daily_notes" ON daily_notes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_daily_notes" ON daily_notes;
CREATE POLICY "anon_delete_daily_notes" ON daily_notes FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_problem_attempts_day ON problem_attempts(day_number);
CREATE INDEX IF NOT EXISTS idx_study_sessions_day ON study_sessions(day_number);
CREATE INDEX IF NOT EXISTS idx_focus_logs_day ON focus_logs(day_number);
CREATE INDEX IF NOT EXISTS idx_weak_topics_resolved ON weak_topics(resolved);
