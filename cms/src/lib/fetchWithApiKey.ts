// Helper function to add API key to fetch requests

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

/**
 * Fetch with API key automatically added
 */
export async function fetchWithApiKey(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add API key if available
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

