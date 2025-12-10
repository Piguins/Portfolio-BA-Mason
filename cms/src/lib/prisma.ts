// Prisma Client Singleton
// Prevents multiple instances in development
// Optimized for serverless environments (Vercel)

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // Check DATABASE_URL at runtime (not build time)
  const databaseUrl = process.env.DATABASE_URL
  
  // Prisma Client configuration optimized for serverless
  // Only set datasources if DATABASE_URL is available
  // During build, DATABASE_URL might not be set, so we let Prisma use env var directly
  const clientConfig: {
    log: ('query' | 'error' | 'warn')[]
    datasources?: {
      db: {
        url: string
      }
    }
  } = {
    // Only log errors in production to reduce overhead
    // Query logging can be enabled in development for debugging
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  }
  
  // Only set datasources if DATABASE_URL is available
  // Otherwise, Prisma will read from env var directly (from schema.prisma)
  if (databaseUrl) {
    // For connection pooling (Supabase pooler), ensure proper parameters
    // Add pgbouncer=true if not already present to handle prepared statements correctly
    let connectionUrl = databaseUrl
    if (connectionUrl.includes('pooler.supabase.com') && !connectionUrl.includes('pgbouncer=true')) {
      // Add pgbouncer parameter if using pooler
      const separator = connectionUrl.includes('?') ? '&' : '?'
      connectionUrl = `${connectionUrl}${separator}pgbouncer=true`
    }
    
    clientConfig.datasources = {
      db: {
        url: connectionUrl,
      },
    }
  } else {
    console.warn('[Prisma] DATABASE_URL is not set. Prisma will use env var from schema.prisma')
  }
  
  const client = new PrismaClient(clientConfig)

  // Handle connection errors gracefully
  client.$on('error' as never, (e: unknown) => {
    console.error('[Prisma] Client error:', e)
  })

  // Cache client globally to reuse connections (important for serverless performance)
  // This prevents creating new Prisma client on every request
  globalForPrisma.prisma = client

  return client
}

export const prisma = getPrismaClient()

// Graceful shutdown handler
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
