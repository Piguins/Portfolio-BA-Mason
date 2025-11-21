# Hướng dẫn Deploy lên PA Vietnam Hosting

## 📋 Yêu cầu
- Tài khoản hosting PA Vietnam với domain `mason.id.vn`
- FTP/File Manager access
- Subdomain `portfolio.mason.id.vn` đã được tạo

## 🚀 Bước 1: Build Project

### Build production:
```bash
npm run build
```

Sau khi build, folder `dist/` sẽ được tạo chứa tất cả files cần deploy.

## 🌐 Bước 2: Tạo Subdomain trên PA Vietnam

### Cách tạo subdomain `portfolio.mason.id.vn`:

1. **Đăng nhập vào Control Panel PA Vietnam:**
   - Vào `support.pavietnam.vn`
   - Đăng nhập với tài khoản của bạn

2. **Tạo Subdomain:**
   - Vào mục **"Tên miền"** hoặc **"Quản lý Domain"**
   - Chọn domain `mason.id.vn`
   - Tìm mục **"Subdomain"** hoặc **"Quản lý Subdomain"**
   - Click **"Thêm Subdomain"**
   - Nhập: `portfolio`
   - Chọn thư mục đích (ví dụ: `public_html/portfolio` hoặc `portfolio`)
   - Lưu lại

3. **Hoặc tạo qua DNS:**
   - Nếu có quyền quản lý DNS:
   - Thêm A Record: `portfolio` → IP hosting
   - Hoặc CNAME: `portfolio` → `mason.id.vn`

## 📤 Bước 3: Upload Files lên Hosting

### Cách 1: Upload qua File Manager (khuyến nghị)

1. **Đăng nhập File Manager:**
   - Vào control panel PA Vietnam
   - Mở **"File Manager"**

2. **Tạo thư mục cho subdomain:**
   - Tạo folder: `portfolio` trong `public_html/`

3. **Upload files:**
   - Upload TẤT CẢ files trong folder `dist/` lên `public_html/portfolio/`
   - Bao gồm:
     - `index.html`
     - Folder `assets/`
     - Tất cả files khác trong `dist/`

4. **Upload .htaccess:**
   - Copy file `.htaccess` từ `public/.htaccess`
   - Upload vào `public_html/portfolio/.htaccess`

### Cách 2: Upload qua FTP

```bash
# Sử dụng FTP client (FileZilla, Cyberduck, etc.)
# Connect tới FTP server PA Vietnam
# Upload tất cả files từ folder dist/ lên:
/public_html/portfolio/
```

## ✅ Bước 4: Kiểm tra

1. Truy cập: `https://portfolio.mason.id.vn`
2. Kiểm tra website hoạt động đúng
3. Kiểm tra các routes/sections hoạt động

## 🔧 Troubleshooting

### Nếu gặp lỗi 404:
- Kiểm tra file `.htaccess` đã được upload
- Kiểm tra Apache mod_rewrite đã bật
- Liên hệ support PA Vietnam nếu cần

### Nếu assets không load:
- Kiểm tra đường dẫn trong `index.html`
- Đảm bảo folder `assets/` đã được upload đầy đủ

### Nếu subdomain không hoạt động:
- Đợi DNS propagate (15-30 phút)
- Clear DNS cache
- Kiểm tra DNS records đã đúng chưa

## 📝 Lưu ý

- **Base path:** Project đã được cấu hình với relative paths (`base: './'`)
- **HTTPS:** Nên sử dụng HTTPS (PA Vietnam thường có SSL miễn phí)
- **Backup:** Luôn backup files cũ trước khi deploy mới

## 🔄 Deploy lần sau

1. Chạy `npm run build`
2. Upload files mới lên hosting (ghi đè files cũ)
3. Clear browser cache để xem thay đổi

