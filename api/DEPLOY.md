# Deploy API lên Vercel

## 🚀 Quick Deploy

### Cách 1: Deploy qua Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd api
vercel

# Deploy to production
vercel --prod
```

### Cách 2: Deploy qua Vercel Dashboard

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import Git repository: `Piguins/Portfolio-BA-Mason`
4. **Root Directory**: Chọn `api`
5. **Framework Preset**: Other
6. **Build Command**: `npm install` (hoặc để trống)
7. **Output Directory**: `.` (hoặc để trống)
8. **Install Command**: `npm install`

### Environment Variables

Trong Vercel Dashboard → Project Settings → Environment Variables, thêm:

```
DATABASE_URL=postgresql://postgres.qeqjowagaybaejjyqjkg:YOUR_PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
NODE_ENV=production
API_URL=https://your-api-url.vercel.app
```

**Lưu ý:** 
- Thay `YOUR_PASSWORD` bằng password thực tế từ Supabase
- `API_URL` sẽ được tự động set bởi Vercel, nhưng có thể override nếu cần

## 📚 Swagger Documentation

Sau khi deploy, Swagger docs sẽ có tại:
- `https://your-api-url.vercel.app/api-docs`

## 🔍 Test sau khi deploy

```bash
# Health check
curl https://your-api-url.vercel.app/health

# Get projects
curl https://your-api-url.vercel.app/api/projects

# Get skills
curl https://your-api-url.vercel.app/api/skills

# Swagger docs
open https://your-api-url.vercel.app/api-docs
```

## 🛠️ Local Development

```bash
cd api
npm install
npm run dev
```

API sẽ chạy tại: `http://localhost:4000`
Swagger docs: `http://localhost:4000/api-docs`

## 📝 Notes

- Vercel sẽ tự động detect `vercel.json` trong thư mục `api/`
- API được deploy dưới dạng serverless functions
- Database connection pool sẽ được tạo mới cho mỗi request (serverless)
- Swagger UI sẽ tự động generate từ JSDoc comments trong code

