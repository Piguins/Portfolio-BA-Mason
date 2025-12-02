import { useLanguage } from '../../contexts/LanguageContext'
import { translations as enTranslations } from '../../translations/en'
import './LanguageSelector.css'

const LanguageSelector = () => {
  const { showLanguageSelector, selectLanguage } = useLanguage()

  if (!showLanguageSelector) {
    return null
  }

  const handleLanguageSelect = (lang) => {
    selectLanguage(lang)
  }

  return (
    <div className="language-selector-overlay">
      <div className="language-selector-container">
        <h2 className="language-selector-title">
          {enTranslations.languageSelector.title}
        </h2>
        <div className="language-selector-buttons">
          <button
            className="language-btn language-btn-vi"
            onClick={() => handleLanguageSelect('vi')}
          >
            {enTranslations.languageSelector.vietnamese}
          </button>
          <button
            className="language-btn language-btn-en"
            onClick={() => handleLanguageSelect('en')}
          >
            {enTranslations.languageSelector.english}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector

