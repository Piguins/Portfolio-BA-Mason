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

