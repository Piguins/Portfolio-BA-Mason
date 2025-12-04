# Tạo Admin User cho CMS

## Cách 1: Qua Supabase Dashboard (Khuyến nghị)

1. Vào **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Authentication** → **Users**
4. Click **Add User** (hoặc **Invite User**)
5. Điền thông tin:
   - **Email**: `admin@mason.id.vn` (hoặc email bạn muốn)
   - **Password**: Nhập password mạnh
   - **Auto Confirm User**: **Bật ON** (để không cần verify email)
6. Click **Create User**

## Cách 2: Qua Supabase SQL Editor

Chạy SQL sau trong **Supabase Dashboard** → **SQL Editor**:

```sql
-- Tạo user admin
-- Lưu ý: Cần có quyền admin để chạy

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@mason.id.vn',
  crypt('YOUR_PASSWORD_HERE', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false
);
```

**Lưu ý**: Thay `YOUR_PASSWORD_HERE` bằng password bạn muốn (phải hash bằng bcrypt).

## Cách 3: Dùng Supabase Auth API (Programmatic)

Có thể tạo user qua API, nhưng cần Service Role Key (không nên expose public).

## Sau khi tạo user

1. Truy cập: https://admin.mason.id.vn
2. Đăng nhập với email và password vừa tạo
3. Sẽ được redirect đến `/dashboard`

