# 🚀 Setup Auto Deploy - Deploy Tự Động

Chỉ cần **push code lên GitHub**, website sẽ tự động deploy lên hosting PA Vietnam!

---

## 📋 Yêu cầu

1. ✅ GitHub account (miễn phí)
2. ✅ Repository trên GitHub
3. ✅ FTP hoặc SSH credentials từ PA Vietnam

---

## 🎯 Cách 1: Deploy qua FTP (Khuyến nghị - Dễ nhất)

### Bước 1: Tạo GitHub Repository

```bash
# Nếu chưa có git repo
git init
git add .
git commit -m "Initial commit"

# Tạo repo trên GitHub (qua web hoặc GitHub CLI)
# Sau đó:
git remote add origin https://github.com/YOUR_USERNAME/portfolio-ba-mason.git
git branch -M main
git push -u origin main
```

### Bước 2: Setup GitHub Secrets

1. **Vào GitHub Repository:**
   - Vào repo trên GitHub
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Thêm Secrets mới:**
   
   Click **"New repository secret"** và thêm 3 secrets:

   - **Name:** `FTP_SERVER`
     - **Value:** `ftp.mason.id.vn` hoặc IP hosting PA Vietnam
   
   - **Name:** `FTP_USERNAME`
     - **Value:** Tài khoản FTP từ PA Vietnam control panel
   
   - **Name:** `FTP_PASSWORD`
     - **Value:** Mật khẩu FTP từ PA Vietnam control panel

### Bước 3: Lấy FTP Credentials từ PA Vietnam

1. **Đăng nhập PA Vietnam:** `support.pavietnam.vn`
2. **Vào FTP Accounts:**
   - Tìm **"FTP Accounts"** hoặc **"Quản lý FTP"**
   - Copy thông tin:
     - FTP Server/Host
     - FTP Username
     - FTP Password

### Bước 4: Test Deploy

1. **Push code lên GitHub:**
   ```bash
   git add .
   git commit -m "Setup auto deploy"
   git push origin main
   ```

2. **Kiểm tra GitHub Actions:**
   - Vào tab **"Actions"** trên GitHub
   - Xem workflow chạy
   - Đợi deploy hoàn thành (2-3 phút)

3. **Kiểm tra website:**
   - Truy cập: `https://portfolio.mason.id.vn`
   - Website sẽ tự động cập nhật!

---

## 🔧 Cách 2: Deploy qua SSH (Nếu có SSH access)

### Bước 1: Enable SSH workflow

File `.github/workflows/deploy-ssh.yml` đã được tạo sẵn.

### Bước 2: Setup SSH Secrets

Thêm secrets trong GitHub:

- **`SSH_HOST`:** IP hosting hoặc domain
- **`SSH_USERNAME`:** SSH username
- **`SSH_PASSWORD`:** SSH password (hoặc dùng SSH key)
- **`SSH_PORT`:** 22 (hoặc port khác)

### Bước 3: Push và Deploy

```bash
git add .
git commit -m "Enable SSH deploy"
git push origin main
```

---

## ✨ Cách sử dụng sau khi setup

### Deploy mỗi khi có thay đổi:

1. **Sửa code:**
   ```bash
   # Sửa files trong src/
   ```

2. **Commit và push:**
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

3. **Tự động deploy:**
   - GitHub Actions tự động chạy
   - Build project
   - Deploy lên hosting
   - **Website tự động cập nhật!** ✅

### Deploy thủ công (nếu cần):

1. Vào GitHub Repository
2. Click tab **"Actions"**
3. Chọn workflow **"Deploy to PA Vietnam Hosting"**
4. Click **"Run workflow"**
5. Chọn branch `main`
6. Click **"Run workflow"**

---

## 📝 Workflow Files

### `.github/workflows/deploy.yml` (FTP)
- ✅ Tự động build khi push code
- ✅ Deploy qua FTP
- ✅ Xóa files cũ trước khi upload mới
- ✅ Chỉ chạy khi push lên branch `main`

### `.github/workflows/deploy-ssh.yml` (SSH)
- ✅ Alternative option nếu có SSH access
- ✅ Deploy qua SCP
- ✅ Tự động copy .htaccess

---

## 🔐 Security Best Practices

### Bảo mật Secrets:

1. ✅ **KHÔNG** commit credentials vào code
2. ✅ **CHỈ** dùng GitHub Secrets
3. ✅ **KHÔNG** share secrets với ai
4. ✅ Rotate password định kỳ

### Cấu trúc Secrets:

```
FTP_SERVER: ftp.mason.id.vn (hoặc IP)
FTP_USERNAME: your_ftp_username
FTP_PASSWORD: your_ftp_password
```

---

## 🐛 Troubleshooting

### ❌ Deploy thất bại - FTP connection error

**Kiểm tra:**
1. FTP credentials đúng chưa?
2. FTP server address đúng chưa?
3. Firewall có chặn FTP không?

**Giải pháp:**
- Kiểm tra lại secrets trong GitHub
- Test FTP connection bằng FTP client trước
- Liên hệ PA Vietnam support

### ❌ Files không upload được

**Kiểm tra:**
1. Folder `public_html/portfolio/` có tồn tại không?
2. FTP user có quyền write không?

**Giải pháp:**
- Tạo folder `portfolio` trước (nếu chưa có)
- Kiểm tra FTP permissions
- Dùng `server-dir` đúng path

### ❌ Build failed

**Kiểm tra:**
1. Code có lỗi không?
2. Dependencies có đầy đủ không?

**Giải pháp:**
- Test build local: `npm run build`
- Kiểm tra GitHub Actions logs
- Fix lỗi và push lại

---

## ✅ Checklist Setup

- [ ] GitHub repository đã tạo
- [ ] Code đã push lên GitHub
- [ ] FTP credentials đã lấy từ PA Vietnam
- [ ] GitHub Secrets đã setup (3 secrets)
- [ ] Test deploy lần đầu
- [ ] Kiểm tra website hoạt động
- [ ] Test update code và deploy tự động

---

## 🎉 Sau khi setup xong

Bây giờ bạn chỉ cần:

1. **Sửa code** trong project
2. **Commit:** `git commit -m "Update"`
3. **Push:** `git push origin main`
4. **Đợi 2-3 phút** → Website tự động update! ✅

**Không cần:**
- ❌ Build thủ công
- ❌ Upload files qua FTP/File Manager
- ❌ Copy files thủ công
- ❌ Tương tác với hosting panel

---

## 📚 Tài liệu tham khảo

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [SCP Deploy Action](https://github.com/appleboy/scp-action)

