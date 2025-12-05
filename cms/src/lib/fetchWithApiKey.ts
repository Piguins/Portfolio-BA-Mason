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
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

