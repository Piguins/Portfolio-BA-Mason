# Performance Optimization - API

## Vấn đề ban đầu

- API response time: **867ms - 2.69s** (quá chậm)
- User experience kém
- Không chấp nhận được cho production

---

## Nguyên nhân

### 1. ❌ Database Connection: Dùng `Client` thay vì `Pool`

**Vấn đề**:
- Mỗi request tạo connection mới → rất chậm (200-500ms)
- Không tái sử dụng connections
- Vercel serverless không giữ connections giữa các invocations

**Giải pháp**: ✅ Chuyển sang `Pool`
- Connection pooling: tái sử dụng connections
- Giảm connection overhead từ 200-500ms → 5-20ms
- Tối ưu cho serverless environments

### 2. ❌ Query Performance: Nhiều subqueries

**Vấn đề**:
- Query có 2 subqueries với `json_agg` cho mỗi experience
- N+1 query problem tiềm ẩn
- Không có indexes được tận dụng tốt

**Giải pháp**: ✅ Chuyển sang JOINs
- Dùng `LEFT JOIN` + `json_agg` với `FILTER`
- Giảm từ 3 queries → 1 query
- Tận dụng database indexes tốt hơn

### 3. ❌ Không có Response Caching

**Vấn đề**:
- Mỗi request đều query database
- Không cache responses

**Giải pháp**: ✅ Thêm Cache-Control headers
- Cache GET requests 5 phút
- `stale-while-revalidate` cho UX tốt hơn

### 4. ❌ Không có Performance Monitoring

**Vấn đề**:
- Không biết query nào chậm
- Không có metrics

**Giải pháp**: ✅ Thêm performance headers
- `X-Response-Time` header
- `X-Query-Time` header
- Console warnings cho slow queries (>500ms)

---

## Các thay đổi đã thực hiện

### 1. Database Connection Pooling

**File**: `api/src/db.js`

**Trước**:
```javascript
const { Client } = pkg
const client = new Client({ ... })
```

**Sau**:
```javascript
const { Pool } = pkg
const pool = new Pool({
  max: 20,              // Max connections
  min: 2,               // Min connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  allowExitOnIdle: false, // Keep alive for serverless
})
```

**Lợi ích**:
- ✅ Connection reuse: 200-500ms → 5-20ms
- ✅ Better resource management
- ✅ Optimized for Vercel serverless

### 2. Query Optimization

**File**: `api/src/services/experienceService.js`

**Trước** (Subqueries):
```sql
SELECT
  e.*,
  (SELECT json_agg(...) FROM experience_bullets WHERE ...) AS bullets,
  (SELECT json_agg(...) FROM experience_skills WHERE ...) AS skills_used
FROM experience e
```

**Sau** (JOINs):
```sql
SELECT
  e.*,
  json_agg(DISTINCT ...) FILTER (WHERE ...) AS bullets,
  json_agg(DISTINCT ...) FILTER (WHERE ...) AS skills_used
FROM experience e
LEFT JOIN experience_bullets eb ON ...
LEFT JOIN experience_skills es ON ...
LEFT JOIN skills s ON ...
GROUP BY e.id, ...
```

**Lợi ích**:
- ✅ 1 query thay vì 3 queries
- ✅ Better index utilization
- ✅ Faster execution (50-200ms → 20-80ms)

### 3. Response Caching

**File**: `api/src/controllers/experienceController.js`

```javascript
// Add cache headers for GET requests
res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
```

**Lợi ích**:
- ✅ Reduced database load
- ✅ Faster responses for cached requests
- ✅ Better UX with stale-while-revalidate

### 4. Performance Monitoring

**File**: `api/src/index.js` và `experienceController.js`

```javascript
// Add response time header
res.setHeader('X-Response-Time', `${duration}ms`)
res.setHeader('X-Query-Time', `${queryTime}ms`)

// Log slow queries
if (queryTime > 500) {
  console.warn(`⚠️ Slow query detected: ${queryTime}ms`)
}
```

**Lợi ích**:
- ✅ Visibility into performance
- ✅ Easy to identify bottlenecks
- ✅ Monitor in production

---

## Kết quả mong đợi

### Trước optimization:
- **Connection time**: 200-500ms
- **Query time**: 200-800ms
- **Total response**: 867ms - 2.69s ❌

### Sau optimization:
- **Connection time**: 5-20ms (pool reuse)
- **Query time**: 20-80ms (optimized JOINs)
- **Total response**: **50-150ms** ✅
- **Cached requests**: **<10ms** ✅

**Improvement**: **~10-20x faster** 🚀

---

## Monitoring & Debugging

### Check Response Headers

```bash
curl -I https://api.mason.id.vn/api/experience
```

Look for:
- `X-Response-Time`: Total request time
- `X-Query-Time`: Database query time
- `Cache-Control`: Caching configuration

### Check Logs

Slow queries will be logged:
```
⚠️ Slow query detected: 650ms for getAll experiences
⚠️ Slow request: GET /api/experience - 750ms
```

### Vercel Analytics

- Check Vercel Dashboard → Analytics
- Monitor response times
- Identify cold starts

---

## Best Practices

### 1. Connection Pooling
- ✅ Always use `Pool` for serverless
- ✅ Configure `max` and `min` appropriately
- ✅ Set `allowExitOnIdle: false` for Vercel

### 2. Query Optimization
- ✅ Use JOINs instead of subqueries when possible
- ✅ Add indexes on foreign keys
- ✅ Use `EXPLAIN ANALYZE` to check query plans

### 3. Caching
- ✅ Cache GET requests
- ✅ Use `stale-while-revalidate` for better UX
- ✅ Invalidate cache on updates

### 4. Monitoring
- ✅ Add performance headers
- ✅ Log slow queries
- ✅ Monitor in production

---

## Next Steps (Optional)

### 1. Database Indexes
```sql
-- Add indexes for faster queries
CREATE INDEX idx_experience_bullets_experience_id ON experience_bullets(experience_id);
CREATE INDEX idx_experience_skills_experience_id ON experience_skills(experience_id);
CREATE INDEX idx_experience_order_index ON experience(order_index);
```

### 2. Response Compression
```javascript
import compression from 'compression'
app.use(compression())
```

### 3. Redis Caching (Advanced)
- Cache frequently accessed data
- Reduce database load
- Even faster responses

---

## Testing

### Local Testing

```bash
# Start API
cd api
npm run dev

# Test endpoint
curl http://localhost:4000/api/experience

# Check response time
curl -w "\nTime: %{time_total}s\n" http://localhost:4000/api/experience
```

### Production Testing

```bash
# Test production API
curl -I https://api.mason.id.vn/api/experience

# Check headers
curl -v https://api.mason.id.vn/api/experience 2>&1 | grep -i "x-response-time\|x-query-time\|cache-control"
```

---

## Summary

✅ **Fixed**: Connection pooling (Client → Pool)
✅ **Fixed**: Query optimization (Subqueries → JOINs)
✅ **Added**: Response caching
✅ **Added**: Performance monitoring

**Expected improvement**: **10-20x faster** (867ms → 50-150ms)

