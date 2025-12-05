# Fix Build Command Error for portfolioapi

## Lỗi
```
sh: line 1: cd: apps/portfolio: No such file or directory
Error: Command "cd apps/portfolio && npm install && npm run build" exited with 1
```

## Nguyên nhân
Project `portfolioapi` trên Vercel đang có **Build Command** sai - nó đang cố chạy command của project `portfolio` thay vì API.

## Cách fix

### Bước 1: Vào Vercel Dashboard
1. Vào project `portfolioapi` → **Settings** → **General**
2. Scroll xuống phần **Build & Development Settings**

### Bước 2: Sửa Build Command
1. Tìm **Build Command**
2. **XÓA** command hiện tại: `cd apps/portfolio && npm install && npm run build`
3. **THAY BẰNG**: Để **TRỐNG** (hoặc `echo "No build required"`)
4. Vì API không cần build step, chỉ cần install dependencies

### Bước 3: Kiểm tra các settings khác
1. **Root Directory**: Phải là `api` (KHÔNG phải để trống)
2. **Install Command**: `npm install` (hoặc để trống)
3. **Output Directory**: Để **TRỐNG**
4. **Framework Preset**: `Other` hoặc `Node.js`

### Bước 4: Save và Redeploy
1. Click **Save**
2. Vào **Deployments** tab
3. Click **Redeploy** trên deployment mới nhất
4. Hoặc đợi auto-deploy từ commit mới

## Lưu ý
- API project (`portfolioapi`) KHÔNG cần build command
- Chỉ cần install dependencies (`npm install`)
- Vercel sẽ tự động detect `index.js` và chạy serverless function
- File `vercel.json` trong `api/` đã được cấu hình đúng

