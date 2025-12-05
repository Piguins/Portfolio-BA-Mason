'use client'

import { useEffect } from 'react'

export default function SwaggerPage() {
  useEffect(() => {
    // Load Swagger UI
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
          layout: 'StandaloneLayout',
        })
      }
    }
    document.head.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Mason Portfolio CMS API Documentation</h1>
      <div id="swagger-ui" />
    </div>
  )
}
