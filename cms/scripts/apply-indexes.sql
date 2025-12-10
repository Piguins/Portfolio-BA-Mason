-- Performance optimization indexes
-- Run this script in Supabase SQL Editor to improve API query performance
-- Expected improvement: 500ms+ queries -> <200ms

-- Experience table indexes
CREATE INDEX IF NOT EXISTS idx_experience_start_date ON public.experience(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_experience_created_at ON public.experience(created_at DESC);

-- Experience bullets table index (for JOIN performance)
CREATE INDEX IF NOT EXISTS idx_experience_bullets_experience_id ON public.experience_bullets(experience_id);

-- Projects table index
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Verify indexes were created
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

