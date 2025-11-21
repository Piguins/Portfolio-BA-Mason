import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { IMAGES } from './constants/images'

// Preload hero image immediately when app starts - before React renders
if (typeof window !== 'undefined') {
  // Create and start loading image immediately
  const img = new Image()
  img.src = IMAGES.heroImage
  // This forces browser to start downloading immediately
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

