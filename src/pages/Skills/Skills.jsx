import './Skills.css'
import { IMAGES } from '../../constants/images'
import { useTranslations } from '../../hooks/useTranslations'

const Skills = () => {
  const t = useTranslations()

  return (
    <section id="about" className="skills-section">
      <div className="skills-container">
        <h2 className="skills-title">{t.skills.title}</h2>
        <div className="skills-content-wrapper">
          <div className="skills-logos">
            {/* Orbital paths - quỹ đạo */}
            <svg className="orbital-paths" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              {/* Outer orbit paths */}
              <circle className="orbit-path orbit-path-1" cx="250" cy="250" r="180" fill="none" stroke="rgba(88, 63, 188, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-2" cx="250" cy="250" r="220" fill="none" stroke="rgba(125, 224, 234, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-3" cx="250" cy="250" r="160" fill="none" stroke="rgba(88, 63, 188, 0.12)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-4" cx="250" cy="250" r="190" fill="none" stroke="rgba(125, 224, 234, 0.12)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-5" cx="250" cy="250" r="200" fill="none" stroke="rgba(88, 63, 188, 0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-6" cx="250" cy="250" r="170" fill="none" stroke="rgba(125, 224, 234, 0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-7" cx="250" cy="250" r="210" fill="none" stroke="rgba(88, 63, 188, 0.08)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-8" cx="250" cy="250" r="185" fill="none" stroke="rgba(125, 224, 234, 0.08)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-9" cx="250" cy="250" r="195" fill="none" stroke="rgba(88, 63, 188, 0.08)" strokeWidth="1" strokeDasharray="5,5" />
            </svg>
            {IMAGES.skillsCirclesBg && (
              <div className="skills-circles-bg">
                <img src={IMAGES.skillsCirclesBg} alt="" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.sqlLogo && (
              <div className="logo-item logo-1">
                <img src={IMAGES.sqlLogo} alt="SQL" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.excelLogo && (
              <div className="logo-item logo-2">
                <img src={IMAGES.excelLogo} alt="Excel" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.powerBILogo && (
              <div className="logo-item logo-3">
                <img src={IMAGES.powerBILogo} alt="Power BI" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.tableauLogo && (
              <div className="logo-item logo-4">
                <img src={IMAGES.tableauLogo} alt="Tableau" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.jiraLogo && (
              <div className="logo-item logo-5">
                <img src={IMAGES.jiraLogo} alt="Jira" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.figmaLogo && (
              <div className="logo-item logo-6">
                <img src={IMAGES.figmaLogo} alt="Figma" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.postmanLogo && (
              <div className="logo-item logo-7">
                <img src={IMAGES.postmanLogo} alt="Postman" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.postgresqlLogo && (
              <div className="logo-item logo-8">
                <img src={IMAGES.postgresqlLogo} alt="PostgreSQL" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.metabaseLogo && (
              <div className="logo-item logo-9">
                <img src={IMAGES.metabaseLogo} alt="Metabase" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
          </div>
          <div className="skills-cards">
            <div className="skill-card skill-card-1">
              <div className="skill-card-number">{t.skills.skill1.number}</div>
              <h3 className="skill-card-title">{t.skills.skill1.title}</h3>
              <p className="skill-card-description">
                {t.skills.skill1.description}
              </p>
            </div>
            <div className="skill-card skill-card-2">
              <div className="skill-card-number">{t.skills.skill2.number}</div>
              <h3 className="skill-card-title">{t.skills.skill2.title}</h3>
              <p className="skill-card-description">
                {t.skills.skill2.description}
              </p>
            </div>
            <div className="skill-card skill-card-3">
              <div className="skill-card-number">{t.skills.skill3.number}</div>
              <h3 className="skill-card-title">{t.skills.skill3.title}</h3>
              <p className="skill-card-description">
                {t.skills.skill3.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills

