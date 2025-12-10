# Database Indexes for Performance Optimization

## Overview
This document describes the database indexes that should be applied to optimize API query performance.

## Indexes to Apply

The SQL migration file `cms/prisma/migrations/add_performance_indexes.sql` contains the following indexes:

### Experience Table
1. **idx_experience_start_date** - Index on `start_date DESC`
   - Used for: `ORDER BY e.start_date DESC` in experience queries
   - Improves: Sorting performance for experience list

2. **idx_experience_created_at** - Index on `created_at DESC`
   - Used for: `ORDER BY created_at DESC` if needed
   - Improves: Sorting by creation date

### Experience Bullets Table
3. **idx_experience_bullets_experience_id** - Index on `experience_id`
   - Used for: `LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id`
   - Improves: JOIN performance when fetching experience with bullets

### Projects Table
4. **idx_projects_created_at** - Index on `created_at DESC`
   - Used for: `ORDER BY created_at DESC` in projects queries
   - Improves: Sorting performance for projects list

## How to Apply Indexes

### Option 1: Using Supabase SQL Editor (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `cms/prisma/migrations/add_performance_indexes.sql`
4. Paste and execute the SQL in the SQL Editor
5. Verify indexes were created by running:
   ```sql
   SELECT indexname, tablename 
   FROM pg_indexes 
   WHERE schemaname = 'public' 
   AND indexname LIKE 'idx_%';
   ```

### Option 2: Using psql Command Line
```bash
psql $DATABASE_URL -f cms/prisma/migrations/add_performance_indexes.sql
```

## Verifying Indexes

After applying indexes, verify they exist:

```sql
-- List all performance indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

## Expected Performance Impact

- **Simple GET requests**: Should reduce query time from 500ms+ to <200ms
- **Complex queries (experience with JOIN)**: Should reduce from 1s+ to <300ms
- **ORDER BY operations**: Should be significantly faster with indexes

## Notes

- Indexes are automatically used by PostgreSQL query planner when appropriate
- Indexes add minimal overhead for INSERT/UPDATE operations
- Indexes are automatically maintained by PostgreSQL
- If indexes are not applied, queries will still work but will be slower

## Troubleshooting

If queries are still slow after applying indexes:

1. **Verify indexes exist**: Run the verification query above
2. **Check query execution plan**: Use `EXPLAIN ANALYZE` in Supabase SQL Editor
3. **Ensure indexes are being used**: Look for "Index Scan" in the execution plan
4. **Check for table statistics**: Run `ANALYZE` on tables if needed:
   ```sql
   ANALYZE public.experience;
   ANALYZE public.experience_bullets;
   ANALYZE public.projects;
   ```

