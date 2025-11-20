import './Skills.css'

const Skills = () => {
  const skillCategories = [
    {
      category: 'Phân tích nghiệp vụ',
      skills: [
        { name: 'Business Process Analysis', level: 95 },
        { name: 'Requirements Gathering', level: 90 },
        { name: 'Stakeholder Management', level: 92 },
        { name: 'Gap Analysis', level: 88 }
      ]
    },
    {
      category: 'Phân tích dữ liệu',
      skills: [
        { name: 'SQL', level: 85 },
        { name: 'Excel Advanced', level: 95 },
        { name: 'Power BI', level: 88 },
        { name: 'Tableau', level: 80 },
        { name: 'Python (Pandas)', level: 75 }
      ]
    },
    {
      category: 'Quản lý dự án',
      skills: [
        { name: 'Agile/Scrum', level: 90 },
        { name: 'Project Management', level: 85 },
        { name: 'Risk Management', level: 88 },
        { name: 'Change Management', level: 87 }
      ]
    },
    {
      category: 'Công cụ & Kỹ thuật',
      skills: [
        { name: 'Jira', level: 90 },
        { name: 'Confluence', level: 88 },
        { name: 'Visio', level: 85 },
        { name: 'BPMN', level: 82 },
        { name: 'UML', level: 80 }
      ]
    }
  ]

  const certifications = [
    { name: 'CBAP - Certified Business Analysis Professional', issuer: 'IIBA', year: '2021' },
    { name: 'Agile Analysis Certification', issuer: 'IIBA', year: '2020' },
    { name: 'PMI-PBA - Professional in Business Analysis', issuer: 'PMI', year: '2022' },
    { name: 'Data Analysis with Python', issuer: 'Coursera', year: '2020' }
  ]

  return (
    <div className="skills">
      <section className="skills-hero">
        <div className="container">
          <h1 className="page-title">Kỹ năng & Chứng chỉ</h1>
          <p className="page-subtitle">Các kỹ năng và chứng chỉ chuyên nghiệp của tôi</p>
        </div>
      </section>

      <section className="skills-content">
        <div className="container">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="certifications">
        <div className="container">
          <h2 className="section-title">Chứng chỉ chuyên nghiệp</h2>
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-card">
                <div className="cert-icon">🏆</div>
                <h3>{cert.name}</h3>
                <div className="cert-details">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span className="cert-year">{cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Skills

