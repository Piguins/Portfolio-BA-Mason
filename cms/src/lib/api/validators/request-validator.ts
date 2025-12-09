/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): { isValid: true } | { isValid: false; missingFields: string[] } {
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === ''
  )

  if (missingFields.length > 0) {
    return {
      isValid: false,
      missingFields,
    }
  }

  return { isValid: true }
}

/**
 * Validate integer ID
 */
export function validateIntegerId(id: string): { isValid: true; value: number } | { isValid: false; error: string } {
  const numId = parseInt(id, 10)
  
  if (isNaN(numId)) {
    return {
      isValid: false,
      error: 'Invalid ID format. Expected integer.',
    }
  }

  if (numId <= 0) {
    return {
      isValid: false,
      error: 'ID must be a positive integer.',
    }
  }

  return {
    isValid: true,
    value: numId,
  }
}

