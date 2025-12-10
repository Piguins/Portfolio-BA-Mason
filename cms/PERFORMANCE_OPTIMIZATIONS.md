# API Performance Optimizations

## Summary
This document describes the performance optimizations implemented to reduce API response times from 500ms+ to <200ms for simple GET requests.

## Optimizations Implemented

### 1. Response Caching ✅
**Files Modified:**
- `cms/src/lib/api/handlers/request-handler.ts` - Added caching support
- All GET routes in `cms/src/app/api/`

**Changes:**
- Added `revalidate: 60` (60 seconds) to all GET responses
- Implements Cache-Control headers: `public, s-maxage=60, stale-while-revalidate=120`
- Next.js will cache responses for 60 seconds, reducing database load

**Impact:**
- Subsequent requests within 60s will be served from cache (near-instant)
- Reduces database queries significantly
- Trade-off: Data may be up to 60 seconds stale (acceptable for CMS read operations)

### 2. Query Performance Monitoring ✅
**Files Modified:**
- `cms/src/lib/api/database/query-helpers.ts`

**Changes:**
- Added timing logs for all database queries
- Logs warnings for queries taking >200ms (development only)
- Tracks query execution time for performance analysis

**Impact:**
- Helps identify slow queries during development
- Provides visibility into database performance
- No production overhead (only logs errors)

### 3. Database Query Optimization ✅
**Files Modified:**
- `cms/src/app/api/experience/route.ts`
- `cms/src/app/api/projects/route.ts`
- `cms/src/app/api/experience/[id]/route.ts`

**Changes:**
- Removed `DISTINCT` from `json_agg` (not needed, already using GROUP BY)
- Added `ORDER BY eb.id` in aggregation for consistent results
- Added comments indicating which indexes should be used
- Ensured queries are structured to use indexes efficiently

**Impact:**
- Reduced query complexity
- Better index utilization
- Faster JOIN operations

### 4. Prisma Connection Optimization ✅
**Files Modified:**
- `cms/src/lib/prisma.ts`

**Changes:**
- Reduced logging in development (removed 'query' log, kept 'error' and 'warn')
- Connection pooling already configured for Supabase
- Global client caching ensures connection reuse

**Impact:**
- Reduced logging overhead
- Faster connection establishment
- Better serverless performance

### 5. Database Indexes Documentation ✅
**Files Created:**
- `cms/DATABASE_INDEXES.md`

**Content:**
- Instructions for applying performance indexes
- Verification queries
- Troubleshooting guide

**Impact:**
- Clear instructions for applying indexes
- Helps ensure indexes are properly configured

## Expected Performance Improvements

### Before Optimizations
- Simple GET requests: 500ms - 1s+
- Complex queries (experience with JOIN): 1s - 2s+
- Cold starts: 1-2s (unavoidable)

### After Optimizations
- Simple GET requests: <200ms (first request), <50ms (cached)
- Complex queries: <300ms (first request), <50ms (cached)
- Cold starts: 1-2s (unavoidable, but subsequent requests fast)

## Testing Performance

### 1. Test API Response Times
```bash
# Test simple GET request
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/projects

# Test complex query
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/experience

# Test health check
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/health
```

### 2. Verify Caching
- First request: Should take normal time (200-300ms)
- Second request within 60s: Should be much faster (<50ms)
- Check response headers for `Cache-Control`

### 3. Check Database Indexes
Run in Supabase SQL Editor:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';
```

### 4. Monitor Query Performance
- Check Vercel logs for slow query warnings (development only)
- Look for `[queryAll] Slow query detected: XXXms` messages

## Next Steps

1. **Apply Database Indexes** (Critical)
   - Follow instructions in `cms/DATABASE_INDEXES.md`
   - Indexes must be applied for optimal performance

2. **Deploy Changes**
   - Push changes to GitHub
   - Vercel will auto-deploy
   - Test performance after deployment

3. **Monitor Performance**
   - Use health check endpoint to monitor response times
   - Check Vercel function logs for any issues
   - Verify caching is working (check response headers)

## Notes

- **Caching Trade-off**: Data may be up to 60 seconds stale. For real-time updates, consider:
  - Reducing cache time for frequently updated endpoints
  - Using cache invalidation on POST/PUT/DELETE operations
  - Implementing manual cache refresh

- **Cold Starts**: Serverless functions have cold starts (1-2s). This is unavoidable but:
  - Subsequent requests are fast
  - Vercel keeps functions warm for active projects
  - Region optimization (sin1) helps reduce latency

- **Database Indexes**: Critical for performance. Without indexes:
  - Queries will still work but be slow
  - ORDER BY operations will be particularly slow
  - JOIN operations will be inefficient

## Troubleshooting

### Slow Queries Still Occurring
1. Verify indexes are applied (see `DATABASE_INDEXES.md`)
2. Check query execution plan in Supabase SQL Editor
3. Ensure connection pooling is working (check `pgbouncer=true` in DATABASE_URL)
4. Monitor Vercel function logs for errors

### Caching Not Working
1. Check response headers for `Cache-Control`
2. Verify Next.js caching is enabled (should be automatic)
3. Check Vercel deployment logs for caching issues

### High Latency
1. Verify Vercel region matches Supabase region (sin1 for Singapore)
2. Check network latency between regions
3. Consider using Supabase connection pooler URL
4. Monitor database connection pool usage

