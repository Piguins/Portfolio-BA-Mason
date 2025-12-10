-- Performance optimization indexes
-- These indexes improve query performance for common operations

-- Experience table indexes
CREATE INDEX IF NOT EXISTS idx_experience_start_date ON public.experience(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_experience_created_at ON public.experience(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experience_bullets_experience_id ON public.experience_bullets(experience_id);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Specializations table indexes (id is already primary key, but ensure ordering)
-- No additional index needed as id is primary key

-- Hero section table indexes
-- No additional index needed as typically only one row

