-- ============================================
-- Supabase Database Setup
-- Run this in the Supabase SQL Editor
-- (Dashboard > SQL Editor > New query)
-- ============================================

-- 1. Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) <= 150),
  description TEXT NOT NULL CHECK (char_length(description) <= 1000),
  social_media_link TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create votes table (one vote per user per project)
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (project_id, user_id)
);

-- 3. Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for projects
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- 5. RLS Policies for votes
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own votes"
  ON votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM projects WHERE projects.id = project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Server-side function: get projects with vote counts
CREATE OR REPLACE FUNCTION get_projects_with_votes()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  social_media_link TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ,
  vote_count BIGINT
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    p.id, p.name, p.description, p.social_media_link, p.user_id, p.created_at,
    COUNT(v.id) AS vote_count
  FROM projects p
  LEFT JOIN votes v ON v.project_id = p.id
  GROUP BY p.id
  ORDER BY vote_count DESC, p.created_at ASC;
$$;

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_project_id ON votes(project_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
