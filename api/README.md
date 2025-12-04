# Mason Portfolio API

Backend API for Mason Portfolio website - Business Analyst Portfolio

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: pg (PostgreSQL client)
- **Documentation**: Swagger/OpenAPI 3.0

## Project Structure

```
api/src/
├── config/
│   └── index.js              # Application configuration
├── controllers/              # Request handlers (business logic)
│   ├── healthController.js
│   ├── projectsController.js
│   ├── skillsController.js
│   └── experienceController.js
├── services/                 # Data access layer (database operations)
│   ├── projectsService.js
│   ├── skillsService.js
│   └── experienceService.js
├── routes/                   # Route definitions with Swagger docs
│   ├── healthRoutes.js
│   ├── projectsRoutes.js
│   ├── skillsRoutes.js
│   ├── experienceRoutes.js
│   └── swaggerRoutes.js
├── middleware/               # Express middleware
│   └── errorHandler.js      # Global error handling
├── utils/                    # Utility functions
│   ├── swaggerHtml.js       # Swagger UI HTML template
│   └── urlHelper.js         # URL helper functions
├── db.js                     # Database connection
├── swagger.js                # Swagger/OpenAPI configuration
└── index.js                  # Main application entry point
```

## Architecture

### Clean Architecture Pattern

1. **Routes** (`routes/`)
   - Define API endpoints
   - Include Swagger documentation
   - Map URLs to controllers

2. **Controllers** (`controllers/`)
   - Handle HTTP requests/responses
   - Validate input
   - Call services
   - Return formatted responses

3. **Services** (`services/`)
   - Business logic
   - Database operations
   - Data transformation
   - Reusable across controllers

4. **Middleware** (`middleware/`)
   - Error handling
   - Authentication (future)
   - Validation (future)
   - Logging (future)

5. **Utils** (`utils/`)
   - Helper functions
   - Shared utilities
   - Templates

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase)
- Environment variables configured

### Installation

```bash
cd api
npm install
```

### Environment Variables

Create `.env` file:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development

# CORS Configuration (REQUIRED for production)
# Comma-separated list of allowed origins (no spaces)
# Example: https://your-cms.vercel.app,https://your-portfolio.vercel.app
CORS_ORIGINS=https://your-cms.vercel.app,https://your-portfolio.vercel.app

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ IMPORTANT: CORS Configuration**

The API uses strict CORS policy. You **must** set `CORS_ORIGINS` environment variable in production:

- **Format**: Comma-separated URLs (no spaces): `https://domain1.com,https://domain2.com`
- **Development**: Defaults to `http://localhost:3000,http://localhost:3001` if not set
- **Production**: If not set, **all origins will be blocked** (fail-secure)

**Vercel Deployment:**
Add `CORS_ORIGINS` to your Vercel project environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `CORS_ORIGINS` with your CMS and Portfolio URLs
3. Example: `https://your-cms.vercel.app,https://your-portfolio.vercel.app`

### Development

```bash
npm run dev
```

API will be available at `http://localhost:4000`

### Production

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check API and database status
- `GET /` - API information

### Projects
- `GET /api/projects` - Get all published projects
- `GET /api/projects/:slug` - Get project by slug

### Skills
- `GET /api/skills` - Get all skills
  - Query params: `category`, `highlight`

### Experience
- `GET /api/experience` - Get all work experience
  - Query params: `current`, `company`

### Documentation
- `GET /api-docs` - Swagger UI
- `GET /api-docs.json` - OpenAPI spec

## Adding New Features

### 1. Add a new endpoint

**Create service** (`services/newService.js`):
```javascript
import client from '../db.js'

export const newService = {
  async getAll() {
    const result = await client.query('SELECT * FROM table')
    return result.rows
  },
}
```

**Create controller** (`controllers/newController.js`):
```javascript
import { newService } from '../services/newService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const newController = {
  getAll: asyncHandler(async (req, res) => {
    const data = await newService.getAll()
    res.json(data)
  }),
}
```

**Create route** (`routes/newRoutes.js`):
```javascript
import express from 'express'
import { newController } from '../controllers/newController.js'

const router = express.Router()

/**
 * @swagger
 * /api/new:
 *   get:
 *     summary: Get all items
 *     tags: [New]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/api/new', newController.getAll)

export default router
```

**Register route** (`index.js`):
```javascript
import newRoutes from './routes/newRoutes.js'
app.use('/', newRoutes)
```

## Error Handling

All errors are handled by `errorHandler` middleware:

- Database errors → 500 with generic message
- Validation errors → 400 with error details
- Custom errors → Custom status code

Use `asyncHandler` wrapper for async controllers:

```javascript
import { asyncHandler } from '../middleware/errorHandler.js'

export const controller = {
  handler: asyncHandler(async (req, res) => {
    // Your code here
    // Errors will be automatically caught
  }),
}
```

## Database

Uses PostgreSQL via `pg` library. Connection is managed in `db.js`:

- Lazy connection (connects on first query)
- Automatic reconnection on errors
- SSL enabled for Supabase

## Deployment

### Vercel

1. Set Root Directory to `api`
2. Environment variables in Vercel Dashboard
3. Auto-deploy on git push

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (optional, default: 4000)
- `NODE_ENV` - Environment (development/production)
- `VERCEL` - Set to "1" on Vercel (auto-detected)

## Best Practices

1. **Separation of Concerns**: Routes → Controllers → Services
2. **Error Handling**: Always use `asyncHandler` for async functions
3. **Swagger Docs**: Add JSDoc comments to all routes
4. **Code Reusability**: Put shared logic in services
5. **Configuration**: Use `config/index.js` for all settings

## License

MIT
