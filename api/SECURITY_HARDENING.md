# Security Hardening Guide - Mason Portfolio API

## 🔒 Security Audit & Hardening Report

This document outlines all security improvements implemented and actions required.

---

## Step 1: Secrets Management ✅

### Current Status
- ✅ Code already uses `process.env` for all secrets
- ✅ `.env` is in `.gitignore`
- ✅ No hardcoded secrets found in codebase

### Actions Required

#### ⚠️ CRITICAL: Rotate All Supabase Keys

**If you suspect keys were exposed in Git history:**

1. **Rotate Supabase Anon Key:**
   - Go to Supabase Dashboard > Settings > API
   - Click "Reset" next to "anon public" key
   - Update `SUPABASE_ANON_KEY` in your `.env` and Vercel environment variables

2. **Rotate Supabase Service Role Key:**
   - Go to Supabase Dashboard > Settings > API
   - Click "Reset" next to "service_role secret" key
   - Update `SUPABASE_SERVICE_ROLE_KEY` in your `.env` and Vercel environment variables
   - ⚠️ **This key has admin access - rotate immediately if exposed!**

3. **Check Git History:**
   ```bash
   # Check if .env was ever committed
   git log --all --full-history -- .env
   
   # Check for secrets in commit history
   git log -p --all -S "SUPABASE_SERVICE_ROLE_KEY"
   git log -p --all -S "DATABASE_URL"
   ```

4. **If secrets were committed:**
   - Rotate ALL keys immediately
   - Consider using `git-filter-repo` to remove secrets from history (advanced)

---

## Step 2: Install Security Dependencies

```bash
cd api
npm install helmet express-rate-limit hpp express-basic-auth
```

**Libraries installed:**
- `helmet` - Secure HTTP headers
- `express-rate-limit` - Rate limiting (DDoS protection)
- `hpp` - HTTP Parameter Pollution protection
- `express-basic-auth` - Basic Auth for Swagger UI

---

## Step 3: Security Middleware Implementation

### 3.1 Helmet Configuration

**File:** `api/src/middleware/helmet.js` (new)

Helmet sets secure HTTP headers automatically:
- Hides `X-Powered-By: Express`
- Sets HSTS (HTTP Strict Transport Security)
- Prevents clickjacking
- XSS protection
- Content Security Policy

### 3.2 Rate Limiting

**File:** `api/src/middleware/rateLimiter.js` (new)

Protects against:
- Brute-force attacks
- DDoS attacks
- API abuse

**Configuration:**
- Window: 15 minutes (900,000ms)
- Max requests: 100 per window
- Stricter limits for auth endpoints

### 3.3 CORS Configuration

**File:** `api/src/middleware/cors.js` (new)

**Before:** `cors()` - allows all origins (`*`)

**After:** Strict CORS with allowed origins from environment:
- Only allows requests from `CORS_ORIGINS` env variable
- Credentials: true (for cookies)
- Preflight caching

### 3.4 HPP Protection

**File:** `api/src/middleware/hpp.js` (new)

Prevents HTTP Parameter Pollution attacks:
- Removes duplicate query parameters
- Prevents parameter override attacks

### 3.5 Swagger UI Protection

**File:** `api/src/middleware/swaggerAuth.js` (new)

Basic Authentication for Swagger documentation:
- Username/password from environment variables
- Protects `/api-docs` and `/api-docs.json`

---

## Step 4: Updated Error Handler

**File:** `api/src/middleware/errorHandler.js` (updated)

**Improvements:**
- Never exposes stack traces in production
- Generic error messages for security
- Detailed errors only in development
- Sanitizes error messages

---

## Step 5: Updated Main App File

**File:** `api/src/index.js` (updated)

**Security middleware order:**
1. Helmet (security headers)
2. CORS (strict origin checking)
3. HPP (parameter pollution protection)
4. Rate limiting
5. Body parsing
6. Routes (with Swagger auth)

---

## Step 6: Environment Variables Checklist

### Required Variables (add to `.env`):

