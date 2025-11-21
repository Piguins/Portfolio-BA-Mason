# 🌐 Hướng dẫn cấu hình DNS cho Subdomain portfolio.mason.id.vn

## 📋 Thông tin cần có

Khi tạo DNS record cho subdomain `portfolio`, bạn cần:

### Bản ghi DNS Type A:

| Trường | Giá trị | Ghi chú |
|--------|---------|---------|
| **Host** | `portfolio` | Tên subdomain (không có dấu chấm ở cuối) |
| **Loại** | `A` | Bản ghi A trỏ tới IP |
| **Giá trị** | `[IP_HOSTING]` | ⚠️ Cần IP hosting của PA Vietnam |
| **TTL** | `3600` hoặc `360` | Thời gian cache DNS |
| **Ưu tiên** | _(để trống)_ | Chỉ dùng cho MX records |

---

## 🔍 Cách lấy IP Hosting

### Cách 1: Kiểm tra trong Control Panel PA Vietnam

1. **Đăng nhập** vào `support.pavietnam.vn`
2. Vào **"Thông tin Hosting"** hoặc **"Server Information"**
3. Tìm **"IP Address"** hoặc **"IP Server"**
4. Copy IP đó để điền vào DNS record

### Cách 2: Kiểm tra DNS hiện tại

1. Vào **"Cấu hình bản ghi tên miền"** (như bạn đang xem)
2. Tìm bản ghi có:
   - **Host:** `@` (hoặc để trống)
   - **Loại:** `A`
3. Copy **Giá trị** (IP) của bản ghi đó
4. Dùng IP đó cho subdomain `portfolio`

### Cách 3: Liên hệ Support

Nếu không tìm thấy IP:
- Gọi hotline: **1900 9477**
- Hoặc chat support trên `support.pavietnam.vn`
- Hỏi: "IP hosting của domain mason.id.vn là gì?"

### Cách 4: Kiểm tra bằng lệnh (nếu đã có website chạy)

```bash
# Nếu mason.id.vn đã hoạt động, có thể ping để xem IP
ping mason.id.vn

# Hoặc dùng nslookup
nslookup mason.id.vn
```

---

## 📝 Các bước hoàn thành DNS Record

### Bước 1: Điền thông tin

1. ✅ **Host:** `portfolio` (đã điền)
2. ✅ **Loại:** `A` (đã chọn)
3. ⚠️ **Giá trị:** Điền IP hosting (lấy theo cách trên)
4. ✅ **TTL:** `3600` (hoặc `360` như các bản ghi khác)
5. ✅ **Ưu tiên:** Để trống

### Bước 2: Lưu bản ghi

1. Click **"Lưu cấu hình"** (button sẽ sáng lên sau khi điền đủ)
2. Hoặc click icon **Checkmark/✓** trên dòng bản ghi
3. Đợi hệ thống lưu thành công

### Bước 3: Kiểm tra

1. Đợi **5-15 phút** để DNS propagate
2. Kiểm tra DNS record:
   ```bash
   nslookup portfolio.mason.id.vn
   ```
3. Nếu thấy IP hosting trả về → DNS đã hoạt động ✅

---

## 🔄 Cấu hình thay thế: Dùng CNAME

Nếu không biết IP hosting, có thể dùng **CNAME** thay vì A record:

| Trường | Giá trị |
|--------|---------|
| **Host** | `portfolio` |
| **Loại** | `CNAME` |
| **Giá trị** | `mason.id.vn` (hoặc domain chính) |
| **TTL** | `3600` |

**Lưu ý:** CNAME đơn giản hơn nhưng có thể chậm hơn A record một chút.

---

## ⏱️ Timeline

1. **Tạo DNS record:** Ngay lập tức
2. **DNS propagate:** 5-15 phút (có thể lâu hơn tùy vùng)
3. **Kiểm tra hoạt động:** Sau 15-30 phút

---

## ✅ Checklist

- [ ] Đã lấy được IP hosting
- [ ] Đã điền đầy đủ thông tin DNS record
- [ ] Đã click "Lưu cấu hình"
- [ ] Đã đợi 15 phút
- [ ] Đã kiểm tra DNS record hoạt động
- [ ] Website đã truy cập được qua `portfolio.mason.id.vn`

---

## 🆘 Troubleshooting

### DNS record không hoạt động sau 30 phút?

1. Kiểm tra lại IP hosting đã đúng chưa
2. Clear DNS cache:
   - Windows: `ipconfig /flushdns`
   - Mac/Linux: `sudo dscacheutil -flushcache`
3. Thử truy cập bằng IP trực tiếp để test
4. Liên hệ PA Vietnam support

### Không biết IP hosting?

- Gọi **1900 9477**
- Hoặc dùng CNAME record (đơn giản hơn)

