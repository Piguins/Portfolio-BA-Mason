# Vercel Deployment Configuration

## Project Settings Checklist

Để Vercel tự động deploy project `portfolioapi`, cần đảm bảo:

1. **Root Directory**: Trong Vercel Dashboard → Settings → General → Root Directory
   - Phải set là: `api`
   - Hoặc để trống nếu deploy từ root repo

2. **Build Command**: 
   - Để trống (không cần build step)
   - Hoặc: `echo "No build required"`

3. **Output Directory**: 
   - Để trống

4. **Install Command**: 
   - `npm install` (default)

5. **Framework Preset**: 
   - `Other` hoặc `Node.js`

6. **Environment Variables**: 
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`

## Manual Deploy

Nếu auto-deploy không hoạt động:
1. Vào Vercel Dashboard → Deployments
2. Click "Redeploy" trên deployment mới nhất
3. Hoặc trigger từ GitHub: Settings → Git → Production Branch → Redeploy

## Troubleshooting

- Kiểm tra webhook GitHub: Settings → Git → Production Branch
- Kiểm tra branch: Phải là `main`
- Kiểm tra root directory: Phải là `api`

