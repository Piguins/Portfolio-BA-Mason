/**
 * UUID v4 validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Validate UUID format
 */
export function isValidUUID(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }
  return UUID_REGEX.test(value)
}

/**
 * Validate and parse UUID, throws if invalid
 */
export function validateUUID(value: string, fieldName: string = 'id'): string {
  if (!isValidUUID(value)) {
    throw new Error(`Invalid ${fieldName} format. Expected UUID.`)
  }
  return value
}

