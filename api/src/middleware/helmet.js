// Helmet security middleware
// Sets secure HTTP headers to protect against common vulnerabilities

import helmet from 'helmet'

// Configure Helmet with security best practices
export const helmetMiddleware = helmet({
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // HTTP Strict Transport Security (HSTS)
  // Force HTTPS for 1 year (31536000 seconds)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // Content Security Policy
  // Allow Swagger UI resources for /api-docs routes
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Swagger UI
        "'unsafe-eval'", // Required for Swagger UI
        "https://unpkg.com", // Swagger UI CDN
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Swagger UI
        "https://unpkg.com", // Swagger UI CDN
      ],
      fontSrc: [
        "'self'",
        "https://unpkg.com", // Swagger UI fonts
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:", // Allow images from any HTTPS source
      ],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"], // Prevent clickjacking
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  
  // X-Frame-Options (prevent clickjacking)
  frameguard: {
    action: 'deny',
  },
  
  // X-Content-Type-Options (prevent MIME sniffing)
  noSniff: true,
  
  // X-XSS-Protection
  xssFilter: true,
  
  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  
  // Permissions Policy (formerly Feature Policy)
  permissionsPolicy: {
    features: {
      geolocation: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
    },
  },
})

