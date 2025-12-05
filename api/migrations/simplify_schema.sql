-- Simplify Database Schema
-- Remove order_index and unnecessary fields
-- Make each section independent, no complex mappings

-- 1. Remove order_index from specializations
ALTER TABLE public.specializations DROP COLUMN IF EXISTS order_index;

-- 2. Remove order_index from experience
ALTER TABLE public.experience DROP COLUMN IF EXISTS order_index;

-- 3. Simplify projects table
-- Remove: slug, is_published, content, order_index, subtitle, external_url
-- Keep: title, summary, hero_image_url, case_study_url
-- Tags will be simple text array, not mapped table
ALTER TABLE public.projects DROP COLUMN IF EXISTS slug;
ALTER TABLE public.projects DROP COLUMN IF EXISTS is_published;
ALTER TABLE public.projects DROP COLUMN IF EXISTS content;
ALTER TABLE public.projects DROP COLUMN IF EXISTS order_index;
ALTER TABLE public.projects DROP COLUMN IF EXISTS subtitle;
ALTER TABLE public.projects DROP COLUMN IF EXISTS external_url;

-- Add tags_text column for simple array of tag names
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags_text TEXT[] DEFAULT '{}';

-- 4. Remove order_index from experience_bullets (bullets are just text, no ordering needed)
ALTER TABLE public.experience_bullets DROP COLUMN IF EXISTS order_index;

