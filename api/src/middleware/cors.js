// Simple CORS middleware - allow all origins
// Security is handled by API key authentication instead

import cors from 'cors'

/**
 * Simple CORS configuration - allow all origins
 * Security is handled by API key authentication
 */
export const corsMiddleware = cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With'],
  exposedHeaders: ['X-Response-Time', 'X-Query-Time'],
  maxAge: 86400,
  optionsSuccessStatus: 200,
})

