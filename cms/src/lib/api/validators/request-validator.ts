/**
 * Validate required fields in request body
 * Handles both plain strings and i18n objects {en: "...", vi: "..."}
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): { isValid: true } | { isValid: false; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => {
    const value = data[field]
    
    // If undefined or null, it's missing
    if (value === undefined || value === null) {
      return true
    }
    
    // If empty string, it's missing
    if (typeof value === 'string' && value.trim() === '') {
      return true
    }
    
    // If it's an i18n object, check if it has at least one language value
    if (typeof value === 'object' && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>
      const hasValue = Object.values(obj).some(
        (v) => typeof v === 'string' && v.trim() !== ''
      )
      if (!hasValue) {
        return true
      }
    }
    
    // If it's an empty array, consider it missing (for fields that should have values)
    if (Array.isArray(value) && value.length === 0) {
      // Only consider empty array as missing if the field is explicitly required
      // Some fields like tags_text can be empty arrays
      return false // Arrays are valid even if empty
    }
    
    return false
  })

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

