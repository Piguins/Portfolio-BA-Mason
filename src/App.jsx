import { LanguageProvider } from './contexts/LanguageContext'
import LanguageSelector from './components/LanguageSelector'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Analytics } from '@vercel/analytics/react'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <LanguageSelector />
        <Navbar />
        <Home />
        <Analytics />
      </div>
    </LanguageProvider>
  )
}

export default App

