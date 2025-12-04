import { useState, useEffect } from 'react'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { useTranslations } from '../../hooks/useTranslations'
import { experienceService } from '../../services/experienceService'
import './Experience.css'

const Experience = () => {
  const t = useTranslations()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await experienceService.getAll()
        
        // Format data for UI
        const formatted = data.map(exp => experienceService.formatExperience(exp))
        
        // Sort by order_index and start_date
        formatted.sort((a, b) => {
          if (a.orderIndex !== b.orderIndex) {
            return a.orderIndex - b.orderIndex
          }
          // If same order, sort by start_date (newest first)
          // Get original data to access start_date
          const expA = data.find(e => e.id === a.id)
          const expB = data.find(e => e.id === b.id)
          if (expA && expB) {
            return new Date(expB.start_date) - new Date(expA.start_date)
          }
          return 0
        })
        
        setExperiences(formatted)
      } catch (err) {
        console.error('Failed to load experiences:', err)
        setError(err.message || 'Không thể tải dữ liệu kinh nghiệm')
        // Fallback to translations if API fails
        if (t.experience?.items) {
          setExperiences(
            t.experience.items.map((item, index) => ({
              id: `fallback-${index}`,
              role: item.role,
              company: item.company,
              location: item.location,
              dates: item.dates,
              description: item.description,
              achievements: item.achievements || [],
              skills: item.skills || [],
              isCurrent: false,
              orderIndex: index,
            }))
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [t.experience])

  if (loading) {
    return (
      <section id="experience" className="experience-section">
        <div className="experience-container">
          <h2 className="experience-title">{t.experience.title}</h2>
          <p className="experience-subtitle">{t.experience.subtitle}</p>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            Đang tải dữ liệu...
          </div>
        </div>
      </section>
    )
  }

  if (error && experiences.length === 0) {
    return (
      <section id="experience" className="experience-section">
        <div className="experience-container">
          <h2 className="experience-title">{t.experience.title}</h2>
          <p className="experience-subtitle">{t.experience.subtitle}</p>
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#DC2626',
            background: '#FEE2E2',
            borderRadius: '12px',
            margin: '2rem auto',
            maxWidth: '600px'
          }}>
            <p>{error}</p>
            <p style={{ fontSize: '14px', marginTop: '0.5rem', color: 'var(--text-light)' }}>
              Đang sử dụng dữ liệu mặc định
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        <h2 className="experience-title">{t.experience.title}</h2>
        <p className="experience-subtitle">{t.experience.subtitle}</p>
        
        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            color: '#92400E',
            background: '#FEF3C7',
            borderRadius: '8px',
            margin: '1rem auto 2rem',
            maxWidth: '600px',
            fontSize: '14px'
          }}>
            ⚠️ {error} - Đang hiển thị dữ liệu từ API
          </div>
        )}
        
        <div className="experience-timeline">
          {experiences.map((item, index) => (
            <div key={item.id || index} className="experience-item">
              <div className="experience-number">{index + 1}</div>
              <div className="experience-content">
                <h3 className="experience-role">{item.role}</h3>
                <h4 className="experience-company">{item.company}</h4>
                
                <div className="experience-meta">
                  <div className="experience-meta-item">
                    <FiCalendar className="meta-icon" />
                    <span>{item.dates}</span>
                  </div>
                  {item.location && (
                    <div className="experience-meta-item">
                      <FiMapPin className="meta-icon" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
                
                {item.description && (
                  <p className="experience-description">{item.description}</p>
                )}
                
                {item.achievements && item.achievements.length > 0 && (
                  <div className="experience-achievements">
                    <h5 className="achievements-title">{t.experience.achievementsTitle}</h5>
                    <ul className="achievements-list">
                      {item.achievements.map((achievement, idx) => (
                        <li key={idx} className="achievement-item">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.skills && item.skills.length > 0 && (
                  <div className="experience-skills">
                    {item.skills.map((skill, idx) => (
                      <span key={idx} className="experience-skill-tag">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
