# 🔒 Security Hardening Checklist

## ✅ Implementation Status

### Step 1: Secrets Management
- [x] Scanned codebase for hardcoded secrets - **No secrets found**
- [x] All secrets use `process.env` - **Already implemented**
- [x] `.env` in `.gitignore` - **Already configured**
- [x] Created `.env.example` template - **✅ Created**

### Step 2: Swagger UI Protection
- [x] Basic Authentication middleware - **✅ Implemented**
- [x] Protects `/api-docs` and `/api-docs.json` - **✅ Active**

### Step 3: General API Hardening
- [x] Helmet middleware - **✅ Implemented**
- [x] Rate limiting - **✅ Implemented**
- [x] Strict CORS - **✅ Implemented**
- [x] HPP protection - **✅ Implemented**

### Step 4: Error Handling
- [x] Hide stack traces in production - **✅ Implemented**
- [x] Generic error messages - **✅ Implemented**

---

## ⚠️ CRITICAL: Manual Actions Required

### 1. Rotate Supabase Keys (If Exposed)

**Check if keys were exposed:**
```bash
# Check Git history for .env file
git log --all --full-history -- .env

# Check for secrets in commit history
git log -p --all -S "SUPABASE_SERVICE_ROLE_KEY"
git log -p --all -S "DATABASE_URL"
```

**If keys were exposed, rotate immediately:**

1. **Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/_/settings/api
   - Click "Reset" next to **anon public** key
   - Click "Reset" next to **service_role secret** key
   - ⚠️ **Service Role Key has admin access - rotate immediately!**

2. **Update Environment Variables:**
   - Update `.env` file locally
   - Update Vercel Dashboard > Settings > Environment Variables

---

## 📋 Setup Checklist

### Install Dependencies
```bash
cd api
npm install helmet express-rate-limit hpp express-basic-auth
```

### Environment Variables

**Create `.env` file:**
```bash
cp .env.example .env
```

**Required variables (fill in):**
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `SWAGGER_USERNAME` - Username for Swagger UI (default: `admin`)
- [ ] `SWAGGER_PASSWORD` - **Strong password for Swagger UI**
- [ ] `CORS_ORIGINS` - Comma-separated allowed origins (no spaces)
  - Example: `https://admin.mason.id.vn,https://cms.mason.id.vn`

**Optional variables (have defaults):**
- `RATE_LIMIT_WINDOW_MS` - Default: 900000 (15 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Default: 100

### Vercel Environment Variables

Add all variables to Vercel Dashboard:
- [ ] `DATABASE_URL`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SWAGGER_USERNAME`
- [ ] `SWAGGER_PASSWORD`
- [ ] `CORS_ORIGINS`
- [ ] `NODE_ENV=production`

---

## 🧪 Testing Checklist

### Test Rate Limiting
```bash
# Should fail after 100 requests
for i in {1..101}; do curl http://localhost:4000/api/health; done
```
- [ ] Rate limiting works (returns 429 after limit)

### Test Swagger Protection
```bash
# Should require authentication
curl http://localhost:4000/api-docs
```
- [ ] Swagger UI requires Basic Auth
- [ ] Works with correct credentials: `curl -u admin:password http://localhost:4000/api-docs`

### Test CORS
```bash
# From allowed origin - should work
curl -H "Origin: https://admin.mason.id.vn" http://localhost:4000/api/health

# From disallowed origin - should fail
curl -H "Origin: https://evil.com" http://localhost:4000/api/health
```
- [ ] CORS allows only specified origins
- [ ] CORS blocks unauthorized origins

### Test Error Handling
```bash
# Set NODE_ENV=production
# Should NOT return stack traces
curl http://localhost:4000/api/nonexistent
```
- [ ] No stack traces in production mode
- [ ] Generic error messages only

---

## 📊 Security Features Summary

| Feature | Status | Protection |
|---------|--------|------------|
| **Helmet** | ✅ Active | Secure HTTP headers, HSTS, CSP |
| **Rate Limiting** | ✅ Active | 100 req/15min (general), 5 req/15min (auth) |
| **CORS** | ✅ Active | Strict origin checking |
| **HPP Protection** | ✅ Active | Parameter pollution prevention |
| **Swagger Auth** | ✅ Active | Basic Authentication |
| **Error Sanitization** | ✅ Active | No stack traces in production |
| **Secrets Management** | ✅ Active | All in environment variables |

---

## 🚀 Deployment Steps

1. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

2. **Set environment variables:**
   - Create `.env` from `.env.example`
   - Fill in all required values
   - Add to Vercel Dashboard

3. **Test locally:**
   ```bash
   npm run dev
   ```
   - Test all endpoints
   - Verify security features

4. **Deploy:**
   - Push to Git
   - Vercel will auto-deploy
   - Verify production endpoints

5. **Verify security:**
   - Test Swagger protection
   - Test CORS restrictions
   - Test rate limiting
   - Verify no stack traces

---

## 📝 Notes

- **Swagger Password:** Use a strong, unique password
- **CORS Origins:** Must include all domains that need API access
- **Rate Limits:** Adjust if needed for your use case
- **Key Rotation:** Rotate Supabase keys every 90 days

---

**Status:** ✅ All security features implemented
**Next:** Complete manual actions checklist above

