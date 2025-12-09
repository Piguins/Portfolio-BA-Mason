import { prisma } from '@/lib/prisma'

/**
 * Transaction client type (simplified to avoid Prisma type issues)
 */
type TransactionClient = {
  $queryRawUnsafe: <T = unknown>(query: string, ...params: unknown[]) => Promise<T>
  $executeRawUnsafe: (query: string, ...params: unknown[]) => Promise<number>
}

/**
 * Safely execute raw query and return first result
 */
export async function queryFirst<T = unknown>(
  query: string,
  ...params: unknown[]
): Promise<T | null> {
  const result = await prisma.$queryRawUnsafe<T[]>(query, ...params)
  
  if (!result || !Array.isArray(result) || result.length === 0) {
    return null
  }
  
  return result[0] as T
}

/**
 * Safely execute raw query and return all results
 */
export async function queryAll<T = unknown>(
  query: string,
  ...params: unknown[]
): Promise<T[]> {
  const result = await prisma.$queryRawUnsafe<T[]>(query, ...params)
  
  if (!result) {
    return []
  }
  
  return Array.isArray(result) ? result : [result]
}

/**
 * Safely execute raw query (for INSERT/UPDATE/DELETE)
 */
export async function executeQuery(
  query: string,
  ...params: unknown[]
): Promise<void> {
  await prisma.$executeRawUnsafe(query, ...params)
}

/**
 * Execute query in transaction
 */
export async function executeTransaction<T>(
  callback: (tx: TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(callback as any) as Promise<T>
}

