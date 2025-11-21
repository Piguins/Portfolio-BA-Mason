import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { useTranslations } from '../../hooks/useTranslations'
import './Experience.css'

const Experience = () => {
  const t = useTranslations()

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        <h2 className="experience-title">{t.experience.title}</h2>
        <p className="experience-subtitle">{t.experience.subtitle}</p>
        
        <div className="experience-timeline">
          {t.experience.items.map((item, index) => (
            <div key={index} className="experience-item">
              <div className="experience-number">{index + 1}</div>
              <div className="experience-content">
                <h3 className="experience-role">{item.role}</h3>
                <h4 className="experience-company">{item.company}</h4>
                
                <div className="experience-meta">
                  <div className="experience-meta-item">
                    <FiCalendar className="meta-icon" />
                    <span>{item.dates}</span>
                  </div>
                  <div className="experience-meta-item">
                    <FiMapPin className="meta-icon" />
                    <span>{item.location}</span>
                  </div>
                </div>
                
                <p className="experience-description">{item.description}</p>
                
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

