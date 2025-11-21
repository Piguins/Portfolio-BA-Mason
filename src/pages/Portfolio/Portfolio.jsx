import { FiArrowRight } from 'react-icons/fi'
import './Portfolio.css'

const Portfolio = () => {
  return (
    <section id="portfolio" className="portfolio-section">
      <h2 className="portfolio-title">Portfolio</h2>
      <div className="portfolio-items">
        <div className="portfolio-item portfolio-item-1">
          <div className="portfolio-content">
            <h3 className="portfolio-item-title">Re-Design For Business Analyst Portfolio</h3>
            <div className="portfolio-tags">
              <span className="portfolio-tag">Business Analysis</span>
              <span className="portfolio-tag">Data Analysis</span>
            </div>
            <p className="portfolio-item-description">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
            <a href="#portfolio" className="portfolio-btn">
              Read Case Study <FiArrowRight />
            </a>
          </div>
          <div className="portfolio-image">
            <div className="portfolio-bg portfolio-bg-1"></div>
            <div className="portfolio-pattern"></div>
          </div>
        </div>
        <div className="portfolio-item portfolio-item-2">
          <div className="portfolio-content">
            <h3 className="portfolio-item-title">Process Optimization Project</h3>
            <div className="portfolio-tags">
              <span className="portfolio-tag">Process Optimization</span>
              <span className="portfolio-tag">Change Management</span>
            </div>
            <p className="portfolio-item-description">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
            <a href="#portfolio" className="portfolio-btn">
              Read Case Study <FiArrowRight />
            </a>
          </div>
          <div className="portfolio-image">
            <div className="portfolio-bg portfolio-bg-2"></div>
            <div className="portfolio-pattern"></div>
          </div>
        </div>
        <div className="portfolio-item portfolio-item-3">
          <div className="portfolio-content">
            <h3 className="portfolio-item-title">Data Analytics Dashboard Design</h3>
            <div className="portfolio-tags">
              <span className="portfolio-tag">Data Analytics</span>
              <span className="portfolio-tag">Dashboard Design</span>
            </div>
            <p className="portfolio-item-description">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
            <a href="#portfolio" className="portfolio-btn">
              Read Case Study <FiArrowRight />
            </a>
          </div>
          <div className="portfolio-image">
            <div className="portfolio-bg portfolio-bg-1"></div>
            <div className="portfolio-pattern"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio

