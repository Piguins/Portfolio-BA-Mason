# 📤 Hướng dẫn Upload Files lên PA Vietnam Hosting

Sau khi cấu hình DNS subdomain xong, làm theo các bước sau:

---

## ⏱️ Bước 1: Đợi DNS Propagate (5-15 phút)

DNS record vừa tạo cần thời gian để propagate. Đợi khoảng 5-15 phút trước khi tiếp tục.

**Kiểm tra DNS đã hoạt động:**
```bash
# Trên Mac/Linux:
nslookup portfolio.mason.id.vn

# Hoặc:
dig portfolio.mason.id.vn
```

Nếu thấy IP hosting trả về → DNS đã hoạt động ✅

---

## 📦 Bước 2: Build Project (Đã build xong)

Project đã được build. Kiểm tra folder `dist/`:

```
dist/
├── index.html
├── .htaccess
└── assets/
    ├── index-*.js
    ├── index-*.css
    ├── vendor-*.js
    └── icons-*.js
```

---

## 📤 Bước 3: Upload Files lên Hosting

### Cách 1: Upload qua File Manager (Khuyến nghị - Dễ nhất)

1. **Đăng nhập Control Panel PA Vietnam:**
   - Vào `support.pavietnam.vn`
   - Đăng nhập tài khoản

2. **Mở File Manager:**
   - Tìm và click **"File Manager"** hoặc **"Quản lý File"**

3. **Tạo thư mục:**
   - Vào folder: `public_html/`
   - Tạo folder mới tên: `portfolio` (nếu chưa có)

4. **Upload files:**
   - Mở folder `dist/` trên máy local
   - Upload **TẤT CẢ** files và folders vào `public_html/portfolio/`:
     - ✅ `index.html`
     - ✅ Folder `assets/` (toàn bộ nội dung bên trong)
     - ✅ `.htaccess`

5. **Kiểm tra sau khi upload:**
   - Folder `public_html/portfolio/` phải có:
     - `index.html`
     - Folder `assets/` (với 4 files bên trong)
     - `.htaccess`

### Cách 2: Upload qua FTP

1. **Kết nối FTP:**
   - Dùng FTP client: FileZilla, Cyberduck, WinSCP
   - Thông tin kết nối (lấy từ PA Vietnam):
     - **Host:** `ftp.mason.id.vn` hoặc IP hosting
     - **Username:** (tài khoản FTP từ control panel)
     - **Password:** (mật khẩu FTP)
     - **Port:** 21

2. **Upload files:**
   - Connect tới server
   - Navigate tới: `/public_html/portfolio/`
   - Upload tất cả files từ folder `dist/` lên đây

---

## ✅ Bước 4: Kiểm tra Website

### 4.1. Kiểm tra cơ bản:

1. **Truy cập website:**
   - Mở trình duyệt
   - Vào: `http://portfolio.mason.id.vn`
   - Hoặc: `https://portfolio.mason.id.vn` (nếu đã có SSL)

2. **Kiểm tra:**
   - ✅ Website có load được không?
   - ✅ CSS/styles hiển thị đúng không?
   - ✅ Images có load được không?
   - ✅ Navigation có hoạt động không?

### 4.2. Kiểm tra chi tiết:

- [ ] Homepage load đúng
- [ ] Hero section hiển thị
- [ ] Skills section hiển thị
- [ ] Portfolio section hiển thị
- [ ] Reviews section hiển thị
- [ ] FAQ section hiển thị
- [ ] CTA section hiển thị
- [ ] Navigation smooth scroll hoạt động
- [ ] Test trên mobile (responsive)

### 4.3. Kiểm tra Console:

1. Mở **Developer Tools** (F12)
2. Vào tab **Console**
3. Kiểm tra có lỗi nào không

---

## 🔒 Bước 5: Kích hoạt SSL/HTTPS (Quan trọng!)

### 5.1. Kích hoạt SSL miễn phí:

1. **Vào Control Panel PA Vietnam**
2. Tìm **"SSL/TLS"** hoặc **"Bảo mật SSL"**
3. Click **"Kích hoạt SSL"** hoặc **"Install SSL"**
4. Chọn domain: `portfolio.mason.id.vn`
5. Chọn **"Let's Encrypt"** (miễn phí)
6. Click **"Kích hoạt"** hoặc **"Install"**
7. Đợi 5-10 phút để SSL được cài đặt

### 5.2. Kiểm tra SSL:

1. Truy cập: `https://portfolio.mason.id.vn`
2. Kiểm tra có icon **🔒** (lock) trên thanh địa chỉ
3. Click vào icon **🔒** để xem thông tin SSL

### 5.3. Force HTTPS (Tùy chọn):

Có thể cấu hình redirect HTTP → HTTPS trong `.htaccess` (đã có sẵn)

---

## 🐛 Troubleshooting

### ❌ Website không load (404 hoặc blank page)

**Kiểm tra:**
1. File `index.html` đã upload chưa?
2. File `.htaccess` đã upload chưa?
3. Folder structure đúng chưa: `public_html/portfolio/index.html`
4. File permissions: Files `644`, Folders `755`

**Giải pháp:**
- Xóa và upload lại files
- Kiểm tra `.htaccess` có trong folder `portfolio/` không
- Liên hệ PA Vietnam support

### ❌ CSS/JS không load (trang trắng hoặc không có style)

**Kiểm tra:**
1. Folder `assets/` đã upload đầy đủ chưa?
2. Files trong `assets/` có đúng không? (4 files)
3. Đường dẫn trong `index.html` có đúng không?

**Giải pháp:**
- Upload lại folder `assets/` (toàn bộ)
- Clear browser cache (Ctrl+F5 hoặc Cmd+Shift+R)
- Kiểm tra Console (F12) xem có lỗi gì không

### ❌ DNS chưa hoạt động

**Kiểm tra:**
```bash
nslookup portfolio.mason.id.vn
```

**Giải pháp:**
- Đợi thêm 15-30 phút
- Clear DNS cache:
  - Mac/Linux: `sudo dscacheutil -flushcache`
  - Windows: `ipconfig /flushdns`
- Kiểm tra lại DNS record trong control panel

---

## 📝 Checklist tổng quát

- [ ] DNS subdomain đã cấu hình xong
- [ ] Đợi 5-15 phút để DNS propagate
- [ ] Build project: `npm run build`
- [ ] Kiểm tra folder `dist/` có đầy đủ files
- [ ] Upload files lên `public_html/portfolio/`
- [ ] Kiểm tra website hoạt động
- [ ] Test tất cả sections
- [ ] Kích hoạt SSL/HTTPS
- [ ] Test HTTPS hoạt động
- [ ] Test trên mobile

---

## 🎉 Hoàn thành!

Website của bạn đã live tại: **https://portfolio.mason.id.vn**

### Links hữu ích:
- Website: https://portfolio.mason.id.vn
- Support: https://support.pavietnam.vn
- Hotline: 1900 9477

---

## 🔄 Update lần sau

Khi cần update website:

1. **Build lại:**
   ```bash
   npm run build
   ```

2. **Upload files mới:**
   - Xóa files cũ trong `public_html/portfolio/`
   - Upload files mới từ `dist/`

3. **Kiểm tra:**
   - Truy cập website
   - Clear browser cache
   - Test lại

