# Vercel Environment Variables Setup Guide

## ⚠️ Vấn đề: DATABASE_URL không được set

Nếu health check trả về `"hasDatabaseUrl": false`, có nghĩa là `DATABASE_URL` chưa được set trong Vercel.

## 🔧 Cách Set Environment Variables trong Vercel

### Bước 1: Vào Vercel Dashboard

1. Truy cập: https://vercel.com/dashboard
2. Chọn project của bạn (ví dụ: `portfolio-cms` hoặc tên project bạn đã setup)

### Bước 2: Vào Settings → Environment Variables

1. Click vào project
2. Vào tab **Settings** (ở trên cùng)
3. Scroll xuống phần **Environment Variables** (bên trái menu)

### Bước 3: Add DATABASE_URL

1. Click nút **Add New** hoặc **Add Environment Variable**
2. **Key**: `DATABASE_URL`
3. **Value**: Paste connection string của bạn
   - Nếu dùng Supabase: Copy từ Supabase Dashboard → Settings → Database
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`
4. **Environment**: Chọn **Production**, **Preview**, và **Development** (hoặc ít nhất chọn **Production**)
5. Click **Save**

### Bước 4: Verify Environment Variables

Kiểm tra xem các variables sau đã được set chưa:

- ✅ `DATABASE_URL` - **REQUIRED** (đang thiếu!)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Đã có
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Đã có
- ⚠️ `NEXT_PUBLIC_APP_URL` - Nên có (optional)

### Bước 5: Redeploy

Sau khi set environment variables:

1. Vào tab **Deployments**
2. Click vào 3 dots (...) của deployment mới nhất
3. Chọn **Redeploy**
4. Hoặc push một commit mới để trigger auto-deploy

**QUAN TRỌNG**: Environment variables chỉ apply cho deployments mới. Bạn phải redeploy sau khi set variables!

## 🔍 Lấy DATABASE_URL từ Supabase

Nếu bạn dùng Supabase:

1. Vào Supabase Dashboard: https://app.supabase.com
2. Chọn project của bạn
3. Vào **Settings** → **Database**
4. Scroll xuống phần **Connection string**
5. Chọn tab **URI** (không phải Connection Pooling)
6. Copy connection string
7. Thay `[YOUR-PASSWORD]` bằng password thực tế của bạn
8. Format sẽ là: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres`

**Lưu ý**: 
- Nếu bạn chưa biết password, có thể reset trong Supabase Dashboard → Settings → Database → Reset database password
- Hoặc dùng Connection Pooling URL (xem bên dưới)

## 🔄 Connection Pooling (Khuyến nghị cho Vercel)

Vercel serverless functions hoạt động tốt hơn với connection pooling:

1. Vào Supabase Dashboard → Settings → Database
2. Scroll xuống phần **Connection string**
3. Chọn tab **Connection Pooling** (không phải URI)
4. Copy connection string
5. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
6. Set vào `DATABASE_URL` trong Vercel

**Lợi ích**:
- Giảm connection limits issues
- Tốt hơn cho serverless environments
- Giảm latency

## ✅ Verify Setup

Sau khi set và redeploy, test lại:

```bash
curl https://admin.mason.id.vn/api/health
```

Expected response khi OK:
```json
{
  "status": "healthy",
  "environment": {
    "hasDatabaseUrl": true,  // ← Phải là true
    "hasSupabaseUrl": true,
    "hasSupabaseKey": true
  },
  "database": {
    "status": "connected",  // ← Phải là connected
    "responseTime": 50
  }
}
```

## 🐛 Troubleshooting

### Vẫn báo `hasDatabaseUrl: false` sau khi set?

1. **Kiểm tra Environment**: Đảm bảo bạn đã chọn **Production** khi add variable
2. **Redeploy**: Environment variables chỉ apply cho deployments mới
3. **Check Variable Name**: Phải chính xác là `DATABASE_URL` (không có space, đúng case)
4. **Check Value**: Đảm bảo value không bị empty

### Lỗi "Can't reach database server" sau khi set DATABASE_URL?

1. **Check Connection String**: Đảm bảo format đúng
2. **Check Password**: Password có thể đã thay đổi
3. **Check SSL**: Thêm `?sslmode=require` vào cuối connection string
4. **Try Connection Pooling**: Dùng pooler URL thay vì direct connection

### Lỗi "Invalid connection string"?

1. **Check Format**: `postgresql://user:password@host:port/database?params`
2. **Escape Special Characters**: Nếu password có ký tự đặc biệt, cần URL encode
3. **Check Supabase URL**: Đảm bảo copy đúng từ Supabase Dashboard

## 📝 Checklist

- [ ] DATABASE_URL đã được set trong Vercel
- [ ] Environment được chọn là Production (và Preview nếu cần)
- [ ] Value không bị empty
- [ ] Đã redeploy sau khi set variable
- [ ] Health check trả về `hasDatabaseUrl: true`
- [ ] Health check trả về `database.status: "connected"`

