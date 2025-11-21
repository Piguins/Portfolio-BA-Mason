import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { IMAGES } from './constants/images'

// Preload hero image immediately when app starts
const preloadHeroImage = () => {
  const img = new Image()
  img.src = IMAGES.heroImage
  img.fetchPriority = 'high'
  img.crossOrigin = 'anonymous'
  // Start loading immediately
  document.head.appendChild(
    Object.assign(document.createElement('link'), {
      rel: 'preload',
      as: 'image',
      href: IMAGES.heroImage,
      fetchPriority: 'high',
      crossOrigin: 'anonymous'
    })
  )
}

// Start preloading immediately
preloadHeroImage()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

