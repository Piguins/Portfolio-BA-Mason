import './Footer.css'
import { useTranslations } from '../../hooks/useTranslations'

const Footer = () => {
  const t = useTranslations()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-text">{t.footer.madeWith}</p>
          </div>
          
          <div className="footer-right">
            <p className="footer-question">{t.footer.question}</p>
            <a href={`mailto:${t.footer.email}`} className="footer-email">{t.footer.email}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

