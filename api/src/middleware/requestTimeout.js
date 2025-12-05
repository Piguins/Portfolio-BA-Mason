// Request timeout middleware
// Kills requests that take too long (prevents hanging requests)

export const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    // Set timeout for request
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          error: 'Request timeout',
          message: 'The request took too long to process. Please try again.',
        })
      }
    }, timeoutMs)

    // Clear timeout when response finishes
    const originalEnd = res.end
    res.end = function (...args) {
      clearTimeout(timeout)
      originalEnd.apply(this, args)
    }

    next()
  }
}

