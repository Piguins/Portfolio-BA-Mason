# Performance Optimization Scripts

## Quick Start

### 1. Apply Database Indexes (REQUIRED)

**Option A: Using Supabase SQL Editor (Recommended)**

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `apply-indexes.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Verify indexes were created by checking the output

**Option B: Using psql (Command Line)**

```bash
# Set your DATABASE_URL
export DATABASE_URL="your-supabase-connection-string"

# Run the script
psql $DATABASE_URL -f cms/scripts/apply-indexes.sql
```

**Verify Indexes Were Created:**

Run this query in Supabase SQL Editor:

```sql
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

You should see 4 indexes:
- `idx_experience_start_date`
- `idx_experience_created_at`
- `idx_experience_bullets_experience_id`
- `idx_projects_created_at`

### 2. Test API Performance

After Vercel deploys your changes, test the API performance:

```bash
# Make script executable (if not already)
chmod +x cms/scripts/test-api-performance.sh

# Run the test
./cms/scripts/test-api-performance.sh

# Or test with custom API URL
API_BASE_URL=https://admin.mason.id.vn ./cms/scripts/test-api-performance.sh
```

**Expected Results:**
- Health Check: <500ms
- Projects: <200ms
- Experience: <300ms
- Specializations: <200ms
- Hero: <200ms

**Note:** First request may be slower due to cold start. Subsequent requests should be faster due to caching.

### 3. Manual Testing

You can also test individual endpoints manually:

```bash
# Test projects endpoint
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/projects

# Test experience endpoint
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/experience

# Test health check
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/health
```

## Troubleshooting

### Indexes Not Created
- Check for errors in Supabase SQL Editor
- Verify you have permissions to create indexes
- Check if indexes already exist (they won't be recreated due to `IF NOT EXISTS`)

### API Still Slow
1. Verify indexes are applied (see verification query above)
2. Check Vercel deployment logs for errors
3. Verify caching is working (check response headers for `Cache-Control`)
4. Test with health check endpoint to see database connection time

### Caching Not Working
- Check response headers: `curl -I https://admin.mason.id.vn/api/projects`
- Should see `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`
- If not, check Vercel deployment logs

## Next Steps After Deployment

1. ✅ Apply database indexes (see above)
2. ✅ Wait for Vercel deployment to complete
3. ✅ Test API performance using the test script
4. ✅ Monitor Vercel logs for any issues
5. ✅ Verify caching is working (check response headers)

## Files

- `apply-indexes.sql` - SQL script to create performance indexes
- `test-api-performance.sh` - Bash script to test API response times
- `README.md` - This file

