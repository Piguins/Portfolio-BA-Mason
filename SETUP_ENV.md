# 🔧 Hướng dẫn Setup Environment Variables

## 📋 Tổng quan

Project này có 2 phần cần setup environment variables:
1. **API** (`api/`) - Backend Express.js server
2. **CMS** (`cms/`) - Frontend Next.js admin dashboard

## 🚀 Bước 1: Lấy thông tin từ Supabase

### 1.1. Truy cập Supabase Dashboard
- URL: https://supabase.com/dashboard/project/qeqjowagaybaejjyqjkg
- Project ID: `qeqjowagaybaejjyqjkg`

### 1.2. Lấy Database Connection String

1. Vào **Settings** → **Database**
2. Tìm phần **Connection string**
3. Chọn **Transaction mode** (port 6543) cho serverless/Vercel
4. Copy connection string, format sẽ như:
   ```
   postgres://postgres.qeqjowagaybaejjyqjkg:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
5. **Thêm `?pgbouncer=true` vào cuối** (code đã tự động thêm, nhưng có thể thêm thủ công):
   ```
   postgres://postgres.qeqjowagaybaejjyqjkg:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### 1.3. Lấy Supabase API Keys

1. Vào **Settings** → **API**
2. Copy các keys sau:
   - **Project URL**: `https://qeqjowagaybaejjyqjkg.supabase.co`
   - **anon/public key**: `eyJhbGc...` (dài)
   - **service_role key**: `eyJhbGc...` (dài, **KHÔNG BAO GIỜ** expose ra frontend)

## 🔧 Bước 2: Setup API Environment Variables

### 2.1. Tạo file `.env` trong `api/`

```bash
cd api
cp .env.example .env
```

### 2.2. Điền thông tin vào `api/.env`

```env
# Database Connection (lấy từ Supabase Dashboard → Database)
DATABASE_URL=postgres://postgres.qeqjowagaybaejjyqjkg:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Supabase Configuration (lấy từ Supabase Dashboard → API)
SUPABASE_URL=https://qeqjowagaybaejjyqjkg.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (copy từ anon/public key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (copy từ service_role key)

# Optional
PORT=4000
NODE_ENV=development
```

### 2.3. Test API locally

```bash
cd api
npm install
npm run dev
```

API sẽ chạy tại: http://localhost:4000

## 🎨 Bước 3: Setup CMS Environment Variables

### 3.1. Tạo file `.env.local` trong `cms/`

```bash
cd cms
cp .env.local.example .env.local
```

### 3.2. Điền thông tin vào `cms/.env.local`

```env
# Supabase Configuration (lấy từ Supabase Dashboard → API)
NEXT_PUBLIC_SUPABASE_URL=https://qeqjowagaybaejjyqjkg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (copy từ anon/public key)

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3. Test CMS locally

```bash
cd cms
npm install
npm run dev
```

CMS sẽ chạy tại: http://localhost:3000

## ☁️ Bước 4: Setup Vercel Environment Variables

### 4.1. API Project trên Vercel

Vào Vercel Dashboard → API Project → Settings → Environment Variables, thêm:

```
DATABASE_URL=postgres://postgres.qeqjowagaybaejjyqjkg:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://qeqjowagaybaejjyqjkg.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NODE_ENV=production
```

### 4.2. CMS Project trên Vercel

Vào Vercel Dashboard → CMS Project → Settings → Environment Variables, thêm:

```
NEXT_PUBLIC_SUPABASE_URL=https://qeqjowagaybaejjyqjkg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://api.mason.id.vn
NEXT_PUBLIC_APP_URL=https://admin.mason.id.vn
```

## ✅ Checklist

- [ ] Đã tạo `api/.env` với DATABASE_URL và Supabase keys
- [ ] Đã tạo `cms/.env.local` với NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Đã test API locally (http://localhost:4000)
- [ ] Đã test CMS locally (http://localhost:3000)
- [ ] Đã setup environment variables trên Vercel cho API project
- [ ] Đã setup environment variables trên Vercel cho CMS project

## 🆘 Troubleshooting

### Database connection failed
- Kiểm tra DATABASE_URL có đúng format không
- Kiểm tra password có đúng không
- Đảm bảo đang dùng port 6543 (transaction mode) cho serverless
- Đảm bảo có `?pgbouncer=true` trong connection string

### Supabase auth not working
- Kiểm tra NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY
- Đảm bảo keys không có khoảng trắng thừa
- Kiểm tra Supabase project có đang active không

### API calls failing
- Kiểm tra NEXT_PUBLIC_API_URL có đúng không
- Kiểm tra API server có đang chạy không
- Kiểm tra CORS settings trong API

