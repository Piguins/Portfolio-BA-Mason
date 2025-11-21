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
  // Always start with no language selected (require selection on every refresh)
  const [language, setLanguage] = useState(null)
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)

  useEffect(() => {
    if (language) {
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

