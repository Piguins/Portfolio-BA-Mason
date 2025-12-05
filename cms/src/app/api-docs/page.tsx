'use client'

import { useEffect } from 'react'

export default function SwaggerPage() {
  useEffect(() => {
    // Load Swagger UI CSS first
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
    document.head.appendChild(link)

    // Load Swagger UI JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js'
    script.async = true
    script.onload = () => {
      // @ts-ignore
      const SwaggerUIBundle = window.SwaggerUIBundle
      if (SwaggerUIBundle) {
        SwaggerUIBundle({
          url: '/api/api-docs',
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.presets.standalone],
          deepLinking: true,
          displayRequestDuration: true,
          docExpansion: 'list',
          filter: true,
          showExtensions: true,
          showCommonExtensions: true,
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Mason Portfolio CMS API Documentation
      </h1>
      <div id="swagger-ui" style={{ minHeight: '600px' }} />
    </div>
  )
}
