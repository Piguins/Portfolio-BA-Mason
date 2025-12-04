# CMS Setup Guide

## Environment Variables

Create a `.env.local` file in the `cms/` directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
# For production: NEXT_PUBLIC_API_URL=https://api.mason.id.vn

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production: NEXT_PUBLIC_APP_URL=https://admin.mason.id.vn
```

## Supabase Setup

1. Go to your Supabase project dashboard
2. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Enable **Email Authentication** in Authentication → Providers

## Create Admin User

You can create an admin user through:
1. Supabase Dashboard → Authentication → Users → Add User
2. Or use the Supabase SQL Editor to insert a user

## API Setup

Make sure your API is running and has the auth routes configured:
- `/api/auth/login` - POST
- `/api/auth/logout` - POST  
- `/api/auth/session` - GET

## Running the CMS

```bash
cd cms
npm install
npm run dev
```

Visit http://localhost:3000 - you'll be redirected to `/login` if not authenticated.

