# Mason Portfolio CMS (Next.js)

This folder contains the CMS (admin dashboard) for Mason's portfolio. It is built with **Next.js 14 + React 18**.

Currently it is just a minimal shell UI that we will expand into:

- Auth (login/logout, roles)
- Content management (projects, skills, experience, blog posts, etc.)
- Integration with the Node.js + PostgreSQL API in `../api`.

## Quick start

```bash
cd cms
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Tech stack

- **Next.js 14** (App Router)
- **React 18**
- Future: UI component library or custom design system shared with the portfolio app

## Next steps

1. Define data models that match the API (`projects`, `skills`, `experience`, `posts`, ...).
2. Add auth (e.g. NextAuth.js or custom JWT session with the API).
3. Implement CRUD pages:
   - List / create / edit / delete for each content type.
4. Wire up to `api/` (REST or GraphQL).


