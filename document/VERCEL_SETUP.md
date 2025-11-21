# ⚡ Setup Vercel - Deploy Miễn Phí trong 5 phút

## 🎯 Tại sao Vercel?

- ✅ **Miễn phí 100%**
- ✅ **Tự động deploy** từ GitHub
- ✅ **HTTPS miễn phí** (SSL tự động)
- ✅ **Custom domain miễn phí** (portfolio.mason.id.vn)
- ✅ **CDN global** (nhanh siêu tốc)
- ✅ **Setup trong 5 phút**

---

## 📋 Bước 1: Đăng ký Vercel

1. **Vào Vercel:**
   - Truy cập: https://vercel.com
   - Click **"Sign Up"**

2. **Đăng nhập bằng GitHub:**
   - Click **"Continue with GitHub"**
   - Authorize Vercel access vào GitHub account
   - Đăng nhập xong

---

## 🚀 Bước 2: Import Project

1. **Add New Project:**
   - Click **"Add New..."** → **"Project"**
   - Hoặc vào: https://vercel.com/new

2. **Import Repository:**
   - Tìm repository: `Piguins/Portfolio-BA-Mason`
   - Click **"Import"**

3. **Cấu hình Build:**
   - **Framework Preset:** Vite (hoặc để auto-detect)
   - **Root Directory:** `./` (giữ nguyên)
   - **Build Command:** `npm run build` (tự động detect)
   - **Output Directory:** `dist` (tự động detect)
   - **Install Command:** `npm install` (tự động detect)
   - Click **"Deploy"**

4. **Đợi Deploy:**
   - Vercel sẽ tự động:
     - Install dependencies
     - Build project
     - Deploy lên Vercel
   - Đợi 1-2 phút

5. **Kiểm tra:**
   - Sau khi deploy xong, Vercel sẽ cho URL: `https://portfolio-ba-mason-xxxxx.vercel.app`
   - Truy cập URL này để xem website
   - ✅ Website đã live!

---

## 🌐 Bước 3: Thêm Custom Domain (portfolio.mason.id.vn)

### 3.1. Thêm Domain vào Vercel

1. **Vào Project Settings:**
   - Trong Vercel dashboard
   - Click vào project **"Portfolio-BA-Mason"**
   - Click tab **"Settings"** → **"Domains"**

2. **Add Domain:**
   - Click **"Add Domain"**
   - Nhập: `portfolio.mason.id.vn`
   - Click **"Add"**

3. **Lấy DNS Records:**
   - Vercel sẽ hiển thị DNS records cần thêm
   - Sẽ có dạng:
     ```
     Type: CNAME
     Name: portfolio
     Value: cname.vercel-dns.com
     ```

### 3.2. Cấu hình DNS trên PA Vietnam

1. **Vào PA Vietnam DNS:**
   - Đăng nhập: `support.pavietnam.vn`
   - Vào **"Cấu hình bản ghi tên miền"** (như bạn đã từng làm)
   - Chọn domain: `mason.id.vn`

2. **Thêm CNAME Record:**
   - Click **"Thêm bản ghi"** hoặc thêm vào bảng DNS records
   - Điền thông tin:
     - **Host:** `portfolio`
     - **Loại:** `CNAME`
     - **Giá trị:** Giá trị Vercel cung cấp (ví dụ: `cname.vercel-dns.com`)
     - **TTL:** `3600` hoặc `360`
     - **Ưu tiên:** (để trống)
   - Click **"Lưu cấu hình"**

3. **Đợi DNS Propagate:**
   - Đợi 5-15 phút để DNS propagate
   - Vercel sẽ tự động verify domain

### 3.3. Kiểm tra

1. **Kiểm tra trong Vercel:**
   - Vào **"Domains"** settings
   - Domain sẽ hiển thị status: **"Valid Configuration"** ✅

2. **Truy cập website:**
   - Vào: `https://portfolio.mason.id.vn`
   - Website đã hoạt động với domain riêng! ✅
   - HTTPS tự động được kích hoạt

---

## ✨ Bước 4: Auto Deploy (Đã tự động!)

### Mỗi khi push code:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

**Vercel tự động:**
1. ✅ Detect code changes
2. ✅ Build project
3. ✅ Deploy lên production
4. ✅ Website tự động update trong 1-2 phút!

**Không cần:**
- ❌ Build thủ công
- ❌ Upload files
- ❌ Vào Vercel dashboard
- ❌ Setup GitHub Secrets

---

## 📊 Kiểm tra Deploy

### Cách 1: Vercel Dashboard

1. Vào: https://vercel.com/dashboard
2. Click vào project
3. Xem tab **"Deployments"**
4. Xem logs và status của mỗi deploy

### Cách 2: Email Notifications

- Vercel sẽ gửi email khi:
  - Deploy thành công
  - Deploy thất bại
  - Domain được verify

### Cách 3: Website

- Truy cập: `https://portfolio.mason.id.vn`
- Kiểm tra thay đổi đã hiển thị

---

## 🎉 Hoàn thành!

Bây giờ bạn có:

- ✅ Website live tại: `https://portfolio.mason.id.vn`
- ✅ HTTPS miễn phí
- ✅ Auto deploy từ GitHub
- ✅ Miễn phí 100%

---

## 🔄 Update Website

Chỉ cần:

```bash
# 1. Sửa code trong src/

# 2. Commit
git add .
git commit -m "Update portfolio"

# 3. Push
git push origin main

# 4. Đợi 1-2 phút → Website tự động update! ✅
```

---

## 📝 Files đã có sẵn

- ✅ `vercel.json` - Cấu hình Vercel
- ✅ `vite.config.js` - Đã cấu hình đúng
- ✅ GitHub repository - Đã push code
- ✅ Build script - Đã setup

---

## 🆘 Troubleshooting

### ❌ Domain không verify

**Kiểm tra:**
1. DNS record đã thêm đúng chưa?
2. Đợi đủ 15 phút để DNS propagate?
3. TTL đã set đúng chưa?

**Giải pháp:**
- Kiểm tra lại DNS records trong PA Vietnam
- So sánh với giá trị Vercel cung cấp
- Đợi thêm 15-30 phút
- Clear DNS cache

### ❌ Build failed trên Vercel

**Kiểm tra:**
1. Code có lỗi không?
2. Dependencies có đầy đủ không?

**Giải pháp:**
- Xem logs trong Vercel dashboard
- Test build local: `npm run build`
- Fix lỗi và push lại

---

## 💡 Tips

1. **Preview Deployments:**
   - Mỗi push tạo preview URL riêng
   - Test trước khi merge vào production

2. **Environment Variables:**
   - Nếu cần, thêm trong Vercel Settings → Environment Variables

3. **Analytics:**
   - Vercel có analytics miễn phí
   - Xem traffic và performance

---

## 🎯 Next Steps

1. ✅ Deploy lên Vercel (5 phút)
2. ✅ Thêm custom domain
3. ✅ Test auto deploy
4. ✅ Enjoy! 🎉

