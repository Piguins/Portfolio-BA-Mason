// Swagger UI HTML template
export const generateSwaggerHtml = (baseUrl) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mason Portfolio API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none; }
    body { margin: 0; }
    * { box-sizing: border-box; }
    .swagger-ui * { 
      pointer-events: auto !important; 
      user-select: auto !important;
    }
    .swagger-ui .opblock {
      position: relative !important;
      z-index: auto !important;
    }
    .swagger-ui .try-out__btn,
    .swagger-ui .btn.try-out__btn {
      cursor: pointer !important;
      pointer-events: auto !important;
      opacity: 1 !important;
      display: inline-block !important;
      visibility: visible !important;
    }
    .swagger-ui .opblock-summary {
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    .swagger-ui .opblock-summary:hover {
      background-color: rgba(0,0,0,0.05);
    }
    .swagger-ui button,
    .swagger-ui .btn {
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    .swagger-ui .opblock-tag {
      cursor: pointer !important;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
  <script>
    (function() {
      'use strict';
      
      function initSwagger() {
        if (typeof SwaggerUIBundle === 'undefined') {
          setTimeout(initSwagger, 100);
          return;
        }
        
        const specUrl = '${baseUrl}/api-docs.json';
        console.log('Loading Swagger spec from:', specUrl);
        
        try {
          window.ui = SwaggerUIBundle({
            url: specUrl,
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            tryItOutEnabled: true,
            showExtensions: true,
            showCommonExtensions: true,
            withCredentials: false,
            docExpansion: 'list',
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
            validatorUrl: null,
            onComplete: function() {
              console.log('✅ Swagger UI loaded successfully');
              setTimeout(function() {
                const allClickables = document.querySelectorAll(
                  '.opblock-summary, .opblock-tag, .try-out__btn, .btn.try-out__btn, .execute, .btn.execute, .authorize'
                );
                allClickables.forEach(function(el) {
                  el.style.pointerEvents = 'auto';
                  el.style.cursor = 'pointer';
                  if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
                    el.disabled = false;
                    el.removeAttribute('disabled');
                  }
                });
                console.log('✅ Interactions verified');
              }, 1000);
            },
            onFailure: function(data) {
              console.error('❌ Swagger UI failed to load:', data);
              document.getElementById('swagger-ui').innerHTML = 
                '<div style="padding: 20px; color: red;">' +
                '<h2>Failed to load API definition</h2>' +
                '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                '</div>';
            }
          });
        } catch (error) {
          console.error('❌ Error initializing Swagger UI:', error);
          document.getElementById('swagger-ui').innerHTML = 
            '<div style="padding: 20px; color: red;">' +
            '<h2>Error initializing Swagger UI</h2>' +
            '<pre>' + error.toString() + '</pre>' +
            '</div>';
        }
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwagger);
      } else {
        initSwagger();
      }
    })();
  </script>
</body>
</html>`
}

