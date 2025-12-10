# Quick Start: Apply Performance Optimizations

## ✅ Step 1: Apply Database Indexes (CRITICAL)

**This is the most important step for performance improvement.**

### Using Supabase Dashboard:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query** button

3. **Copy and Run Index Script**
   - Open file: `cms/scripts/apply-indexes.sql`
   - Copy ALL contents
   - Paste into SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - You should see "Success. No rows returned" or similar
   - Run this verification query:
   ```sql
   SELECT indexname, tablename 
   FROM pg_indexes 
   WHERE schemaname = 'public' 
   AND indexname LIKE 'idx_%';
   ```
   - Should show 4 indexes

**⏱️ Time: ~30 seconds**

---

## ✅ Step 2: Wait for Vercel Deployment

Code has been pushed to GitHub. Vercel will automatically deploy.

1. **Check Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Find your project
   - Wait for deployment to complete (usually 2-3 minutes)

2. **Verify Deployment**
   - Check deployment status shows "Ready"
   - Note the deployment URL

**⏱️ Time: ~2-3 minutes**

---

## ✅ Step 3: Test Performance

### Option A: Using Test Script (Recommended)

```bash
cd /Users/hitek/Portfolio-BA-Mason-1
./cms/scripts/test-api-performance.sh
```

### Option B: Manual Testing

```bash
# Test health check
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/health

# Test projects (should be <200ms)
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/projects

# Test experience (should be <300ms)
curl -w "\nTime: %{time_total}s\n" https://admin.mason.id.vn/api/experience
```

### Expected Results:

- ✅ **First request**: 200-300ms (may be slower due to cold start)
- ✅ **Subsequent requests**: <50ms (cached)
- ✅ **Complex queries**: <300ms

**⏱️ Time: ~1 minute**

---

## ✅ Step 4: Verify Caching

Check that caching is working:

```bash
curl -I https://admin.mason.id.vn/api/projects
```

Look for this header in the response:
```
Cache-Control: public, s-maxage=60, stale-while-revalidate=120
```

If you see this header, caching is working! ✅

**⏱️ Time: ~10 seconds**

---

## 🎉 Done!

Your API should now be significantly faster:
- **Before**: 500ms - 1s+
- **After**: <200ms (first request), <50ms (cached)

## 📊 Monitoring

### Check Performance in Vercel:
1. Go to Vercel Dashboard → Your Project → Functions
2. Check function execution times
3. Look for any errors in logs

### Check Database Performance:
1. Go to Supabase Dashboard → Database → Query Performance
2. Monitor slow queries
3. Verify indexes are being used

## 🆘 Troubleshooting

### API Still Slow?
1. ✅ Verify indexes are applied (Step 1)
2. ✅ Check Vercel deployment completed
3. ✅ Verify caching headers (Step 4)
4. ✅ Check Vercel logs for errors

### Indexes Not Working?
- Run verification query from Step 1
- Check Supabase SQL Editor for errors
- Ensure you have proper permissions

### Caching Not Working?
- Check response headers have `Cache-Control`
- Verify Vercel deployment is complete
- Check Vercel function logs

## 📚 More Information

- **Detailed Index Guide**: `cms/DATABASE_INDEXES.md`
- **Performance Optimizations**: `cms/PERFORMANCE_OPTIMIZATIONS.md`
- **Scripts README**: `cms/scripts/README.md`

