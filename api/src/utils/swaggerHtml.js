// Swagger UI HTML template
export const generateSwaggerHtml = (baseUrl) => {
  const specUrl = `${baseUrl}/api-docs.json`
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation - Mason Portfolio</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; padding: 0; background: #fafafa; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { color: #3b4151; }
    .swagger-ui * { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .swagger-ui .opblock {
      border: 1px solid #000;
      border-radius: 4px;
      margin: 0 0 15px;
    }
    .swagger-ui .try-out__btn,
    .swagger-ui .btn.try-out__btn {
      background: #4990e2;
      border-color: #4990e2;
      color: #fff;
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    .swagger-ui .opblock-summary {
      cursor: pointer !important;
      pointer-events: auto !important;
      padding: 5px;
    }
    .swagger-ui .opblock-summary:hover {
      background: rgba(0,0,0,.02);
    }
    .swagger-ui button,
    .swagger-ui .btn {
      font-family: inherit;
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    .swagger-ui .opblock-tag {
      cursor: pointer !important;
      font-size: 24px;
      margin: 0 0 5px;
      padding: 5px 0 5px 5px;
    }
    .loading-message {
      text-align: center;
      padding: 50px;
      font-size: 18px;
      color: #3b4151;
    }
    .error-message {
      text-align: center;
      padding: 50px;
      font-size: 18px;
      color: #d32f2f;
      background: #ffebee;
      border-radius: 4px;
      margin: 20px;
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
        // Check if SwaggerUIBundle is loaded
        if (typeof SwaggerUIBundle === 'undefined') {
          console.log('Waiting for SwaggerUIBundle to load...');
          setTimeout(initSwagger, 100);
          return;
        }

        const specUrl = '${specUrl}';
        console.log('Initializing Swagger UI with spec URL:', specUrl);

        // Show loading message
        const swaggerContainer = document.getElementById('swagger-ui');
        swaggerContainer.innerHTML = '<div class="loading-message">Loading API documentation...</div>';

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
            validatorUrl: null,
            tryItOutEnabled: true,
            requestInterceptor: function(request) {
              console.log('Swagger request:', request);
              return request;
            },
            responseInterceptor: function(response) {
              console.log('Swagger response:', response);
              return response;
            },
            onComplete: function() {
              console.log('✅ Swagger UI loaded successfully');
              // Force enable interactions after load
              setTimeout(function() {
                const allClickables = document.querySelectorAll(
                  '.opblock-summary, .opblock-tag, .try-out__btn, .btn.try-out__btn, .execute, .btn.execute, .authorize, .opblock-tag-section'
                );
                allClickables.forEach(function(el) {
                  if (el) {
                    el.style.pointerEvents = 'auto';
                    el.style.cursor = 'pointer';
                    if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
                      el.disabled = false;
                      el.removeAttribute('disabled');
                    }
                  }
                });
                console.log('✅ Interactions enabled');
              }, 500);
            },
            onFailure: function(data) {
              console.error('❌ Swagger UI failed to load:', data);
              swaggerContainer.innerHTML = 
                '<div class="error-message">' +
                '<h2>Failed to load API documentation</h2>' +
                '<p>Error: ' + (data.message || 'Unknown error') + '</p>' +
                '<p>Please check the console for more details.</p>' +
                '<p><a href="' + specUrl + '" target="_blank">Try opening the JSON spec directly</a></p>' +
                '</div>';
            }
          });
        } catch (error) {
          console.error('❌ Error initializing Swagger UI:', error);
          swaggerContainer.innerHTML = 
            '<div class="error-message">' +
            '<h2>Error initializing Swagger UI</h2>' +
            '<p>' + error.message + '</p>' +
            '<p>Please check the console for more details.</p>' +
            '</div>';
        }
      }

      // Initialize when DOM is ready
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
