import { prisma } from '@/lib/prisma'

/**
 * Transaction client type (simplified to avoid Prisma type issues)
 */
type TransactionClient = {
  $queryRawUnsafe: (query: string, ...params: unknown[]) => Promise<unknown>
  $executeRawUnsafe: (query: string, ...params: unknown[]) => Promise<number>
}

/**
 * Safely execute raw query and return first result
 */
export async function queryFirst<T = unknown>(
  query: string,
  ...params: unknown[]
): Promise<T | null> {
  try {
    // Check DATABASE_URL before executing query
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please configure it in your environment variables.')
    }

    const result = await prisma.$queryRawUnsafe(query, ...params)
    
    if (!result) {
      return null
    }
    
    // Prisma returns array for SELECT queries
    if (Array.isArray(result)) {
      return result.length > 0 ? (result[0] as T) : null
    }
    
    // If not array, return as is (for single row queries)
    return result as T
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[queryFirst] Error executing query:', error)
      if (error instanceof Error) {
        console.error('[queryFirst] Error message:', error.message)
        console.error('[queryFirst] Error code:', (error as any).code)
      }
    }
    throw error
  }
}

/**
 * Safely execute raw query and return all results
 */
export async function queryAll<T = unknown>(
  query: string,
  ...params: unknown[]
): Promise<T[]> {
  try {
    // Check DATABASE_URL before executing query
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please configure it in your environment variables.')
    }

    const result = await prisma.$queryRawUnsafe(query, ...params)
    
    if (!result) {
      return []
    }
    
    // Prisma always returns array for SELECT queries
    if (Array.isArray(result)) {
      return result as T[]
    }
    
    // If not array, wrap in array
    return [result] as T[]
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[queryAll] Error executing query:', error)
      if (error instanceof Error) {
        console.error('[queryAll] Error message:', error.message)
        console.error('[queryAll] Error code:', (error as any).code)
      }
    }
    throw error
  }
}

/**
 * Safely execute raw query (for INSERT/UPDATE/DELETE)
 */
export async function executeQuery(
  query: string,
  ...params: unknown[]
): Promise<void> {
  try {
    // Check DATABASE_URL before executing query
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please configure it in your environment variables.')
    }

    await prisma.$executeRawUnsafe(query, ...params)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[executeQuery] Error executing query:', error)
      if (error instanceof Error) {
        console.error('[executeQuery] Error message:', error.message)
        console.error('[executeQuery] Error code:', (error as any).code)
      }
    }
    throw error
  }
}

/**
 * Execute query in transaction
 */
export async function executeTransaction<T>(
  callback: (tx: TransactionClient) => Promise<T>
): Promise<T> {
  try {
    return (await prisma.$transaction(callback as any)) as T
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[executeTransaction] Error:', error)
    }
    throw error
  }
}

