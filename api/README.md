# Portfolio API (Node.js + Express + PostgreSQL)

This folder contains the backend API for Mason's portfolio. It is a minimal Express skeleton that can be expanded into full modules (auth, projects, skills, posts, etc.).

## Quick start

```bash
cd api
npm install
npm run dev
```

The server will start at `http://localhost:4000`.

## Environment variables

Create an `.env` file inside `api/`:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
```

If `DATABASE_URL` is not set, the health endpoint will still work, but DB checks are skipped.

## Available routes

- `GET /` – basic info
- `GET /health` – health-check (and optional DB ping)

## Next steps

- Add modules (e.g. `routes/projects.js`, `routes/skills.js`)
- Define DB schema (using Prisma or SQL migrations)
- Implement auth & role-based access for CMS


