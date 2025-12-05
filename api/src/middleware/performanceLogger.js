// Global performance logging middleware
// Measures and logs execution time for every request

export const performanceLogger = (req, res, next) => {
  const startTime = Date.now()
  const startHrTime = process.hrtime()
  
  // Store original end function
  const originalEnd = res.end
  
  // Override end function to log performance
  res.end = function(...args) {
    const duration = Date.now() - startTime
    const [seconds, nanoseconds] = process.hrtime(startHrTime)
    const preciseDuration = seconds * 1000 + nanoseconds / 1e6
    
    // Log performance metrics
    const method = req.method
    const path = req.path
    const statusCode = res.statusCode
    
    // Color code based on performance
    let logLevel = 'info'
    let emoji = '✅'
    
    if (duration > 1000) {
      logLevel = 'warn'
      emoji = '⚠️'
    }
    if (duration > 3000) {
      logLevel = 'error'
      emoji = '🔴'
    }
    
    // Log format: [METHOD] /path - duration ms (statusCode)
    const logMessage = `${emoji} [${method}] ${path} - ${duration.toFixed(2)}ms (${statusCode})`
    
    // Include query time if available from database queries
    const dbTime = res.locals.dbQueryTime
    if (dbTime) {
      console.log(`${logMessage} | DB: ${dbTime.toFixed(2)}ms`)
    } else {
      console.log(logMessage)
    }
    
    // Set performance header for monitoring
    res.setHeader('X-Response-Time', `${duration}ms`)
    if (dbTime) {
      res.setHeader('X-DB-Query-Time', `${dbTime}ms`)
    }
    
    // Call original end function
    originalEnd.apply(this, args)
  }
  
  next()
}

// Helper to track database query time in services
export const trackDbTime = (res, queryTime) => {
  if (res.locals.dbQueryTime === undefined) {
    res.locals.dbQueryTime = 0
  }
  res.locals.dbQueryTime += queryTime
}

