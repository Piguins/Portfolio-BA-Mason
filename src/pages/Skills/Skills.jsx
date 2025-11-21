import './Skills.css'
import { IMAGES } from '../../constants/images'

const Skills = () => {
  return (
    <section id="about" className="skills-section">
      <div className="skills-container">
        <div className="skills-content-wrapper">
          <div className="skills-logos">
            <div className="skills-circles-bg">
              <img src={IMAGES.skillsCirclesBg} alt="" />
            </div>
            <div className="logo-item logo-1">
              <img src={IMAGES.sqlLogo} alt="SQL" />
            </div>
            <div className="logo-item logo-2">
              <img src={IMAGES.excelLogo} alt="Excel" />
            </div>
            <div className="logo-item logo-3">
              <img src={IMAGES.powerBILogo} alt="Power BI" />
            </div>
            <div className="logo-item logo-4">
              <img src={IMAGES.tableauLogo} alt="Tableau" />
            </div>
            <div className="logo-item logo-5">
              <img src={IMAGES.jiraLogo} alt="Jira" />
            </div>
          </div>
          <div className="skills-cards">
            <h2 className="skills-title">I specialize in</h2>
            <div className="skill-card skill-card-1">
              <div className="skill-card-number">1</div>
              <h3 className="skill-card-title">Business Analysis</h3>
              <p className="skill-card-description">
                I analyze business processes and requirements, which allows me to build any project fast and conveniently.
              </p>
            </div>
            <div className="skill-card skill-card-2">
              <div className="skill-card-number">2</div>
              <h3 className="skill-card-title">Data Analytics</h3>
              <p className="skill-card-description">
                Yes, I absolutely love data analytics solutions, and I use them in every single project.
              </p>
            </div>
            <div className="skill-card skill-card-3">
              <div className="skill-card-number">3</div>
              <h3 className="skill-card-title">Process Optimization</h3>
              <p className="skill-card-description">
                I also use process optimization systems for workflow structure, which allows me to build any project fast and conveniently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills

