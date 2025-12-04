# API Connection - CMS ↔ Backend API

## Tổng quan

CMS (Next.js) có thể và đang kết nối với Backend API (Node.js/Express), nhưng **không bắt buộc** cho tất cả features.

---

## Kiến trúc hiện tại

```
┌─────────────────┐
│  CMS (Next.js)  │
│  admin.mason... │
└────────┬────────┘
         │
         ├─→ Supabase Auth API (Trực tiếp)
         │   - Login/Logout
         │   - Session management
         │
         └─→ Backend API (Node.js)
             - Experience CRUD
             - Projects (sắp có)
             - Skills (sắp có)
```

---

## 1. Authentication Flow

### CMS → Supabase Auth (Trực tiếp)

**Không qua Backend API**

**File**: `cms/src/app/login/page.tsx`

```typescript
const supabase = createClient() // Supabase browser client
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

**Lý do**:
- Supabase SSR tự động handle cookies
- Không cần proxy qua backend
- Nhanh hơn (direct connection)
- Bảo mật tốt (HTTP-only cookies)

**Backend API có auth routes không?**
- Có: `api/src/routes/authRoutes.js`
- Nhưng CMS **không dùng** (gọi trực tiếp Supabase)

---

## 2. Data Flow (Experience, Projects, Skills)

### CMS → Backend API

**Có kết nối và đang dùng**

**File**: `cms/src/app/dashboard/experience/page.tsx`

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`)
```

**API URL Configuration**:
- Environment variable: `NEXT_PUBLIC_API_URL`
- Production: `https://api.mason.id.vn`
- Development: `http://localhost:4000` (nếu chạy local)

**Backend API Endpoints đang dùng**:
- `GET /api/experience` - Lấy danh sách
- `GET /api/experience/:id` - Lấy chi tiết
- `POST /api/experience` - Tạo mới
- `PUT /api/experience/:id` - Cập nhật
- `DELETE /api/experience/:id` - Xóa

---

## 3. Cấu hình kết nối

### Frontend (CMS)

**File**: `.env.local` hoặc Vercel Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.mason.id.vn
NEXT_PUBLIC_SUPABASE_URL=https://qeqjowagaybaejjyqjkg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Quan trọng**:
- `NEXT_PUBLIC_*` = Exposed to browser
- Cần set trong Vercel Dashboard cho production

### Backend (API)

**File**: `api/.env`

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://qeqjowagaybaejjyqjkg.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

---

## 4. Flow chi tiết

### Experience Management Flow

```
┌─────────────────────┐
│  CMS Experience UI  │
│  (Next.js Client)   │
└──────────┬──────────┘
           │
           │ 1. User clicks "Thêm Experience"
           ▼
┌─────────────────────┐
│  Form Submit        │
│  POST /api/experience│
└──────────┬──────────┘
           │
           │ 2. Fetch to Backend API
           │    fetch('https://api.mason.id.vn/api/experience')
           ▼
┌─────────────────────┐
│  Backend API        │
│  (Express/Node.js)  │
└──────────┬──────────┘
           │
           │ 3. Validate & Process
           │    - Check auth (nếu có)
           │    - Validate data
           │    - Save to DB
           ▼
┌─────────────────────┐
│  Supabase Database  │
│  (PostgreSQL)       │
└──────────┬──────────┘
           │
           │ 4. Return response
           ▼
┌─────────────────────┐
│  CMS receives data  │
│  Updates UI         │
└─────────────────────┘
```

---

## 5. Tại sao có 2 cách?

### Auth: Direct → Supabase
✅ **Ưu điểm**:
- Nhanh (không qua proxy)
- Supabase SSR tự động handle cookies
- Bảo mật tốt (HTTP-only cookies)
- Không cần backend API

### Data: CMS → Backend API → Database
✅ **Ưu điểm**:
- Business logic tập trung
- Validation ở backend
- Có thể thêm authentication/authorization
- Swagger documentation
- Dễ maintain và scale

---

## 6. Có thể thay đổi không?

### Option 1: Tất cả qua Backend API
```
CMS → Backend API → Supabase Auth
CMS → Backend API → Supabase Database
```
- Pros: Centralized, có thể thêm middleware
- Cons: Thêm 1 hop, chậm hơn một chút

### Option 2: Giữ nguyên (Hiện tại)
```
CMS → Supabase Auth (direct)
CMS → Backend API → Database
```
- Pros: Auth nhanh, Data có business logic
- Cons: 2 patterns khác nhau

**Khuyến nghị**: Giữ nguyên (Option 2) vì:
- Auth flow đã tối ưu với Supabase SSR
- Data flow cần business logic ở backend
- Performance tốt

---

## 7. Kiểm tra kết nối

### Test Backend API từ CMS:

```typescript
// Trong CMS component
const testConnection = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
    const data = await response.json()
    console.log('API connected:', data)
  } catch (error) {
    console.error('API connection failed:', error)
  }
}
```

### Test từ Browser Console:

```javascript
// Mở DevTools Console trên CMS
fetch('https://api.mason.id.vn/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 8. Troubleshooting

### Lỗi: "Failed to fetch"
- Check `NEXT_PUBLIC_API_URL` có đúng không
- Check CORS trên Backend API
- Check Backend API có đang chạy không

### Lỗi: "Network error"
- Check internet connection
- Check API domain có accessible không
- Check firewall/proxy settings

### Lỗi: "CORS error"
- Backend API cần có CORS middleware
- Check `api/src/index.js` có `app.use(cors())` không

---

## Tóm tắt

✅ **CMS có đọc được API của bạn Kiệt không?**
- **Có!** Đang dùng cho Experience, Projects, Skills
- API URL: `https://api.mason.id.vn`
- Config qua `NEXT_PUBLIC_API_URL`

✅ **Auth thì sao?**
- Gọi trực tiếp Supabase (không qua backend API)
- Nhanh hơn và bảo mật tốt hơn

✅ **Có cần thay đổi không?**
- Không cần, hiện tại đã tối ưu
- Có thể thêm auth middleware vào backend API nếu cần

