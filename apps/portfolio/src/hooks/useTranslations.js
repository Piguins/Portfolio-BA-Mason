import { useLanguage } from '../contexts/LanguageContext'
import { translations as enTranslations } from '../translations/en'
import { translations as viTranslations } from '../translations/vi'

export const useTranslations = () => {
  const { language } = useLanguage()
  
  // Default to English if no language selected
  const translations = language === 'vi' ? viTranslations : enTranslations
  
  return translations
}

