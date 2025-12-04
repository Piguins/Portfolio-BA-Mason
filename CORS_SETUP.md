# CORS Configuration Guide

## ❌ Error: "Origin not allowed"

If you're seeing this error, it means your frontend origin is not in the allowed CORS list.

## ✅ Solution

### For Vercel Deployment

1. **Go to Vercel Dashboard**
   - Navigate to your API project
   - Go to **Settings** → **Environment Variables**

2. **Add CORS_ORIGINS variable**
   - **Key**: `CORS_ORIGINS`
   - **Value**: Your CMS and Portfolio URLs (comma-separated, no spaces)
   - **Example**: 
     ```
     https://your-cms.vercel.app,https://your-portfolio.vercel.app
     ```

3. **Redeploy**
   - After adding the variable, redeploy your API
   - The new CORS settings will take effect

### For Local Development

Create or update `.env` file in `api/` directory:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Note**: If `CORS_ORIGINS` is not set in development, it defaults to:
- `http://localhost:3000`
- `http://localhost:3001`

### Format Rules

- ✅ **Correct**: `https://domain1.com,https://domain2.com`
- ❌ **Wrong**: `https://domain1.com, https://domain2.com` (spaces)
- ❌ **Wrong**: `https://domain1.com https://domain2.com` (missing comma)

### Multiple Origins

You can add multiple origins separated by commas:

```
https://cms.vercel.app,https://portfolio.vercel.app,https://staging.vercel.app
```

### Wildcard Support (Vercel Preview URLs)

For Vercel preview deployments with random URLs, you can use wildcards:

```
https://cms.vercel.app,https://*.vercel.app
```

This will allow:
- ✅ `https://cms.vercel.app` (exact match)
- ✅ `https://cms-git-main-yourname.vercel.app` (preview URL)
- ✅ `https://cms-abc123.vercel.app` (any Vercel preview)

**Note**: Wildcards only work for subdomains, not paths.

## 🔍 Debugging

### Check Current Allowed Origins

In development mode, check the console logs when a CORS error occurs. You'll see:
```
⚠️  CORS blocked origin: https://your-domain.com
   Allowed origins: https://allowed1.com, https://allowed2.com
```

### Common Issues

1. **Trailing slash**: 
   - ✅ `https://domain.com`
   - ❌ `https://domain.com/`

2. **Protocol mismatch**:
   - ✅ `https://domain.com` (if using HTTPS)
   - ❌ `http://domain.com` (if using HTTP)

3. **Subdomain mismatch**:
   - ✅ `https://www.domain.com` (if your site uses www)
   - ❌ `https://domain.com` (if your site doesn't use www)

## 📚 More Information

See `api/README.md` for complete environment variable documentation.

