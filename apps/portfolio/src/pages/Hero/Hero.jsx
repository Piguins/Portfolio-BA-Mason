import { useState, useEffect } from 'react'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import './Hero.css'
import { IMAGES } from '../../constants/images'
import { useTranslations } from '../../hooks/useTranslations'
import { heroService } from '../../services/heroService'

const Hero = () => {
  const t = useTranslations()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [iconErrors, setIconErrors] = useState({
    linkedin: false,
    github: false,
    email: false
  })
  const [heroData, setHeroData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true)
        const data = await heroService.get()
        const formatted = heroService.formatHero(data)
        setHeroData(formatted)
      } catch (err) {
        console.error('Failed to load hero:', err)
        // Fallback to translations
        setHeroData({
          greeting: t.hero.greeting,
          greetingPart2: t.hero.greetingPart2,
          name: t.hero.name,
          title: t.hero.title,
          description: t.hero.description,
          linkedinUrl: null,
          githubUrl: null,
          emailUrl: null,
          profileImageUrl: null,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHero()
  }, [t.hero])

  // Use API data if available, otherwise fallback to translations
  const hero = heroData || {
    greeting: t.hero.greeting,
    greetingPart2: t.hero.greetingPart2,
    name: t.hero.name,
    title: t.hero.title,
    description: t.hero.description,
    linkedinUrl: null,
    githubUrl: null,
    emailUrl: null,
    profileImageUrl: null,
  }

  useEffect(() => {
    // Check if image is already loaded (from preload)
    const img = new Image()
    img.src = IMAGES.heroImage
    
    if (img.complete) {
      setImageLoaded(true)
    } else {
      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageLoaded(true) // Show image even if error
    }
    
    // Also check the actual img element
    const heroImg = document.querySelector('.hero-main-image')
    if (heroImg && heroImg.complete) {
      setImageLoaded(true)
    }
  }, [])

  return (
    <section id="home" className="hero">
      {/* Decorative wavy vector patterns */}
      {IMAGES.wavyVector1 && (
        <div className="wavy-decoration wavy-decoration-hero-1">
          <img src={IMAGES.wavyVector1} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
        </div>
      )}
      {IMAGES.wavyVector2 && (
        <div className="wavy-decoration wavy-decoration-hero-2">
          <img src={IMAGES.wavyVector2} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
        </div>
      )}
      {IMAGES.wavyVector3 && (
        <div className="wavy-decoration wavy-decoration-hero-3">
          <img src={IMAGES.wavyVector3} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
        </div>
      )}
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line-1">{hero.greeting} </span>
              <span className="title-line-2">{hero.greetingPart2} </span>
              <span className="title-line-2 bold">{hero.name}</span>
              <span className="title-line-1">, </span>
              <br />
              <span className="title-line-3">{hero.title}</span>
            </h1>
            <p className="hero-description">
              {hero.description}
            </p>
            <div className="hero-social-buttons">
              <a 
                href={hero.linkedinUrl || "https://www.linkedin.com/in/piguinslie/"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn"
              >
                {IMAGES.linkedinIcon && !iconErrors.linkedin ? (
                  <img 
                    src={IMAGES.linkedinIcon} 
                    alt="LinkedIn" 
                    loading="lazy" 
                    onError={() => setIconErrors(prev => ({ ...prev, linkedin: true }))} 
                  />
                ) : (
                  <FaLinkedin />
                )}
              </a>
              <a 
                href={hero.githubUrl || "https://github.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn"
              >
                {IMAGES.githubIcon && !iconErrors.github ? (
                  <img 
                    src={IMAGES.githubIcon} 
                    alt="GitHub" 
                    loading="lazy" 
                    onError={() => setIconErrors(prev => ({ ...prev, github: true }))} 
                  />
                ) : (
                  <FaGithub />
                )}
              </a>
              <a 
                href={hero.emailUrl ? `mailto:${hero.emailUrl}` : "mailto:contact@example.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn"
              >
                {IMAGES.emailIcon && !iconErrors.email ? (
                  <img 
                    src={IMAGES.emailIcon} 
                    alt="Email" 
                    loading="lazy" 
                    onError={() => setIconErrors(prev => ({ ...prev, email: true }))} 
                  />
                ) : (
                  <FaEnvelope />
                )}
              </a>
            </div>
          </div>
          <div className="hero-image-section">
            <div className="hero-image-wrapper">
              <div className="hero-circle"></div>
              {!imageLoaded && (
                <div className="hero-image-placeholder">
                  <div className="hero-image-skeleton"></div>
                </div>
              )}
              <img 
                src={hero.profileImageUrl || IMAGES.heroImage} 
                alt={`${hero.name} - ${hero.title}`} 
                className={`hero-main-image ${imageLoaded ? 'loaded' : ''}`}
                width="320"
                height="380"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              {IMAGES.squersDecoration && (
                <div className="squers-decoration">
                  <img src={IMAGES.squersDecoration} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
                </div>
              )}
            </div>
            {IMAGES.blurGradient && (
              <div className="blur-gradient">
                <img src={IMAGES.blurGradient} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

