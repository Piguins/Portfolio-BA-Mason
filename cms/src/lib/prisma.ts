// Prisma Client Singleton
// Prevents multiple instances in development

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
  
  if (!databaseUrl) {
    console.error('[Prisma] DATABASE_URL is not set in environment variables')
    // Still create client but it will fail on first query
    // This allows build to succeed but runtime will catch the error
  }
  
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = getPrismaClient()
