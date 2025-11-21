import './Hero.css'
import { IMAGES } from '../../constants/images'
import { useTranslations } from '../../hooks/useTranslations'

const Hero = () => {
  const t = useTranslations()

  return (
    <section id="home" className="hero">
      {/* Decorative wavy vector patterns */}
      <div className="wavy-decoration wavy-decoration-hero-1">
        <img src={IMAGES.wavyVector1} alt="" />
      </div>
      <div className="wavy-decoration wavy-decoration-hero-2">
        <img src={IMAGES.wavyVector2} alt="" />
      </div>
      <div className="wavy-decoration wavy-decoration-hero-3">
        <img src={IMAGES.wavyVector3} alt="" />
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line-1">{t.hero.greeting} </span>
              <span className="title-line-2">{t.hero.greetingPart2} </span>
              <span className="title-line-2 bold">{t.hero.name}</span>
              <span className="title-line-1">, </span>
              <br />
              <span className="title-line-3">{t.hero.title}</span>
            </h1>
            <p className="hero-description">
              {t.hero.description}
            </p>
            <div className="hero-social-buttons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn">
                <img src={IMAGES.linkedinIcon} alt="LinkedIn" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-btn">
                <img src={IMAGES.githubIcon} alt="GitHub" />
              </a>
              <a href="https://email.com" target="_blank" rel="noopener noreferrer" className="social-btn">
                <img src={IMAGES.emailIcon} alt="Email" />
              </a>
            </div>
          </div>
          <div className="hero-image-section">
            <div className="hero-image-wrapper">
              <div className="hero-circle"></div>
              <img src={IMAGES.heroImage} alt={`${t.hero.name} - ${t.hero.title}`} className="hero-main-image" />
              <div className="squers-decoration">
                <img src={IMAGES.squersDecoration} alt="" />
              </div>
            </div>
            <div className="blur-gradient">
              <img src={IMAGES.blurGradient} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

