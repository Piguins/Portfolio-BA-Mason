# API Documentation Guide

## Truy cập Swagger UI

Với domain `admin.mason.id.vn`, bạn có thể truy cập Swagger UI tại:

**URL:** `https://admin.mason.id.vn/api-docs`

## Các cách kiểm tra API

### 1. Swagger UI (Khuyến nghị)
- Truy cập: `https://admin.mason.id.vn/api-docs`
- Xem tất cả endpoints, schemas, và test trực tiếp trong browser
- Có thể authenticate với JWT token từ Supabase

### 2. OpenAPI JSON Spec
- URL: `https://admin.mason.id.vn/api/api-docs`
- Trả về OpenAPI 3.0 specification dạng JSON
- Có thể import vào Postman, Insomnia, hoặc tools khác

### 3. Test trực tiếp với cURL

```bash
# GET - Lấy tất cả experiences
curl https://admin.mason.id.vn/api/experience

# GET - Lấy hero section
curl https://admin.mason.id.vn/api/hero

# GET - Lấy tất cả projects
curl https://admin.mason.id.vn/api/projects

# GET - Lấy tất cả specializations
curl https://admin.mason.id.vn/api/specializations

# GET - Lấy tất cả skills
curl https://admin.mason.id.vn/api/skills
```

### 4. Test với Authentication (POST/PUT/DELETE)

```bash
# Lấy JWT token từ Supabase Auth
TOKEN="your-jwt-token-here"

# PUT - Update hero section
curl -X PUT https://admin.mason.id.vn/api/hero \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "greeting": "Hey!",
    "greeting_part2": "I'\''m",
    "name": "Thế Kiệt (Mason)",
    "title": "Business Analyst",
    "description": "Your description here"
  }'
```

## Các Endpoints có sẵn

### Hero Section (Singleton)
- `GET /api/hero` - Lấy hero content
- `PUT /api/hero` - Update hero content (cần auth)

### Experience
- `GET /api/experience` - Lấy tất cả experiences
- `GET /api/experience/[id]` - Lấy experience theo ID
- `POST /api/experience` - Tạo experience mới (cần auth)
- `PUT /api/experience/[id]` - Update experience (cần auth)
- `DELETE /api/experience/[id]` - Xóa experience (cần auth)

### Projects
- `GET /api/projects` - Lấy tất cả projects
- `GET /api/projects/[id]` - Lấy project theo ID
- `POST /api/projects` - Tạo project mới (cần auth)
- `PUT /api/projects/[id]` - Update project (cần auth)
- `DELETE /api/projects/[id]` - Xóa project (cần auth)

### Specializations
- `GET /api/specializations` - Lấy tất cả specializations
- `GET /api/specializations/[id]` - Lấy specialization theo ID
- `POST /api/specializations` - Tạo specialization mới (cần auth)
- `PUT /api/specializations/[id]` - Update specialization (cần auth)
- `DELETE /api/specializations/[id]` - Xóa specialization (cần auth)

### Skills
- `GET /api/skills` - Lấy tất cả skills
- `GET /api/skills/[id]` - Lấy skill theo ID
- `POST /api/skills` - Tạo skill mới (cần auth)
- `PUT /api/skills/[id]` - Update skill (cần auth)
- `DELETE /api/skills/[id]` - Xóa skill (cần auth)

## Authentication

Các endpoints POST, PUT, DELETE yêu cầu JWT token từ Supabase Auth.

Header format:
```
Authorization: Bearer <jwt-token>
```

Để lấy token:
1. Login vào CMS tại `https://admin.mason.id.vn/login`
2. Token được lưu trong browser cookies (Supabase session)
3. Hoặc lấy từ Supabase client: `supabase.auth.getSession()`

## CORS

API đã được cấu hình CORS để cho phép:
- `https://mason.id.vn`
- `https://www.mason.id.vn`
- `http://localhost:5173` (dev)
- `http://localhost:3000` (dev)

Frontend portfolio có thể gọi API từ CMS mà không gặp CORS issues.

