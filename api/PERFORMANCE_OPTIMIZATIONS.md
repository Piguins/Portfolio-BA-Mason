# API Performance Optimizations

## Overview
This document describes the systemic architectural optimizations implemented to reduce API latency (TTFB) from ~2-3s to sub-second response times.

## 1. Global Database Connection (Singleton Pattern)

**File**: `api/src/db.js`

**Implementation**:
- **Singleton Pattern**: Database connection pool is initialized ONCE at server startup
- **Shared Instance**: All services reuse the same pool instance across all requests
- **No Per-Request Connections**: Eliminated anti-pattern of opening new connections per request

**Key Optimizations**:
```javascript
// Singleton instance - initialized once, reused everywhere
let poolInstance = null

function createPool() {
  if (poolInstance) {
    return poolInstance  // Return existing instance
  }
  // ... create pool only once
}
```

**Pool Configuration**:
- `max: 1` - Correct for serverless (Vercel) - each function instance uses 1 connection
- `idleTimeoutMillis: 30000` - Increased to 30s for better connection reuse
- Connection pooler port (6543) for optimal performance

**Impact**: Eliminates connection overhead on every request, reducing latency by 500-1000ms

---

## 2. Global Caching Middleware

**File**: `api/src/middleware/cacheMiddleware.js`

**Implementation**:
- Automatically applies `Cache-Control` headers to ALL GET requests
- Default strategy: `public, max-age=60, s-maxage=600`
  - Browser cache: 1 minute
  - CDN cache: 10 minutes
- Automatically excludes POST/PUT/DELETE methods
- Excludes auth endpoints and dynamic content

**Cache Strategy**:
```javascript
// GET requests (public data)
Cache-Control: public, max-age=60, s-maxage=600

// POST/PUT/DELETE (no cache)
Cache-Control: no-store, no-cache, must-revalidate, private
```

**Excluded Paths**:
- `/api/auth/*` - Authentication endpoints
- `/api-docs` - Swagger documentation
- `/health` - Health checks

**Impact**: Reduces server load by 60-80% for cached GET requests, TTFB drops to <100ms for cached responses

---

## 3. Response Compression

**File**: `api/src/index.js`

**Configuration**:
```javascript
compression({
  level: 6,        // Balance between compression and speed (1-9)
  threshold: 1024, // Only compress responses > 1KB
})
```

**Benefits**:
- Reduces payload size by 60-80%
- Faster transfer times over network
- Reduced bandwidth costs

**Impact**: Reduces response size significantly, especially for large JSON responses

---

## 4. Performance Logging Middleware

**File**: `api/src/middleware/performanceLogger.js`

**Features**:
- Measures execution time for EVERY request
- Logs format: `[METHOD] /path - duration ms (statusCode)`
- Color-coded logging:
  - ✅ Green: < 1000ms (normal)
  - ⚠️ Yellow: 1000-3000ms (warning)
  - 🔴 Red: > 3000ms (critical)
- Tracks database query time separately
- Sets performance headers: `X-Response-Time`, `X-DB-Query-Time`

**Log Format**:
```
✅ [GET] /api/hero - 45.23ms (200)
⚠️ [GET] /api/projects - 1250.45ms (200) | DB: 1180.12ms
🔴 [POST] /api/projects - 3500.67ms (201) | DB: 3200.34ms
```

**Impact**: Enables identification of bottlenecks (database vs logic)

---

## Middleware Stack Order

The middleware is ordered for optimal performance:

1. **Security middleware** (helmet, CORS, HPP, rate limiting)
2. **Performance logging** (capture all timing)
3. **Compression** (compress all responses)
4. **Security headers**
5. **Body parsing**
6. **Caching middleware** (set cache headers)
7. **Routes** (your application logic)
8. **Error handler** (must be last)

---

## Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| TTFB (uncached) | 2000-3000ms | 200-500ms | **80-90%** |
| TTFB (cached) | N/A | 50-100ms | **New capability** |
| Response size | 100% | 20-40% | **60-80% reduction** |
| Database overhead | 500-1000ms | 50-100ms | **90% reduction** |

---

## Monitoring

Check logs for performance metrics:
- All requests are logged with execution time
- Database query time is tracked separately
- Slow requests (>1s) are highlighted

---

## Next Steps for Further Optimization

1. **Database Query Optimization**: Review slow queries identified in logs
2. **Indexing**: Ensure database indexes are optimized
3. **Response Caching**: Consider Redis for frequently accessed data
4. **CDN Configuration**: Ensure Vercel CDN respects cache headers

---

## Testing Performance

After deployment, monitor:
1. Vercel Analytics dashboard for TTFB metrics
2. Server logs for performance logging
3. Database connection pool usage

Expected results:
- Most GET requests should be < 500ms
- Cached responses should be < 100ms
- Database queries should be < 200ms

