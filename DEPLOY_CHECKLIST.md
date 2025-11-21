# ✅ Checklist Deploy lên PA Vietnam

## 📋 Trước khi Deploy

- [ ] Build project thành công: `npm run build`
- [ ] Kiểm tra folder `dist/` có đầy đủ files
- [ ] Test local với: `npm run preview`

## 🌐 Tạo Subdomain

### Trên PA Vietnam Control Panel:

1. [ ] Đăng nhập vào `support.pavietnam.vn`
2. [ ] Vào **"Quản lý Domain"** → Chọn `mason.id.vn`
3. [ ] Vào **"Subdomain"** hoặc **"Tạo Subdomain"**
4. [ ] Tạo subdomain:
   - **Tên:** `portfolio`
   - **Thư mục:** `public_html/portfolio`
   - [ ] Click **"Tạo"**
5. [ ] Đợi 5-10 phút để DNS propagate

## 📤 Upload Files

### Cách 1: File Manager (Khuyến nghị)

1. [ ] Mở **File Manager** trên control panel
2. [ ] Vào folder: `public_html/`
3. [ ] Tạo folder `portfolio` (nếu chưa có)
4. [ ] Upload files từ folder `dist/`:
   - [ ] `index.html`
   - [ ] Folder `assets/` (toàn bộ)
   - [ ] `.htaccess` (nếu có)
5. [ ] Kiểm tra permissions:
   - Files: `644`
   - Folders: `755`

### Cách 2: FTP

1. [ ] Kết nối FTP với thông tin từ PA Vietnam
2. [ ] Vào folder: `/public_html/portfolio/`
3. [ ] Upload tất cả files từ `dist/`
4. [ ] Kiểm tra upload thành công

## ✅ Kiểm tra sau Deploy

- [ ] Truy cập: `https://portfolio.mason.id.vn`
- [ ] Website load được
- [ ] CSS/styles hiển thị đúng
- [ ] Images load được
- [ ] Navigation hoạt động (smooth scroll)
- [ ] Test trên mobile (responsive)
- [ ] Test các sections: Hero, Skills, Portfolio, Reviews, FAQ, CTA

## 🔒 Kích hoạt SSL

1. [ ] Vào **"SSL/TLS"** trên control panel
2. [ ] Chọn domain: `portfolio.mason.id.vn`
3. [ ] Kích hoạt SSL miễn phí (Let's Encrypt)
4. [ ] Đợi 5-10 phút
5. [ ] Test: `https://portfolio.mason.id.vn`

## 📝 Lưu ý

- ⚠️ **Backup files cũ** trước khi upload mới
- ⚠️ **Đợi DNS propagate** (15-30 phút)
- ⚠️ **Clear browser cache** để xem thay đổi
- ⚠️ Kiểm tra `.htaccess` đã upload đúng chưa

## 🎉 Hoàn thành!

Website của bạn đã live tại: `https://portfolio.mason.id.vn`

---

## 🔄 Update lần sau

1. Build: `npm run build`
2. Upload files mới lên hosting
3. Clear cache và test

