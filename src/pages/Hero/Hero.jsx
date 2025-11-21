import './Hero.css'
import { IMAGES } from '../../constants/images'

const Hero = () => {

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line-1">HEY! </span>
              <span className="title-line-2">I'm </span>
              <span className="title-line-2 bold">Mason</span>
              <span className="title-line-1">, </span>
              <br />
              <span className="title-line-3">Business </span>
              <span className="title-line-3">Analyst</span>
            </h1>
            <p className="hero-description">
              Agency-quality business analysis with the personal touch of a freelancer.
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
              <img src={IMAGES.heroImage} alt="Mason - Business Analyst" className="hero-main-image" />
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

