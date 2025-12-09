/**
 * API Utilities - Centralized exports
 * 
 * This module provides reusable utilities for API route handlers:
 * - Request/Response handlers
 * - Error handlers
 * - Validators
 * - Database query helpers
 */

// Handlers
export { parseRequestBody, createSuccessResponse } from './handlers/request-handler'
export { createErrorResponse, handleDatabaseError } from './handlers/error-handler'

// Validators
export { validateRequiredFields, validateIntegerId } from './validators/request-validator'
export { isValidUUID, validateUUID } from './validators/uuid-validator'

// Database helpers
export { queryFirst, queryAll, executeQuery, executeTransaction } from './database/query-helpers'

