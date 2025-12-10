import { useState, useEffect } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { useTranslations } from '../../hooks/useTranslations'
import { useLanguage } from '../../contexts/LanguageContext'
import { IMAGES } from '../../constants/images'
import { portfolioService } from '../../services/portfolioService'
import './Portfolio.css'

const Portfolio = () => {
  const t = useTranslations()
  const { language } = useLanguage()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        // Use current language or default to 'en'
        const lang = language || 'en'
        const data = await portfolioService.getAll(lang)
        const formatted = data.map(project => portfolioService.formatProject(project))
        // Sort by created_at (newest first) and limit to 3
        formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setProjects(formatted.slice(0, 3))
      } catch (err) {
        console.error('Failed to load projects:', err)
        // Fallback to translations
        setProjects([
          {
            id: 'fallback-1',
            title: t.portfolio.project1.title,
            description: t.portfolio.project1.description,
            tags: t.portfolio.project1.tags,
            caseStudyUrl: null,
            heroImageUrl: null,
            button: t.portfolio.project1.button,
          },
          {
            id: 'fallback-2',
            title: t.portfolio.project2.title,
            description: t.portfolio.project2.description,
            tags: t.portfolio.project2.tags,
            caseStudyUrl: null,
            heroImageUrl: null,
            button: t.portfolio.project2.button,
          },
          {
            id: 'fallback-3',
            title: t.portfolio.project3.title,
            description: t.portfolio.project3.description,
            tags: t.portfolio.project3.tags,
            caseStudyUrl: null,
            heroImageUrl: null,
            button: t.portfolio.project3.button,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [language, t.portfolio])

  // Use API data if available, otherwise fallback to translations
  const displayProjects = projects.length > 0
    ? projects
    : [
        {
          id: 'fallback-1',
          title: t.portfolio.project1.title,
          description: t.portfolio.project1.description,
          tags: t.portfolio.project1.tags,
          caseStudyUrl: null,
          button: t.portfolio.project1.button,
        },
        {
          id: 'fallback-2',
          title: t.portfolio.project2.title,
          description: t.portfolio.project2.description,
          tags: t.portfolio.project2.tags,
          caseStudyUrl: null,
          button: t.portfolio.project2.button,
        },
        {
          id: 'fallback-3',
          title: t.portfolio.project3.title,
          description: t.portfolio.project3.description,
          tags: t.portfolio.project3.tags,
          caseStudyUrl: null,
          button: t.portfolio.project3.button,
        },
      ]

  return (
    <section id="portfolio" className="portfolio-section">
      {/* Decorative wavy vector pattern */}
      {IMAGES.wavyVector2 && (
        <div className="wavy-decoration wavy-decoration-2">
          <img src={IMAGES.wavyVector2} alt="" onError={(e) => e.target.parentElement.style.display = 'none'} />
        </div>
      )}
      
      <h2 className="portfolio-title">{t.portfolio.title}</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="portfolio-items">
          {displayProjects.map((project, index) => {
            // Map ellipse images based on index
            const ellipseImages = [
              { top: IMAGES.ellipse2179, bottom: IMAGES.ellipse2180, small: IMAGES.ellipse2181 },
              { top: IMAGES.ellipse2181, bottom: IMAGES.ellipse2179, small: IMAGES.ellipse2180 },
              { top: IMAGES.ellipse2180, bottom: IMAGES.ellipse2181, small: IMAGES.ellipse2179 },
            ]
            const ellipses = ellipseImages[index % 3]
            
            return (
              <div key={project.id} className={`portfolio-item portfolio-item-${index + 1}`}>
                {/* Decorative ellipse shapes */}
                {ellipses.top && (
                  <div className={`portfolio-ellipse portfolio-ellipse-${index * 3 + 1}`}>
                    <img src={ellipses.top} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
                  </div>
                )}
                {ellipses.bottom && (
                  <div className={`portfolio-ellipse portfolio-ellipse-${index * 3 + 2}`}>
                    <img src={ellipses.bottom} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
                  </div>
                )}
                {ellipses.small && (
                  <div className={`portfolio-ellipse portfolio-ellipse-${index * 3 + 3}`}>
                    <img src={ellipses.small} alt="" loading="lazy" onError={(e) => e.target.parentElement.style.display = 'none'} />
                  </div>
                )}
                
                <div className="portfolio-content">
                  <h3 className="portfolio-item-title">{project.title}</h3>
                  <div className="portfolio-tags">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="portfolio-tag">{tag}</span>
                    ))}
                  </div>
                  <p className="portfolio-item-description">
                    {project.description}
                  </p>
                  <a 
                    href={project.caseStudyUrl || "#portfolio"} 
                    className="portfolio-btn"
                    target={project.caseStudyUrl ? "_blank" : undefined}
                    rel={project.caseStudyUrl ? "noopener noreferrer" : undefined}
                  >
                    {project.button || t.portfolio.project1?.button || 'Read Case Study'} <FiArrowRight />
                  </a>
                </div>
                <div className="portfolio-image">
                  <div className={`portfolio-bg portfolio-bg-${(index % 2) + 1}`}></div>
                  <div className="portfolio-pattern"></div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Portfolio
