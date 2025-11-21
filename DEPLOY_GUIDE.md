# 🚀 Hướng dẫn Deploy Portfolio lên PA Vietnam Hosting

## 📋 Yêu cầu
- Tài khoản hosting PA Vietnam với domain `mason.id.vn`
- FTP/File Manager access
- Node.js và npm đã cài đặt trên máy local

---

## 📦 Bước 1: Build Project

### Build production files:
```bash
npm run build
```

Sau khi build thành công, folder `dist/` sẽ được tạo chứa tất cả files cần deploy.

### Kiểm tra build:
```bash
# Xem trước production build
npm run preview
```

---

## 🌐 Bước 2: Tạo Subdomain trên PA Vietnam

### Cách 1: Tạo qua Control Panel PA Vietnam

1. **Đăng nhập:**
   - Vào `support.pavietnam.vn`
   - Đăng nhập với tài khoản của bạn

2. **Tạo Subdomain:**
   - Vào **"Quản lý Domain"** hoặc **"Domain Management"**
   - Chọn domain `mason.id.vn`
   - Tìm mục **"Subdomain"** hoặc **"Tạo Subdomain"**
   - Nhập thông tin:
     - **Tên subdomain:** `portfolio`
     - **Thư mục đích:** `public_html/portfolio` hoặc `portfolio`
   - Click **"Tạo"** hoặc **"Submit"**
   - Đợi 5-10 phút để DNS propagate

### Cách 2: Tạo qua DNS Records (nếu có quyền)

1. Vào **"Quản lý DNS"** của domain `mason.id.vn`
2. Thêm record mới:
   - **Type:** A (hoặc CNAME)
   - **Name/Host:** `portfolio`
   - **Value:** IP hosting (hoặc `mason.id.vn` nếu dùng CNAME)
   - **TTL:** 3600
3. Lưu lại và đợi DNS update

---

## 📤 Bước 3: Upload Files lên Hosting

### Cách 1: Upload qua File Manager (Khuyến nghị - Dễ nhất)

1. **Đăng nhập File Manager:**
   - Vào control panel PA Vietnam
   - Click **"File Manager"** hoặc **"Quản lý File"**

2. **Tạo thư mục:**
   - Vào folder `public_html/`
   - Tạo folder mới: `portfolio` (nếu chưa có)

3. **Upload files từ folder `dist/`:**
   - Mở folder `dist/` trên máy local
   - Upload **TẤT CẢ** files và folders:
     - `index.html`
     - Folder `assets/` (và tất cả files bên trong)
   - Upload vào: `public_html/portfolio/`

4. **Upload `.htaccess`:**
   - Copy file `.htaccess` từ `public/.htaccess`
   - Upload vào: `public_html/portfolio/.htaccess`

### Cách 2: Upload qua FTP

1. **Kết nối FTP:**
   - Dùng FTP client (FileZilla, Cyberduck, WinSCP)
   - Thông tin kết nối (lấy từ PA Vietnam control panel):
     - Host: `ftp.mason.id.vn` hoặc IP hosting
     - Username: (tài khoản FTP)
     - Password: (mật khẩu FTP)
     - Port: 21

2. **Upload files:**
   - Connect tới server
   - Vào folder: `/public_html/portfolio/`
   - Upload tất cả files từ `dist/` lên đây

---

## ✅ Bước 4: Kiểm tra và Test

1. **Truy cập website:**
   - Mở trình duyệt
   - Vào: `https://portfolio.mason.id.vn`
   - Hoặc: `http://portfolio.mason.id.vn` (nếu chưa có SSL)

2. **Kiểm tra:**
   - ✅ Website load đúng
   - ✅ CSS/styles hiển thị đúng
   - ✅ Images load đúng
   - ✅ Navigation hoạt động (smooth scroll)
   - ✅ Tất cả sections hiển thị

3. **Test trên mobile:**
   - Mở trên điện thoại
   - Kiểm tra responsive

---

## 🔧 Cấu hình bổ sung

### Kích hoạt HTTPS (SSL)

1. Vào control panel PA Vietnam
2. Tìm **"SSL/TLS"** hoặc **"Bảo mật SSL"**
3. Kích hoạt SSL miễn phí (Let's Encrypt)
4. Chọn domain: `portfolio.mason.id.vn`
5. Kích hoạt và đợi 5-10 phút

### Cấu hình .htaccess (Đã có sẵn)

File `.htaccess` đã được tạo với các tính năng:
- ✅ Redirect tất cả requests về `index.html` (cho React Router)
- ✅ Enable compression (gzip)
- ✅ Cache static assets
- ✅ Security headers

---

## 🔄 Deploy lần sau (Update)

1. **Build lại:**
   ```bash
   npm run build
   ```

2. **Upload files mới:**
   - Xóa files cũ trong `public_html/portfolio/`
   - Upload files mới từ `dist/`

3. **Hoặc chỉ upload files thay đổi:**
   - So sánh files cũ và mới
   - Chỉ upload files đã thay đổi

---

## 🐛 Troubleshooting

### ❌ Lỗi 404 khi truy cập routes
**Giải pháp:**
- Kiểm tra file `.htaccess` đã upload chưa
- Kiểm tra Apache mod_rewrite đã bật
- Liên hệ support PA Vietnam

### ❌ Assets (CSS/JS) không load
**Giải pháp:**
- Kiểm tra folder `assets/` đã upload đầy đủ
- Kiểm tra đường dẫn trong `index.html`
- Clear browser cache

### ❌ Subdomain không hoạt động
**Giải pháp:**
- Đợi 15-30 phút để DNS propagate
- Clear DNS cache: `ipconfig /flushdns` (Windows) hoặc `sudo dscacheutil -flushcache` (Mac)
- Kiểm tra DNS records đã đúng chưa

### ❌ Website hiển thị sai màu/font
**Giải pháp:**
- Kiểm tra CSS files đã upload đầy đủ
- Kiểm tra Google Fonts đã load chưa (check console)
- Clear browser cache

---

## 📝 Lưu ý quan trọng

1. **Backup trước khi deploy:**
   - Luôn backup files cũ trước khi upload files mới

2. **File permissions:**
   - Files: `644`
   - Folders: `755`

3. **SSL/HTTPS:**
   - Nên kích hoạt HTTPS cho website
   - PA Vietnam thường có SSL miễn phí

4. **Performance:**
   - File `.htaccess` đã được cấu hình với caching và compression
   - Có thể tăng tốc website đáng kể

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, liên hệ:
- **PA Vietnam Support:** 1900 9477
- **Email:** support@pavietnam.vn
- **Website:** support.pavietnam.vn

