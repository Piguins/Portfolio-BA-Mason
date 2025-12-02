# Portfolio API

Backend API cho Portfolio website của Mason - sử dụng Node.js + Express + PostgreSQL (Supabase).

## 🚀 Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

**Quan trọng:** Cập nhật `DATABASE_URL` trong file `.env`:

1. Vào [Supabase Dashboard](https://supabase.com/dashboard/project/qeqjowagaybaejjyqjkg/settings/database)
2. Vào **Settings → Database**
3. Tìm phần **Connection string** → chọn **URI**
4. Copy connection string và thay `[YOUR_PASSWORD]` bằng password thực tế của bạn

**Format đúng:**
```
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.qeqjowagaybaejjyqjkg.supabase.co:5432/postgres
```

**Lưu ý:** 
- Password có thể chứa ký tự đặc biệt, nếu vậy cần URL encode
- Nếu không nhớ password, có thể reset trong Supabase Dashboard → Settings → Database → Reset database password

### 3. Test kết nối

```bash
node test-connection.js
```

Nếu thành công, bạn sẽ thấy:
```
✅ Database connection successful!
✅ Found X tables
✅ Skills: X records
✅ Published Projects: X records
✅ Experience: X records
🎉 All tests passed! API is ready to use.
```

### 4. Chạy API server

**Development mode (với auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

API sẽ chạy tại: `http://localhost:4000`

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Projects
```
GET /api/projects
```
Trả về danh sách projects đã publish, kèm tags.

### Skills
```
GET /api/skills
```
Trả về danh sách skills, sắp xếp theo `order_index`.

### Experience
```
GET /api/experience
```
Trả về danh sách experience, kèm bullets và skills used.

### Page Sections (CMS Content)
```
GET /api/page-sections?page=home&section=hero&locale=vi
```
Trả về nội dung CMS cho các section của trang.

## 🛠️ Troubleshooting

### Lỗi: `getaddrinfo ENOTFOUND db.qeqjowagaybaejjyqjkg.supabase.co`

**Nguyên nhân:**
- Password chưa được thay thế đúng trong `.env`
- Format connection string sai
- Network/DNS issue

**Giải pháp:**
1. Kiểm tra lại file `.env` - đảm bảo `DATABASE_URL` có format đúng
2. Đảm bảo đã thay `[YOUR_PASSWORD]` hoặc `YOUR_PASSWORD_HERE` bằng password thực tế
3. Test connection string từ Supabase Dashboard → SQL Editor → New query → thử query đơn giản
4. Nếu vẫn lỗi, reset database password và cập nhật lại `.env`

### Lỗi: `password authentication failed`

**Nguyên nhân:** Password không đúng

**Giải pháp:** Reset password trong Supabase Dashboard và cập nhật lại `.env`

### Lỗi: `relation "public.xxx" does not exist`

**Nguyên nhân:** Tables chưa được tạo

**Giải pháp:** Chạy lại migration SQL trong Supabase SQL Editor

## 📝 Notes

- File `.env` đã được gitignore, không commit lên git (an toàn)
- File `.env.example` là template, có thể commit
- API sử dụng connection pooling với `pg.Pool` để tối ưu performance
