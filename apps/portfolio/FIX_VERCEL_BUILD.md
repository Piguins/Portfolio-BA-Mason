# Fix Vercel Build Error for Portfolio Project

## Lỗi
```
sh: line 1: cd: apps/portfolio: No such file or directory
Error: Command "cd apps/portfolio && npm install && npm run build" exited with 1
```

## Nguyên nhân
Vercel project `portfolio` đang có **Root Directory** hoặc **Build Command** sai.

## Cách fix

### Bước 1: Kiểm tra Root Directory
1. Vào Vercel Dashboard → Project `portfolio` → **Settings** → **General**
2. Tìm phần **Root Directory**
3. Phải set là: `apps/portfolio`
4. Nếu để trống hoặc sai, sửa lại và **Save**

### Bước 2: Kiểm tra Build Command
1. Vào **Settings** → **General** → **Build & Development Settings**
2. **Build Command** phải là: `npm run build` (KHÔNG có `cd apps/portfolio`)
3. **Output Directory** phải là: `dist`
4. **Install Command** phải là: `npm install` (hoặc để trống)
5. **Framework Preset** phải là: `Vite`

### Bước 3: Nếu vẫn lỗi
1. Xóa project `portfolio` trên Vercel (hoặc disconnect)
2. Tạo lại project mới
3. Connect GitHub repo: `Piguins/Portfolio-BA-Mason`
4. **Quan trọng**: Set **Root Directory** = `apps/portfolio`
5. Framework: Chọn **Vite** (hoặc **Other**)
6. Deploy

## Lưu ý
- Nếu Root Directory đã đúng là `apps/portfolio`, thì build command KHÔNG cần `cd apps/portfolio`
- Vercel sẽ tự động chạy command trong root directory đã set
- File `vercel.json` trong `apps/portfolio/` sẽ được tự động detect

