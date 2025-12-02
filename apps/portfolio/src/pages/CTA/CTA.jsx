import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { useTranslations } from '../../hooks/useTranslations'
import { IMAGES } from '../../constants/images'
import './CTA.css'

const CTA = () => {
  const t = useTranslations()

  return (
    <>
      {/* CTA Section 1 */}
      <section className="cta-section cta-section-1">
        {/* Decorative wavy vector pattern */}
        {IMAGES.wavyVector3 && (
          <div className="wavy-decoration wavy-decoration-cta1">
            <img src={IMAGES.wavyVector3} alt="" onError={(e) => e.target.parentElement.style.display = 'none'} />
          </div>
        )}
        
        <div className="cta-content">
          <h2 className="cta-title">{t.cta.section1.title}</h2>
          <p className="cta-description">
            {t.cta.section1.description}
          </p>
          <a href="#contact" className="cta-btn">
            {t.cta.section1.button}
          </a>
        </div>
      </section>

      {/* CTA Section 2 / Contact */}
      <section id="contact" className="cta-section cta-section-2">
        {/* Decorative wavy vector pattern */}
        {IMAGES.wavyVector1 && (
          <div className="wavy-decoration wavy-decoration-cta2">
            <img src={IMAGES.wavyVector1} alt="" onError={(e) => e.target.parentElement.style.display = 'none'} />
          </div>
        )}
        
        <div className="cta-wrapper">
          <div className="cta-info">
            <div className="cta-avatar">
              <div className="avatar-placeholder"></div>
            </div>
            <h3 className="cta-heading">{t.cta.section2.heading}</h3>
            <div className="cta-buttons">
              <a href="mailto:youremail@gmail.com" className="cta-link-btn">
                <FaLinkedin /> {t.cta.section2.linkedin}
              </a>
              <a href="/resume.pdf" download className="cta-link-btn">
                <FaGithub /> {t.cta.section2.resume}
              </a>
            </div>
          </div>
          <div className="cta-card">
            <h3 className="cta-card-title">{t.cta.section2.card.title}</h3>
            <p className="cta-card-description">{t.cta.section2.card.description}</p>
            <a href="#contact" className="cta-card-btn">{t.cta.section2.card.button}</a>
          </div>
        </div>
      </section>
    </>
  )
}

export default CTA

