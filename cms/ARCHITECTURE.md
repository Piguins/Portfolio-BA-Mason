# CMS Architecture Documentation

## 📁 Project Structure

```
cms/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes (REST endpoints)
│   │   │   ├── experience/
│   │   │   ├── hero/
│   │   │   ├── projects/
│   │   │   ├── skills/
│   │   │   ├── specializations/
│   │   │   └── portfolio/
│   │   ├── dashboard/                # UI Pages (Protected)
│   │   │   ├── experience/
│   │   │   ├── hero/
│   │   │   ├── projects/
│   │   │   ├── skills/
│   │   │   └── specializations/
│   │   ├── login/                   # Public pages
│   │   └── api-docs/                # API documentation
│   │
│   ├── lib/                         # Shared utilities
│   │   ├── api/                     # API-specific utilities
│   │   │   ├── handlers/            # Request/Response/Error handlers
│   │   │   │   ├── request-handler.ts
│   │   │   │   └── error-handler.ts
│   │   │   ├── validators/          # Validation utilities
│   │   │   │   ├── uuid-validator.ts
│   │   │   │   └── request-validator.ts
│   │   │   └── database/            # Database query helpers
│   │   │       └── query-helpers.ts
│   │   ├── auth.ts                  # Authentication utilities
│   │   ├── prisma.ts                # Prisma client singleton
│   │   └── supabase/                # Supabase clients
│   │
│   ├── components/                  # React UI components
│   ├── hooks/                       # React hooks
│   ├── middleware/                  # Next.js middleware
│   └── types/                       # TypeScript type definitions
│
└── prisma/                          # Prisma schema
```

## 🏗️ Architecture Pattern

This project follows a **Layered Architecture** pattern with clear separation of concerns:

### 1. **API Layer** (`app/api/`)
- **Purpose**: REST API endpoints
- **Responsibilities**:
  - Handle HTTP requests/responses
  - Validate input data
  - Call business logic (database operations)
  - Return standardized responses

### 2. **UI Layer** (`app/dashboard/`, `app/login/`)
- **Purpose**: User interface pages
- **Responsibilities**:
  - Render React components
  - Handle user interactions
  - Call API endpoints
  - Manage client-side state

### 3. **Business Logic Layer** (`lib/api/`)
- **Purpose**: Reusable utilities and helpers
- **Responsibilities**:
  - Request/Response handling
  - Error handling and logging
  - Data validation
  - Database query abstractions

### 4. **Data Access Layer** (`lib/prisma.ts`, `lib/api/database/`)
- **Purpose**: Database operations
- **Responsibilities**:
  - Prisma client management
  - Query execution
  - Transaction handling

## 🔧 Key Components

### API Handlers

#### Request Handler (`lib/api/handlers/request-handler.ts`)
- **`parseRequestBody<T>()`**: Safely parse JSON from request body
  - Validates Content-Type
  - Handles empty bodies
  - Catches JSON parsing errors
  - Returns typed data or error response

- **`createSuccessResponse<T>()`**: Create standardized success response
  - Adds CORS headers
  - Sets appropriate status code
  - Returns JSON response

#### Error Handler (`lib/api/handlers/error-handler.ts`)
- **`createErrorResponse()`**: Create standardized error response
  - Logs errors for debugging
  - Sanitizes error messages in production
  - Includes error details in development
  - Adds CORS headers

- **`handleDatabaseError()`**: Handle database-specific errors
  - Maps database errors to HTTP status codes
  - Handles unique constraints (409)
  - Handles foreign key constraints (400)
  - Handles connection errors (503)
  - Handles not found errors (404)

### Validators

#### UUID Validator (`lib/api/validators/uuid-validator.ts`)
- **`isValidUUID()`**: Check if string is valid UUID format
- **`validateUUID()`**: Validate and return UUID, throws if invalid

#### Request Validator (`lib/api/validators/request-validator.ts`)
- **`validateRequiredFields()`**: Validate required fields in request body
- **`validateIntegerId()`**: Validate integer ID format

### Database Helpers (`lib/api/database/query-helpers.ts`)
- **`queryFirst<T>()`**: Execute query and return first result
- **`queryAll<T>()`**: Execute query and return all results
- **`executeQuery()`**: Execute query (INSERT/UPDATE/DELETE)
- **`executeTransaction<T>()`**: Execute queries in transaction

## 📝 API Route Pattern

All API routes follow this pattern:

```typescript
import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { validateUUID } from '@/lib/api/validators/uuid-validator'
import { queryFirst, queryAll, executeQuery } from '@/lib/api/database/query-helpers'

export async function GET(request: NextRequest) {
  try {
    // 1. Validate input (if needed)
    // 2. Query database
    // 3. Return success response
    const data = await queryAll(...)
    return createSuccessResponse(data, request)
  } catch (error) {
    return handleDatabaseError(error, 'operation name', request)
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const parseResult = await parseRequestBody(request)
    if (parseResult.error) return parseResult.error

    // 2. Validate required fields
    const validation = validateRequiredFields(parseResult.data, ['field1', 'field2'])
    if (!validation.isValid) {
      return createErrorResponse(
        new Error(`Missing required fields: ${validation.missingFields.join(', ')}`),
        `Missing required fields: ${validation.missingFields.join(', ')}`,
        request,
        400
      )
    }

    // 3. Execute database operation
    // 4. Return success response
    return createSuccessResponse(result, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create resource', request)
  }
}
```

## 🛡️ Error Handling Strategy

### Error Flow
1. **Catch errors** in try-catch blocks
2. **Log errors** with context (operation name, request details)
3. **Map errors** to appropriate HTTP status codes
4. **Sanitize messages** in production (hide sensitive info)
5. **Return standardized** error responses

### Error Types
- **400 Bad Request**: Invalid input, missing required fields
- **404 Not Found**: Resource not found
- **409 Conflict**: Unique constraint violation
- **500 Internal Server Error**: Unexpected errors
- **503 Service Unavailable**: Database connection errors

## 🔒 Security Features

1. **Input Validation**: All request bodies are validated
2. **Type Safety**: TypeScript ensures type safety
3. **Error Sanitization**: Sensitive information is hidden in production
4. **CORS Headers**: Proper CORS configuration
5. **Authentication**: Protected routes require authentication (via middleware)

## 📊 Benefits of This Architecture

1. **Separation of Concerns**: Clear boundaries between layers
2. **Reusability**: Shared utilities reduce code duplication
3. **Maintainability**: Easy to locate and fix issues
4. **Testability**: Each layer can be tested independently
5. **Scalability**: Easy to add new features following the same pattern
6. **Type Safety**: TypeScript ensures compile-time safety
7. **Error Handling**: Consistent error handling across all routes

## 🚀 Adding New API Routes

1. Create route file in `app/api/[resource]/route.ts`
2. Import utilities from `@/lib/api`
3. Follow the pattern above
4. Add validation for required fields
5. Use database helpers for queries
6. Return standardized responses

## 📚 Related Documentation

- [API Documentation](./API_DOCS.md) - API endpoints documentation
- [README](./README.md) - Setup and usage guide

