import { FiExternalLink, FiGithub } from 'react-icons/fi'
import './Projects.css'

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Hệ thống quản lý quy trình nghiệp vụ',
      description: 'Phân tích và tối ưu hóa quy trình nghiệp vụ cho công ty lớn, giảm thời gian xử lý 40% và tăng hiệu quả làm việc.',
      technologies: ['Business Process', 'Data Analysis', 'Stakeholder Management'],
      image: 'project1',
      link: '#',
      github: '#'
    },
    {
      id: 2,
      title: 'Phân tích dữ liệu khách hàng',
      description: 'Xây dựng hệ thống phân tích dữ liệu khách hàng để hỗ trợ ra quyết định marketing và bán hàng.',
      technologies: ['Data Analytics', 'SQL', 'Tableau'],
      image: 'project2',
      link: '#',
      github: '#'
    },
    {
      id: 3,
      title: 'Tối ưu hóa quy trình đặt hàng',
      description: 'Cải thiện quy trình đặt hàng trực tuyến, giảm thời gian xử lý và tăng tỷ lệ chuyển đổi.',
      technologies: ['Process Optimization', 'UX Analysis', 'Agile'],
      image: 'project3',
      link: '#',
      github: '#'
    },
    {
      id: 4,
      title: 'Hệ thống báo cáo tự động',
      description: 'Phát triển hệ thống báo cáo tự động cho ban lãnh đạo, cung cấp insights real-time.',
      technologies: ['Automation', 'Dashboard', 'Power BI'],
      image: 'project4',
      link: '#',
      github: '#'
    },
    {
      id: 5,
      title: 'Phân tích ROI dự án',
      description: 'Đánh giá và phân tích ROI cho các dự án đầu tư công nghệ, hỗ trợ ra quyết định chiến lược.',
      technologies: ['ROI Analysis', 'Financial Modeling', 'Risk Assessment'],
      image: 'project5',
      link: '#',
      github: '#'
    },
    {
      id: 6,
      title: 'Chuyển đổi số cho doanh nghiệp',
      description: 'Dẫn dắt dự án chuyển đổi số, từ phân tích hiện trạng đến triển khai giải pháp.',
      technologies: ['Digital Transformation', 'Change Management', 'Strategy'],
      image: 'project6',
      link: '#',
      github: '#'
    }
  ]

  return (
    <div className="projects">
      <section className="projects-hero">
        <div className="container">
          <h1 className="page-title">Dự án của tôi</h1>
          <p className="page-subtitle">Khám phá các dự án và thành tựu trong sự nghiệp của tôi</p>
        </div>
      </section>

      <section className="projects-content">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <div className="image-placeholder">
                    <span>{project.image}</span>
                  </div>
                  <div className="project-overlay">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FiExternalLink />
                    </a>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FiGithub />
                    </a>
                  </div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Projects

