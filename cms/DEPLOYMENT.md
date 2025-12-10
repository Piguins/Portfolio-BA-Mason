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

### Vercel Project Settings

**QUAN TRỌNG**: Với monorepo structure, bạn cần set:

1. **Root Directory**: `cms`
   - Vào Vercel Dashboard → Project → Settings → General
   - Scroll xuống phần **Root Directory**
   - Set thành `cms`
   - Save

2. **Build Command**: `npm run build` (hoặc để Vercel auto-detect)
   - Vercel sẽ tự động detect Next.js và dùng build command từ `package.json`

3. **Output Directory**: `.next` (Next.js default, không cần set)

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
        "postinstall": "prisma generate",
        "build": "prisma generate && next build"
      }
    }
    ```

## 🐛 Troubleshooting Deploy Errors

### Lỗi "Error: Deploying outputs..."

Có thể do:

1. **Root Directory không đúng**
   - **Solution**: Set Root Directory thành `cms` trong Vercel Settings
   - Vào Settings → General → Root Directory → Set `cms`

2. **Build Command không đúng**
   - **Solution**: Đảm bảo build command chạy từ `cms/` directory
   - Hoặc set Root Directory = `cms` và dùng `npm run build`

3. **Output Directory không đúng**
   - **Solution**: Next.js tự động output vào `.next/`, không cần set

4. **Monorepo structure issues**
   - **Solution**: 
     - Set Root Directory = `cms`
     - Đảm bảo `package.json` ở trong `cms/` folder
     - Build command sẽ tự động chạy từ root directory đã set

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

**Lưu ý**: Nếu Root Directory = `cms`, thì build command chỉ cần `npm run build` (Vercel sẽ tự động cd vào `cms/`)

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
4. **QUAN TRỌNG**: Đảm bảo connection string có `?pgbouncer=true` ở cuối
5. Set vào `DATABASE_URL` trong Vercel

**Lưu ý về Prepared Statements:**
- Với connection pooling, Prisma có thể gặp lỗi "prepared statement already exists"
- Đảm bảo connection string có `pgbouncer=true` parameter
- Code đã được cập nhật để tự động thêm parameter này nếu thiếu

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

## 🌍 Region Optimization

### Đồng bộ Region giữa Vercel và Supabase

Để giảm latency, đảm bảo Vercel Serverless Functions và Supabase Database ở cùng region hoặc gần nhau.

#### 1. Xác định Supabase Region

Kiểm tra region từ DATABASE_URL:
- Format: `postgresql://...@aws-0-[region].pooler.supabase.com:6543/...`
- Ví dụ: `aws-0-ap-southeast-1` = Singapore region

Hoặc kiểm tra trong Supabase Dashboard:
- Settings → Infrastructure → Region

#### 2. Cấu hình Vercel Region

File `vercel.json` đã được cấu hình với region `sin1` (Singapore) - phù hợp cho Việt Nam và khu vực Đông Nam Á.

**Region Mapping:**
- Supabase `ap-southeast-1` (Singapore) → Vercel `sin1` ✅ (đã cấu hình)
- Supabase `ap-southeast-2` (Sydney) → Vercel `syd1`
- Supabase `ap-northeast-1` (Tokyo) → Vercel `hnd1`
- Supabase `us-east-1` (US East) → Vercel `iad1`
- Supabase `eu-west-1` (EU West) → Vercel `fra1`

**Nếu Supabase ở region khác:**
1. Xác định region của Supabase
2. Cập nhật `regions` trong `cms/vercel.json` với region code tương ứng
3. Redeploy project

#### 3. Verify Region Configuration

Sau khi deploy, kiểm tra:
1. Vercel Dashboard → Project → Functions
2. Xem region được hiển thị trong function details
3. Test API response time để verify latency improvement

**Lưu ý:**
- Region configuration chỉ apply cho serverless functions (API routes)
- Static assets vẫn được serve từ edge network
- Latency improvement có thể thấy rõ nhất với database queries

## ✅ Checklist Before Deployment

- [ ] DATABASE_URL đã được set trong Vercel
- [ ] NEXT_PUBLIC_SUPABASE_URL đã được set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY đã được set
- [ ] NEXT_PUBLIC_APP_URL đã được set
- [ ] **Root Directory đã được set thành `cms` trong Vercel Settings**
- [ ] **Vercel region đã được cấu hình phù hợp với Supabase region** (đã set `sin1` trong vercel.json)
- [ ] Prisma client đã được generate (thêm vào build command)
- [ ] Database cho phép connections từ Vercel
- [ ] Test API endpoints sau khi deploy
