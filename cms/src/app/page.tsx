// Root page - will be redirected by middleware
// If authenticated -> /dashboard
// If not authenticated -> /login

// Force dynamic rendering - this page redirects based on auth status
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RootPage() {
  return null
}
