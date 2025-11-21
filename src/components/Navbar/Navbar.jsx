import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi'
import { useTranslations } from '../../hooks/useTranslations'
import { useLanguage } from '../../contexts/LanguageContext'
import './Navbar.css'

const Navbar = () => {
  const t = useTranslations()
  const { language, toggleLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Detect active section
      const sections = ['home', 'about', 'portfolio', 'faq', 'contact']
      const scrollPosition = window.scrollY + 150
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsOpen(false)
    }
  }

  const navLinks = [
    { id: 'home', label: t.navbar.home },
    { id: 'about', label: t.navbar.about },
    { id: 'portfolio', label: t.navbar.portfolio },
    { id: 'faq', label: t.navbar.faq },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home') }} className="nav-logo">
          <span className="logo-text">{t.navbar.logo}</span>
        </a>
        
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.id) }}
              className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
            >
              <span className="nav-link-text">{link.label}</span>
            </a>
          ))}
          <button
            className="nav-language-btn"
            onClick={toggleLanguage}
            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            {language === 'vi' ? 'EN' : 'VI'}
          </button>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}
            className="nav-btn"
          >
            {t.navbar.contact} <FiArrowRight />
          </a>
        </div>

        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

