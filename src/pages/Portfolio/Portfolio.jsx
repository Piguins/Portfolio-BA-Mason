import { FiArrowRight } from 'react-icons/fi'
import { useTranslations } from '../../hooks/useTranslations'
import { IMAGES } from '../../constants/images'
import './Portfolio.css'

const Portfolio = () => {
  const t = useTranslations()

  return (
    <section id="portfolio" className="portfolio-section">
      {/* Decorative wavy vector pattern */}
      <div className="wavy-decoration wavy-decoration-2">
        <img src={IMAGES.wavyVector2} alt="" />
      </div>
      
      <h2 className="portfolio-title">{t.portfolio.title}</h2>
      <div className="portfolio-items">
        <div className="portfolio-item portfolio-item-1">
          <div className="portfolio-content">
            <h3 className="portfolio-item-title">{t.portfolio.project1.title}</h3>
            <div className="portfolio-tags">
              {t.portfolio.project1.tags.map((tag, index) => (
                <span key={index} className="portfolio-tag">{tag}</span>
              ))}
            </div>
            <p className="portfolio-item-description">
              {t.portfolio.project1.description}
            </p>
            <a href="#portfolio" className="portfolio-btn">
              {t.portfolio.project1.button} <FiArrowRight />
            </a>
          </div>
          <div className="portfolio-image">
            <div className="portfolio-bg portfolio-bg-1"></div>
            <div className="portfolio-pattern"></div>
          </div>
        </div>
        <div className="portfolio-item portfolio-item-2">
          <div className="portfolio-content">
            <h3 className="portfolio-item-title">{t.portfolio.project2.title}</h3>
            <div className="portfolio-tags">
              {t.portfolio.project2.tags.map((tag, index) => (
                <span key={index} className="portfolio-tag">{tag}</span>
              ))}
            </div>
            <p className="portfolio-item-description">
              {t.portfolio.project2.description}
            </p>
            <a href="#portfolio" className="portfolio-btn">
              {t.portfolio.project2.button} <FiArrowRight />
            </a>
          </div>
          <div className="portfolio-image">
            <div className="portfolio-bg portfolio-bg-2"></div>
            <div className="portfolio-pattern"></div>
          </div>
        </div>
        <div className="portfolio-item portfolio-item-3">
          <div className="portfolio-content">
            <h3 className="portfolio-item-title">{t.portfolio.project3.title}</h3>
            <div className="portfolio-tags">
              {t.portfolio.project3.tags.map((tag, index) => (
                <span key={index} className="portfolio-tag">{tag}</span>
              ))}
            </div>
            <p className="portfolio-item-description">
              {t.portfolio.project3.description}
            </p>
            <a href="#portfolio" className="portfolio-btn">
              {t.portfolio.project3.button} <FiArrowRight />
            </a>
          </div>
          <div className="portfolio-image">
            <div className="portfolio-bg portfolio-bg-1"></div>
            <div className="portfolio-pattern"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio

