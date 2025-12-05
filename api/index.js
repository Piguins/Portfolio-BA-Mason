// Entry point for Vercel serverless function
import app from './src/index.js'

// Export handler for Vercel
export default function handler(req, res) {
  return app(req, res)
}
