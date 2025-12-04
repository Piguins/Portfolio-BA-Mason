# Security Hardening - Implementation Guide

## 🚀 Quick Start

### Step 1: Install Security Dependencies

```bash
cd api
npm install helmet express-rate-limit hpp express-basic-auth
```

### Step 2: Create `.env` File

```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your actual values
# NEVER commit .env to Git!
```

### Step 3: Set Required Environment Variables

**Minimum required variables:**

```env
# Database
DATABASE_URL=postgresql://user:password@host:6543/database?sslmode=require

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security (REQUIRED for Swagger protection)
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=your-strong-password-here

# CORS (REQUIRED - no wildcards!)
CORS_ORIGINS=https://admin.mason.id.vn
```

### Step 4: Test Locally

```bash
npm run dev
```

**Test endpoints:**
- Health: `http://localhost:4000/api/health` (should work)
- Swagger: `http://localhost:4000/api-docs` (should require Basic Auth)
- API: `http://localhost:4000/api/experience` (should work from allowed origin)

---

## 📋 Manual Actions Checklist

### ⚠️ CRITICAL: Rotate Supabase Keys (If Exposed)

**If you suspect keys were in Git history:**

1. **Check Git History:**
   ```bash
   # Check if .env was ever committed
   git log --all --full-history -- .env
   
   # Check for secrets in commits
   git log -p --all -S "SUPABASE_SERVICE_ROLE_KEY"
   git log -p --all -S "DATABASE_URL"
   ```

2. **Rotate Keys in Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/_/settings/api
   - Click "Reset" next to **anon public** key → Update `SUPABASE_ANON_KEY`
   - Click "Reset" next to **service_role secret** key → Update `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **Service Role Key has admin access - rotate immediately if exposed!**

3. **Update Environment Variables:**
   - Update `.env` file locally
   - Update Vercel Dashboard > Settings > Environment Variables

### ✅ Environment Variables Setup

**Local Development (.env):**
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `DATABASE_URL`
- [ ] Fill in `SUPABASE_URL`
- [ ] Fill in `SUPABASE_ANON_KEY`
- [ ] Fill in `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set `SWAGGER_USERNAME` (default: `admin`)
- [ ] Set `SWAGGER_PASSWORD` (use strong password!)
- [ ] Set `CORS_ORIGINS` (comma-separated, no spaces)
  - Example: `https://admin.mason.id.vn,https://cms.mason.id.vn`

**Vercel Production:**
- [ ] Add all environment variables to Vercel Dashboard
- [ ] Set `NODE_ENV=production`
- [ ] Verify `CORS_ORIGINS` includes your production domains
- [ ] Set strong `SWAGGER_PASSWORD` for production

### ✅ Security Testing

**Test Rate Limiting:**
```bash
# Should fail after 100 requests
for i in {1..101}; do 
  curl http://localhost:4000/api/health
  echo "Request $i"
done
```

**Test Swagger Protection:**
```bash
# Should require authentication
curl http://localhost:4000/api-docs

# Should work with Basic Auth
curl -u admin:your-password http://localhost:4000/api-docs
```

**Test CORS:**
```bash
# From allowed origin - should work
curl -H "Origin: https://admin.mason.id.vn" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:4000/api/health

# From disallowed origin - should fail
curl -H "Origin: https://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:4000/api/health
```

**Test Error Handling:**
```bash
# Set NODE_ENV=production
# Should NOT return stack traces
curl http://localhost:4000/api/nonexistent
```

---

## 🔧 Configuration Details

### Rate Limiting

**Default Settings:**
- **General API:** 100 requests per 15 minutes per IP
- **Auth endpoints:** 5 requests per 15 minutes per IP
- **Health check:** No rate limiting

**Customize in `.env`:**
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window
```

### CORS Configuration

**Format:** Comma-separated origins, no spaces
```env
CORS_ORIGINS=https://admin.mason.id.vn,https://cms.mason.id.vn
```

**Development:** Localhost is automatically allowed if `CORS_ORIGINS` not set

**Production:** Must set `CORS_ORIGINS` or CORS will deny all requests

### Swagger Authentication

**Default Credentials:**
- Username: `admin` (or `SWAGGER_USERNAME` env var)
- Password: Must set `SWAGGER_PASSWORD` env var

**Change Username:**
```env
SWAGGER_USERNAME=myusername
```

---

## 🚨 Troubleshooting

### Issue: "Not allowed by CORS"

**Solution:**
1. Check `CORS_ORIGINS` includes your domain
2. Format: `https://domain.com` (no trailing slash, no spaces)
3. Multiple domains: `https://domain1.com,https://domain2.com`

### Issue: Swagger UI shows login prompt repeatedly

**Solution:**
1. Check `SWAGGER_PASSWORD` is set in `.env`
2. Use correct username/password
3. Browser may cache credentials - try incognito mode

### Issue: Rate limiting too strict

**Solution:**
1. Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
2. Increase `RATE_LIMIT_WINDOW_MS` for longer windows
3. Health endpoint (`/api/health`) is exempt from rate limiting

### Issue: Stack traces still showing in production

**Solution:**
1. Verify `NODE_ENV=production` is set
2. Restart server after setting environment variable
3. Check error handler is being used (must be last middleware)

---

## 📊 Security Features Summary

| Feature | Status | Protection Level |
|---------|--------|------------------|
| Helmet | ✅ Active | High - Secure HTTP headers |
| Rate Limiting | ✅ Active | High - DDoS protection |
| CORS | ✅ Active | High - Origin restriction |
| HPP Protection | ✅ Active | Medium - Parameter pollution |
| Swagger Auth | ✅ Active | High - Basic Auth |
| Error Sanitization | ✅ Active | High - No stack traces in prod |
| Secrets Management | ✅ Active | High - All in env vars |

---

## 🔐 Security Best Practices

1. **Never commit `.env`** - It's in `.gitignore`, but double-check
2. **Use strong passwords** - Especially for `SWAGGER_PASSWORD`
3. **Rotate keys regularly** - Every 90 days for Supabase keys
4. **Monitor logs** - Watch for rate limit violations and failed auth
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Review access logs** - Check for suspicious activity monthly

---

## 📝 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create `.env` from `.env.example`
3. ✅ Set all required environment variables
4. ✅ Test locally
5. ✅ Rotate Supabase keys (if needed)
6. ✅ Deploy to production
7. ✅ Update Vercel environment variables
8. ✅ Test production endpoints

---

**Questions?** Check `SECURITY_HARDENING.md` for detailed documentation.

