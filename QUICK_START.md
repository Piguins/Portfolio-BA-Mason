# ⚡ Quick Start - Deploy Tự Động

## 🎯 Mục tiêu
Chỉ cần **push code lên GitHub** → Website tự động deploy! 🚀

---

## 📝 Setup một lần (5 phút)

### Bước 1: Push code lên GitHub

```bash
# Thêm tất cả files
git add .

# Commit
git commit -m "Setup auto deploy"

# Push lên GitHub
git push origin main
```

### Bước 2: Setup GitHub Secrets

1. **Vào GitHub Repository:**
   - Vào repo trên GitHub
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Thêm 3 Secrets:**
   
   Click **"New repository secret"** 3 lần:

   **Secret 1:**
   - Name: `FTP_SERVER`
   - Value: `ftp.mason.id.vn` (hoặc IP hosting từ PA Vietnam)

   **Secret 2:**
   - Name: `FTP_USERNAME`
   - Value: Tài khoản FTP từ PA Vietnam

   **Secret 3:**
   - Name: `FTP_PASSWORD`
   - Value: Mật khẩu FTP từ PA Vietnam

### Bước 3: Lấy FTP Credentials từ PA Vietnam

1. Đăng nhập: `support.pavietnam.vn`
2. Vào **"FTP Accounts"** hoặc **"Quản lý FTP"**
3. Copy thông tin:
   - FTP Server/Host
   - FTP Username
   - FTP Password

### Bước 4: Test Deploy

```bash
# Push code để trigger deploy
git add .
git commit -m "Test auto deploy"
git push origin main
```

**Kiểm tra:**
1. Vào GitHub → Tab **"Actions"**
2. Xem workflow chạy (2-3 phút)
3. Truy cập: `https://portfolio.mason.id.vn`
4. Website đã update! ✅

---

## ✨ Sử dụng sau khi setup

### Deploy mỗi khi có thay đổi:

```bash
# 1. Sửa code trong src/

# 2. Commit
git add .
git commit -m "Update portfolio"

# 3. Push → Tự động deploy!
git push origin main
```

**Chờ 2-3 phút** → Website tự động cập nhật! 🎉

---

## 🔍 Kiểm tra Deploy

### Cách 1: GitHub Actions

1. Vào GitHub Repository
2. Click tab **"Actions"**
3. Xem workflow chạy
4. Checkmark xanh → Deploy thành công! ✅

### Cách 2: Website

1. Truy cập: `https://portfolio.mason.id.vn`
2. Clear cache: `Cmd+Shift+R` (Mac) hoặc `Ctrl+F5` (Windows)
3. Kiểm tra thay đổi đã hiển thị

---

## 🎯 Workflow Files

- ✅ `.github/workflows/deploy.yml` - Auto deploy qua FTP
- ✅ Chạy mỗi khi push lên `main` branch
- ✅ Tự động build và deploy

---

## ✅ Checklist Setup

- [ ] Code đã push lên GitHub
- [ ] GitHub Secrets đã setup (3 secrets)
- [ ] FTP credentials từ PA Vietnam đã lấy
- [ ] Test deploy lần đầu thành công
- [ ] Website hoạt động đúng

---

## 🚨 Troubleshooting

### ❌ Deploy thất bại

**Kiểm tra:**
1. GitHub Secrets đúng chưa?
2. FTP server address đúng chưa?
3. Folder `public_html/portfolio/` tồn tại chưa?

**Giải pháp:**
- Check GitHub Actions logs
- Verify FTP credentials
- Tạo folder `portfolio` trên hosting nếu chưa có

---

## 🎉 Hoàn thành!

Bây giờ bạn **chỉ cần push code** → Website tự động deploy!

**Không cần:**
- ❌ Build thủ công
- ❌ Upload files
- ❌ Vào hosting panel