```env
# Server
PORT=4000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...

# Supabase
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Security
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=your-strong-password-here
CORS_ORIGINS=https://admin.mason.id.vn

# Rate Limiting (optional, has defaults)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Vercel Environment Variables

Add all these to Vercel Dashboard > Settings > Environment Variables:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SWAGGER_USERNAME`
- `SWAGGER_PASSWORD`
- `CORS_ORIGINS`
- `NODE_ENV=production`

---

## Step 7: Testing Security

### Test Rate Limiting:
```bash
# Should fail after 100 requests in 15 minutes
for i in {1..101}; do curl http://localhost:4000/api/health; done
```

### Test Swagger Protection:
```bash
# Should require authentication
curl http://localhost:4000/api-docs
# Should work with auth
curl -u admin:password http://localhost:4000/api-docs
```

### Test CORS:
```bash
# From allowed origin - should work
curl -H "Origin: https://admin.mason.id.vn" http://localhost:4000/api/health

# From disallowed origin - should fail
curl -H "Origin: https://evil.com" http://localhost:4000/api/health
```

---

## Security Checklist

### ✅ Completed
- [x] Scan for hardcoded secrets
- [x] Create `.env.example`
- [x] Verify `.env` in `.gitignore`
- [x] Install security dependencies
- [x] Implement Helmet
- [x] Implement rate limiting
- [x] Configure strict CORS
- [x] Add HPP protection
- [x] Protect Swagger UI
- [x] Improve error handling

### ⚠️ Manual Actions Required

1. **Rotate Supabase Keys** (if exposed)
   - [ ] Rotate `SUPABASE_ANON_KEY`
   - [ ] Rotate `SUPABASE_SERVICE_ROLE_KEY`
   - [ ] Update `.env` file
   - [ ] Update Vercel environment variables

2. **Set Environment Variables**
   - [ ] Copy `.env.example` to `.env`
   - [ ] Fill in all required values
   - [ ] Set `SWAGGER_USERNAME` and `SWAGGER_PASSWORD`
   - [ ] Set `CORS_ORIGINS` (comma-separated, no spaces)
   - [ ] Update Vercel environment variables

3. **Test Security Features**
   - [ ] Test rate limiting
   - [ ] Test Swagger authentication
   - [ ] Test CORS restrictions
   - [ ] Verify no stack traces in production

4. **Deploy**
   - [ ] Test locally first
   - [ ] Deploy to staging
   - [ ] Verify all security features work
   - [ ] Deploy to production

---

## Security Best Practices Going Forward

1. **Never commit secrets:**
   - Always use environment variables
   - Use `.env.example` for documentation
   - Double-check `.gitignore`

2. **Regular key rotation:**
   - Rotate Supabase keys every 90 days
   - Rotate database passwords every 90 days
   - Use strong, unique passwords

3. **Monitor for breaches:**
   - Check Supabase logs for suspicious activity
   - Monitor API rate limit violations
   - Set up alerts for failed auth attempts

4. **Keep dependencies updated:**
   ```bash
   npm audit
   npm audit fix
   ```

5. **Regular security audits:**
   - Review access logs monthly
   - Check for exposed secrets quarterly
   - Update security dependencies regularly

---

## Additional Recommendations

### Future Enhancements:

1. **JWT Token Validation:**
   - Add JWT signature verification
   - Implement token refresh mechanism
   - Add token blacklisting

2. **Request Validation:**
   - Use `express-validator` for input validation
   - Sanitize all user inputs
   - Validate request schemas

3. **Logging & Monitoring:**
   - Implement structured logging
   - Add security event logging
   - Set up alerts for suspicious activity

4. **API Versioning:**
   - Implement API versioning (`/api/v1/...`)
   - Deprecate old versions gracefully

5. **WAF (Web Application Firewall):**
   - Consider Cloudflare or AWS WAF
   - Block known attack patterns
   - Rate limit at edge

---

## Support

If you discover any security vulnerabilities, please:
1. **DO NOT** create a public issue
2. Email security concerns privately
3. Follow responsible disclosure practices

---

**Last Updated:** $(date)
**Security Level:** 🔒 Hardened

