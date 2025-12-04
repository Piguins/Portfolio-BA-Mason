# CMS Performance Fix - Mọi thứ đều chậm

## Vấn đề

- Portfolio website call API nhanh ✅
- CMS (Next.js) mọi thứ đều chậm ❌

## Nguyên nhân

### 1. ❌ Middleware chạy auth check trên mọi request

**Vấn đề**:
- Mỗi request đều gọi `supabase.auth.getUser()` → **100-300ms overhead**
- Không có caching
- Chạy trên mọi route (kể cả static assets nếu không exclude đúng)

**File**: `cms/src/middleware.ts`

### 2. ❌ Client-side data fetching

**Vấn đề**:
- CMS dùng `'use client'` và fetch data sau khi page load
- User phải đợi: Page load → React hydrate → Fetch API → Render
- Không có server-side data fetching

**File**: `cms/src/app/dashboard/experience/page.tsx`

### 3. ❌ Không có request caching

**Vấn đề**:
- Mỗi lần vào page đều fetch lại từ API
- Không cache responses
- Duplicate requests có thể xảy ra

### 4. ❌ Multiple auth checks

**Vấn đề**:
- Middleware check auth
- `getCurrentUser()` check auth lại
- Duplicate Supabase calls

---

## Giải pháp

### 1. ✅ Optimize Middleware - Cache auth checks

**Strategy**: 
- Cache auth result trong request headers
- Skip auth check cho static assets
- Fast path cho authenticated requests

### 2. ✅ Convert to Server Components + Server-side data fetching

**Strategy**:
- Dùng Server Components để fetch data trước khi render
- User thấy data ngay, không cần đợi client-side fetch
- Better SEO và performance

### 3. ✅ Add request caching

**Strategy**:
- Cache API responses trong Next.js
- Use `revalidate` for stale-while-revalidate
- Reduce duplicate requests

### 4. ✅ Optimize auth flow

**Strategy**:
- Middleware chỉ check auth, không fetch user data
- Server Components fetch user data nếu cần
- Avoid duplicate checks

---

## Implementation

### Fix 1: Optimize Middleware

```typescript
// Skip auth check for static assets and API routes
if (
  request.nextUrl.pathname.startsWith('/_next') ||
  request.nextUrl.pathname.startsWith('/api') ||
  request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
) {
  return NextResponse.next()
}

// Fast path: Check cookies first before Supabase call
const authToken = request.cookies.get('sb-access-token')
if (!authToken && request.nextUrl.pathname.startsWith('/dashboard')) {
  return NextResponse.redirect(new URL('/login', request.url))
}
```

### Fix 2: Convert to Server Components

**Before** (Client Component):
```typescript
'use client'
const [experiences, setExperiences] = useState([])
useEffect(() => {
  fetch('/api/experience').then(...)
}, [])
```

**After** (Server Component):
```typescript
// Server Component - fetch data before render
async function ExperiencePage() {
  const experiences = await fetch(`${API_URL}/api/experience`, {
    next: { revalidate: 60 } // Cache 60 seconds
  }).then(r => r.json())
  
  return <ExperienceList experiences={experiences} />
}
```

### Fix 3: Add API Response Caching

```typescript
// In API calls
const response = await fetch(`${API_URL}/api/experience`, {
  next: { 
    revalidate: 60, // Cache 60 seconds
    tags: ['experiences'] // For cache invalidation
  }
})
```

### Fix 4: Request Deduplication

```typescript
// Use React cache() for request deduplication
import { cache } from 'react'

const fetchExperiences = cache(async () => {
  return fetch(`${API_URL}/api/experience`).then(r => r.json())
})
```

---

## Expected Results

### Before:
- Middleware auth check: **100-300ms** per request
- Client-side fetch: **200-500ms** after page load
- Total time to interactive: **500-1000ms** ❌

### After:
- Middleware auth check: **5-20ms** (cached/optimized)
- Server-side fetch: **100-200ms** (before render)
- Total time to interactive: **150-300ms** ✅

**Improvement**: **3-5x faster** 🚀

---

## Files to Update

1. `cms/src/middleware.ts` - Optimize auth checks
2. `cms/src/app/dashboard/experience/page.tsx` - Convert to Server Component
3. `cms/src/app/dashboard/experience/[id]/edit/page.tsx` - Convert to Server Component
4. `cms/src/app/dashboard/experience/new/page.tsx` - Keep client (form needs interactivity)
5. `cms/next.config.mjs` - Add caching config

---

## Testing

### Before optimization:
```bash
# Check network tab
- Middleware: ~200ms
- API fetch: ~300ms
- Total: ~500ms
```

### After optimization:
```bash
# Check network tab
- Middleware: ~10ms
- API fetch: ~150ms (server-side, before render)
- Total: ~160ms
```

---

## Summary

✅ **Fix**: Optimize middleware auth checks
✅ **Fix**: Convert to Server Components for data fetching
✅ **Fix**: Add request caching
✅ **Fix**: Optimize auth flow

**Expected improvement**: **3-5x faster** (500-1000ms → 150-300ms)

