# Swagger API Documentation Access

## 🔐 Authentication

Swagger UI (`/api-docs`) is protected with **Basic Authentication**.

### Default Credentials

- **Username**: `admin` (or set via `SWAGGER_USERNAME` env variable)
- **Password**: Set via `SWAGGER_PASSWORD` env variable

### Setup

Add these environment variables in Vercel:

1. Go to **Vercel Dashboard** → Your API Project → **Settings** → **Environment Variables**
2. Add:
   - **Key**: `SWAGGER_USERNAME`
     - **Value**: Your desired username (default: `admin`)
   - **Key**: `SWAGGER_PASSWORD`
     - **Value**: Your secure password (required)

### Access

1. Navigate to: `https://api.mason.id.vn/api-docs`
2. Browser will prompt for username and password
3. Enter your credentials
4. Access Swagger UI documentation

### Security Note

⚠️ **Important**: If `SWAGGER_PASSWORD` is not set, Swagger UI will use default password `changeme` and show a warning in logs. Always set a strong password in production!

### Example

```env
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=your_secure_password_here
```

---

## 📚 Swagger Endpoints

- **Swagger UI**: `https://api.mason.id.vn/api-docs`
- **OpenAPI JSON**: `https://api.mason.id.vn/api-docs.json`

Both endpoints require Basic Authentication.

