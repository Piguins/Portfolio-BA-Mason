import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('portfolio-language')
    if (savedLanguage) {
      return savedLanguage
    }
    // Return null if no language selected yet
    return null
  })
  const [showLanguageSelector, setShowLanguageSelector] = useState(!language)

  useEffect(() => {
    if (language) {
      localStorage.setItem('portfolio-language', language)
      setShowLanguageSelector(false)
    }
  }, [language])

  const selectLanguage = (lang) => {
    setLanguage(lang)
  }

  const value = {
    language,
    selectLanguage,
    showLanguageSelector,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

