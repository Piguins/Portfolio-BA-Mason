# Deployment Guide

## 🔧 Environment Variables Setup

### Required Environment Variables for Production

Để CMS hoạt động trên production (Vercel), bạn cần set các environment variables sau:

#### 1. Database Configuration

**DATABASE_URL** (REQUIRED)
- Format: `postgresql://user:password@host:port/database?sslmode=require`
- Đây là connection string đến PostgreSQL database
- **QUAN TRỌNG**: Phải được set trong Vercel Environment Variables

#### 2. Supabase Configuration

**NEXT_PUBLIC_SUPABASE_URL**
- Supabase project URL
- Format: `https://xxxxx.supabase.co`

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Supabase anonymous key
- Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### 3. App Configuration

**NEXT_PUBLIC_APP_URL**
- Production URL của CMS
- Format: `https://admin.mason.id.vn`

### Cách Set Environment Variables trong Vercel

1. Vào Vercel Dashboard
2. Chọn project `portfolio-cms` (hoặc tên project của bạn)
3. Vào **Settings** → **Environment Variables**
4. Add các variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
   - `NEXT_PUBLIC_APP_URL` - App URL

### Verify Environment Variables

Sau khi set environment variables, bạn có thể verify bằng cách:

1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Kiểm tra xem tất cả variables đã được set chưa
3. Đảm bảo `DATABASE_URL` không bị empty

## 🐛 Troubleshooting 503 Errors

Nếu bạn gặp lỗi **503 Service Unavailable**, có thể do:

### 1. DATABASE_URL không được set
- **Symptom**: Tất cả API endpoints trả về 503
- **Solution**: Set `DATABASE_URL` trong Vercel Environment Variables

### 2. DATABASE_URL không đúng format
- **Symptom**: 503 errors với connection errors
- **Solution**: Kiểm tra format của connection string
- **Format**: `postgresql://user:password@host:port/database?sslmode=require`

### 3. Database không accessible từ Vercel
- **Symptom**: Connection timeout errors
- **Solution**: 
  - Kiểm tra database firewall settings
  - Đảm bảo database cho phép connections từ Vercel IPs
  - Nếu dùng Supabase, kiểm tra connection pooling settings

### 4. Prisma Client chưa được generate
- **Symptom**: Module not found errors
- **Solution**: 
  - Thêm `prisma generate` vào build command
  - Hoặc thêm vào `package.json`:
    ```json
    {
      "scripts": {
        "postinstall": "prisma generate"
      }
    }
    ```

## 📋 Build Command

Đảm bảo build command trong Vercel bao gồm:

```bash
npm install && npx prisma generate && npm run build
```

Hoặc thêm vào `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

## 🔍 Debugging Production Errors

### Health Check Endpoint

Sử dụng health check endpoint để test database connection:

```bash
curl https://admin.mason.id.vn/api/health
```

Response sẽ cho biết:
- Database connection status
- Response time
- Environment variables status
- Chi tiết lỗi nếu có

### Check Vercel Logs

1. Vào Vercel Dashboard → Project → **Logs**
2. Filter theo function name (ví dụ: `/api/experience` hoặc `/api/health`)
3. Xem error messages để biết chính xác lỗi gì

### Common Error Patterns

- **"DATABASE_URL environment variable is not set"**
  → Set DATABASE_URL trong Vercel
  
- **"Can't reach database server"**
  → Kiểm tra database connection string và firewall
  
- **"P1001: Can't reach database server"**
  → Database không accessible từ Vercel network
  
- **Connection timeout errors**
  → Có thể cần dùng connection pooler (xem bên dưới)

### Connection Pooling cho Serverless (Vercel)

Vercel serverless functions có thể gặp vấn đề với database connections do:
- Mỗi function tạo connection mới
- Connection limit của database
- Cold start latency

**Nếu dùng Supabase:**

Supabase cung cấp connection pooler. Thay vì dùng direct connection string, dùng pooler:

1. Vào Supabase Dashboard → Settings → Database
2. Copy **Connection Pooling** URL (không phải direct connection)
3. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
4. Set vào `DATABASE_URL` trong Vercel

**Nếu dùng PostgreSQL khác:**

Có thể cần setup connection pooler như PgBouncer hoặc dùng managed service có pooling.

### Test Database Connection

Sau khi set DATABASE_URL, test bằng health check:

```bash
# Test health endpoint
curl https://admin.mason.id.vn/api/health

# Expected response khi OK:
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "responseTime": 50
  }
}

# Expected response khi lỗi:
{
  "status": "unhealthy",
  "database": {
    "status": "error",
    "error": "Can't reach database server"
  }
}
```

## ✅ Checklist Before Deployment

- [ ] DATABASE_URL đã được set trong Vercel
- [ ] NEXT_PUBLIC_SUPABASE_URL đã được set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY đã được set
- [ ] NEXT_PUBLIC_APP_URL đã được set
- [ ] Prisma client đã được generate (thêm vào build command)
- [ ] Database cho phép connections từ Vercel
- [ ] Test API endpoints sau khi deploy

