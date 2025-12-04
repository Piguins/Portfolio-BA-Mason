# Login Flow - Mason Portfolio CMS

## Tổng quan

Flow đăng nhập sử dụng **Supabase Auth** với **Next.js Server Components** và **Middleware** để bảo vệ routes.

---

## Kiến trúc

```
┌─────────────┐
│   Browser   │
│  (CMS FE)   │
└──────┬──────┘
       │
       │ 1. User nhập email/password
       ▼
┌─────────────────────┐
│  Login Page (Client) │
│  /login/page.tsx    │
└──────┬──────────────┘
       │
       │ 2. signInWithPassword()
       ▼
┌─────────────────────┐
│  Supabase Client     │
│  @supabase/ssr       │
└──────┬──────────────┘
       │
       │ 3. HTTP Request
       ▼
┌─────────────────────┐
│  Supabase Auth API   │
│  (External Service)  │
└──────┬──────────────┘
       │
       │ 4. Validate credentials
       │ 5. Return tokens
       ▼
┌─────────────────────┐
│  Supabase SSR        │
│  (Auto-handle)       │
└──────┬──────────────┘
       │
       │ 6. Store in HTTP-only cookies
       ▼
┌─────────────────────┐
│  Browser Cookies     │
│  (sb-access-token)  │
│  (sb-refresh-token) │
└──────┬──────────────┘
       │
       │ 7. Redirect to /dashboard
       ▼
┌─────────────────────┐
│  Middleware          │
│  middleware.ts       │
└──────┬──────────────┘
       │
       │ 8. Check cookies
       │ 9. Verify session
       ▼
┌─────────────────────┐
│  Dashboard Page      │
│  (Server Component) │
└─────────────────────┘
```

---

## Chi tiết từng bước

### 1. **Login Page (FE - Client Component)**

**File**: `cms/src/app/login/page.tsx`

**Chức năng**:
- User nhập email và password
- Validate form (client-side)
- Gọi `supabase.auth.signInWithPassword()`

**Code chính**:
```typescript
const supabase = createClient() // Supabase browser client
const { data, error } = await supabase.auth.signInWithPassword({
  email: email.trim(),
  password,
})
```

**Lưu ý**:
- Không lưu tokens vào localStorage/sessionStorage
- Không truy cập tokens từ response
- Chỉ kiểm tra `data.user` để xác nhận login thành công

---

### 2. **Supabase Client (FE)**

**File**: `cms/src/lib/supabase/client.ts`

**Chức năng**:
- Tạo Supabase client cho browser
- Sử dụng `@supabase/ssr` để tự động xử lý cookies

**Code**:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Quan trọng**:
- `@supabase/ssr` tự động lưu `access_token` và `refresh_token` vào **HTTP-only cookies**
- Cookies này **KHÔNG thể truy cập bằng JavaScript** (bảo mật)

---

### 3. **Supabase Auth API (External)**

**Service**: Supabase Cloud Auth Service

**Chức năng**:
- Validate email/password
- Tạo session tokens
- Trả về `access_token` và `refresh_token`

**Response**:
```json
{
  "user": { ... },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_at": 1234567890
  }
}
```

---

### 4. **Supabase SSR (Auto-handle)**

**Library**: `@supabase/ssr`

**Chức năng**:
- Tự động lấy tokens từ response
- Lưu vào HTTP-only cookies:
  - `sb-{project-ref}-auth-token` (access_token)
  - `sb-{project-ref}-auth-token-code-verifier` (refresh_token)
- Cookies được đánh dấu:
  - `HttpOnly`: Không thể truy cập bằng JavaScript
  - `Secure`: Chỉ gửi qua HTTPS
  - `SameSite`: Bảo vệ CSRF

---

### 5. **Middleware (FE - Route Protection)**

**File**: `cms/src/middleware.ts`

**Chức năng**:
- Chạy trên **mọi request** (trước khi render page)
- Kiểm tra authentication status
- Redirect nếu cần

