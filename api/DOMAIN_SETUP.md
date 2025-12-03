# Hướng dẫn trỏ domain api.mason.id.vn sang Vercel API

## BƯỚC 1: Thêm Domain trong Vercel Dashboard

1. Vào: https://vercel.com/masons-projects-006ee71d/portfolioapi/settings/domains
2. Click **"Add"** hoặc **"Add Domain"**
3. Nhập: `api.mason.id.vn`
4. Click **"Add"**

## BƯỚC 2: Cấu hình DNS Records

Vercel sẽ hiển thị DNS records cần thêm. Thông thường sẽ có 2 options:

### Option A: CNAME Record (Khuyến nghị)
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: 3600 (hoặc Auto)
```

### Option B: A Record
```
Type: A
Name: api
Value: 76.76.21.21 (hoặc IP mà Vercel cung cấp)
TTL: 3600
```

## BƯỚC 3: Thêm DNS Records vào Domain Provider

1. Đăng nhập vào nhà cung cấp domain (nơi bạn mua `mason.id.vn`)
2. Vào phần **DNS Management** hoặc **DNS Settings**
3. Thêm record theo hướng dẫn ở Bước 2
4. Lưu lại

## BƯỚC 4: Verify Domain trong Vercel

1. Quay lại Vercel Dashboard
2. Vercel sẽ tự động verify domain (có thể mất 5-60 phút)
3. Khi status chuyển sang **"Valid"** → Domain đã sẵn sàng!

## BƯỚC 5: Kiểm tra

Sau khi DNS propagate (5-60 phút), test:
- https://api.mason.id.vn/health
- https://api.mason.id.vn/api-docs

## Lưu ý

- DNS propagation có thể mất 5-60 phút (đôi khi lâu hơn)
- Đảm bảo domain `mason.id.vn` đã được verify trước
- Nếu dùng CNAME, không được có A record khác cho `api` subdomain
- SSL certificate sẽ được Vercel tự động cấp (Let's Encrypt)

