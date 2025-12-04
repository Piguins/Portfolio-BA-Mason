# Mason Portfolio CMS

Admin dashboard for managing Mason Portfolio content (Next.js + React + Supabase).

## 🏗️ Project Structure

```
cms/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Protected dashboard pages
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Root page (redirects)
│   ├── components/             # React components
│   │   └── LogoutButton.tsx
│   ├── lib/                    # Utilities & helpers
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth utilities
│   │   └── supabase/           # Supabase clients
│   │       ├── client.ts       # Browser client
│   │       └── server.ts       # Server client
│   ├── middleware.ts           # Next.js middleware (auth protection)
│   └── types/                  # TypeScript types
├── .env.local                  # Environment variables (create from .env.local.example)
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Tạo file `.env.local` trong thư mục `cms/` (hoặc copy từ `.env.local.example`) với các biến sau:

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

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

The CMS uses Supabase Authentication:

- **Login**: `/login` - User login page
- **Dashboard**: `/dashboard` - Protected dashboard (requires authentication)
- **Auto-redirect**: Root `/` redirects to `/login` or `/dashboard` based on auth status

### Middleware Protection

The `middleware.ts` file automatically:
- Protects `/dashboard` routes (redirects to `/login` if not authenticated)
- Redirects authenticated users away from `/login`
- Handles root path redirects

## 📁 Key Files

- **`src/middleware.ts`**: Authentication middleware
- **`src/lib/auth.ts`**: Server-side auth utilities
- **`src/lib/supabase/client.ts`**: Browser Supabase client
- **`src/lib/supabase/server.ts`**: Server Supabase client
- **`src/lib/api.ts`**: API client for backend communication

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: Supabase Auth
- **Styling**: Inline styles (can be migrated to CSS modules/Tailwind)
- **API**: REST API (Node.js + Express)

## 📝 Next Steps

1. ✅ Authentication setup
2. ✅ Protected routes
3. ⏳ CRUD pages for Projects
4. ⏳ CRUD pages for Skills
5. ⏳ CRUD pages for Experience
6. ⏳ Connect with backend API