**Flow**:
```typescript
1. Đọc cookies từ request
2. Tạo Supabase server client
3. Gọi supabase.auth.getUser() để verify session
4. Nếu không authenticated:
   - Redirect /dashboard → /login
   - Redirect / → /login
5. Nếu authenticated:
   - Redirect /login → /dashboard
   - Allow access to /dashboard
```

**Quan trọng**:
- Middleware chạy trên **Edge Runtime** (Vercel Edge Functions)
- Không thể dùng Node.js APIs
- Phải dùng `@supabase/ssr` với cookie handling

---

### 6. **Server Components (FE)**

**Files**: 
- `cms/src/app/dashboard/page.tsx`
- `cms/src/lib/auth.ts`

**Chức năng**:
- Lấy user info từ cookies (server-side)
- Sanitize data (chỉ trả về email, name)
- Render dashboard content

**Code**:
```typescript
// Server Component
const user = await getCurrentUser() // Đọc từ cookies

// lib/auth.ts
const supabase = await createClient() // Server client
const { data: { user } } = await supabase.auth.getUser()
// Supabase tự động đọc tokens từ cookies
```

---

## Security Flow

### Token Storage
```
┌─────────────────────────────────────┐
│  Supabase Response                  │
│  - access_token                     │
│  - refresh_token                    │
└──────────────┬──────────────────────┘
               │
               │ @supabase/ssr auto-handle
               ▼
┌─────────────────────────────────────┐
│  HTTP-only Cookies                   │
│  - sb-xxx-auth-token                │
│  - HttpOnly: true                    │
│  - Secure: true                       │
│  - SameSite: Lax                     │
└─────────────────────────────────────┘
```

### Token Usage
```
Client-side JavaScript: ❌ KHÔNG THỂ TRUY CẬP
Server Components: ✅ Đọc từ cookies (auto)
Middleware: ✅ Đọc từ cookies (auto)
API Routes: ✅ Đọc từ cookies (auto)
```

---

## API Backend (Optional)

**File**: `api/src/routes/authRoutes.js`

**Chức năng**:
- Proxy authentication requests (nếu cần)
- Hiện tại CMS gọi trực tiếp Supabase Auth API

**Lưu ý**:
- API backend không bắt buộc cho login flow
- CMS có thể gọi trực tiếp Supabase Auth API
- API backend chỉ cần cho các business logic khác

---

## Flow Summary

### Login Process:
1. **User** → Nhập email/password trên Login Page
2. **Login Page** → Gọi `supabase.auth.signInWithPassword()`
3. **Supabase SSR** → Tự động lưu tokens vào HTTP-only cookies
4. **Browser** → Redirect đến `/dashboard`
5. **Middleware** → Kiểm tra cookies, verify session
6. **Dashboard** → Server Component đọc user từ cookies, render page

### Session Verification:
1. **Middleware** → Đọc cookies từ request
2. **Supabase Server Client** → Verify tokens với Supabase
3. **Allow/Deny** → Dựa trên kết quả verify

### Logout Process:
1. **User** → Click "Đăng xuất"
2. **LogoutButton** → Gọi `supabase.auth.signOut()`
3. **Supabase SSR** → Tự động xóa cookies
4. **Redirect** → Về `/login`

---

## Key Points

✅ **Security**:
- Tokens lưu trong HTTP-only cookies (không thể XSS)
- Cookies chỉ gửi qua HTTPS (Secure flag)
- Server-side verification mọi request

✅ **Performance**:
- Middleware chạy trên Edge (nhanh)
- Không cần API backend cho auth
- Direct connection với Supabase

✅ **UX**:
- Seamless redirects
- Auto token refresh (Supabase handle)
- Persistent sessions

---

## Files liên quan

**Frontend (CMS)**:
- `cms/src/app/login/page.tsx` - Login UI
- `cms/src/lib/supabase/client.ts` - Browser client
- `cms/src/lib/supabase/server.ts` - Server client
- `cms/src/lib/auth.ts` - Auth utilities
- `cms/src/middleware.ts` - Route protection

**Backend (API)**:
- `api/src/routes/authRoutes.js` - Auth routes (optional, hiện chưa dùng)

**External**:
- Supabase Auth API - Authentication service
- `@supabase/ssr` - Cookie handling library

