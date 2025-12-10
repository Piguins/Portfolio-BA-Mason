-- Migration: Add i18n (Internationalization) support
-- Converts text fields to JSONB to support multiple languages (en, vi)
-- This migration preserves existing data by converting it to JSON format

-- ============================================
-- 1. Hero Content Table (hero_content)
-- ============================================
-- Convert text fields to JSONB with structure: {"en": "...", "vi": "..."}

-- Add new JSONB columns
ALTER TABLE public.hero_content 
ADD COLUMN IF NOT EXISTS greeting_i18n JSONB,
ADD COLUMN IF NOT EXISTS greeting_part2_i18n JSONB,
ADD COLUMN IF NOT EXISTS name_i18n JSONB,
ADD COLUMN IF NOT EXISTS title_i18n JSONB,
ADD COLUMN IF NOT EXISTS description_i18n JSONB;

-- Migrate existing data: Convert existing text to JSONB with 'en' as default
UPDATE public.hero_content
SET 
  greeting_i18n = jsonb_build_object('en', COALESCE(greeting, 'Hey!')),
  greeting_part2_i18n = jsonb_build_object('en', COALESCE(greeting_part2, 'I''m')),
  name_i18n = jsonb_build_object('en', COALESCE(name, 'Thế Kiệt (Mason)')),
  title_i18n = jsonb_build_object('en', COALESCE(title, 'Business Analyst')),
  description_i18n = CASE 
    WHEN description IS NOT NULL THEN jsonb_build_object('en', description)
    ELSE NULL
  END
WHERE greeting_i18n IS NULL;

-- ============================================
-- 2. Experience Table (experience)
-- ============================================
ALTER TABLE public.experience
ADD COLUMN IF NOT EXISTS company_i18n JSONB,
ADD COLUMN IF NOT EXISTS role_i18n JSONB,
ADD COLUMN IF NOT EXISTS location_i18n JSONB,
ADD COLUMN IF NOT EXISTS description_i18n JSONB;

-- Migrate existing data
UPDATE public.experience
SET 
  company_i18n = jsonb_build_object('en', company),
  role_i18n = jsonb_build_object('en', role),
  location_i18n = CASE 
    WHEN location IS NOT NULL THEN jsonb_build_object('en', location)
    ELSE NULL
  END,
  description_i18n = CASE 
    WHEN description IS NOT NULL THEN jsonb_build_object('en', description)
    ELSE NULL
  END
WHERE company_i18n IS NULL;

-- ============================================
-- 3. Projects Table (projects)
-- ============================================
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS title_i18n JSONB,
ADD COLUMN IF NOT EXISTS summary_i18n JSONB;

-- Migrate existing data
UPDATE public.projects
SET 
  title_i18n = jsonb_build_object('en', title),
  summary_i18n = CASE 
    WHEN summary IS NOT NULL THEN jsonb_build_object('en', summary)
    ELSE NULL
  END
WHERE title_i18n IS NULL;

-- ============================================
-- 4. Specializations Table (specializations)
-- ============================================
ALTER TABLE public.specializations
ADD COLUMN IF NOT EXISTS title_i18n JSONB,
ADD COLUMN IF NOT EXISTS description_i18n JSONB;

-- Migrate existing data
UPDATE public.specializations
SET 
  title_i18n = jsonb_build_object('en', title),
  description_i18n = CASE 
    WHEN description IS NOT NULL THEN jsonb_build_object('en', description)
    ELSE NULL
  END
WHERE title_i18n IS NULL;

-- ============================================
-- 5. Experience Bullets (experience_bullets)
-- ============================================
-- Bullets are stored as separate rows, so we'll add i18n to the text field
ALTER TABLE public.experience_bullets
ADD COLUMN IF NOT EXISTS text_i18n JSONB;

-- Migrate existing data
UPDATE public.experience_bullets
SET text_i18n = jsonb_build_object('en', text)
WHERE text_i18n IS NULL AND text IS NOT NULL;

-- ============================================
-- Notes:
-- ============================================
-- 1. Old columns (greeting, title, etc.) are kept for backward compatibility
-- 2. After verifying the migration works, you can drop old columns in a separate migration
-- 3. All new i18n fields are nullable to allow gradual migration
-- 4. Default language is 'en' (English) for all migrated data

