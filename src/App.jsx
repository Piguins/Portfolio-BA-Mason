import { LanguageProvider } from './contexts/LanguageContext'
import LanguageSelector from './components/LanguageSelector'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <LanguageSelector />
        <Navbar />
        <Home />
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App

