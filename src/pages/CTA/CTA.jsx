import { FaLinkedin, FaGithub } from 'react-icons/fa'
import './CTA.css'

const CTA = () => {
  return (
    <>
      {/* CTA Section 1 */}
      <section className="cta-section cta-section-1">
        <div className="cta-content">
          <h2 className="cta-title">Try me out, risk free!</h2>
          <p className="cta-description">
            If you're not happy with the analysis after the first draft,
            I'll refund your deposit, <strong>no questions asked</strong>
          </p>
          <a href="#contact" className="cta-btn">
            Contact
          </a>
        </div>
      </section>

      {/* CTA Section 2 / Contact */}
      <section id="contact" className="cta-section cta-section-2">
        <div className="cta-wrapper">
          <div className="cta-info">
            <div className="cta-avatar">
              <div className="avatar-placeholder"></div>
            </div>
            <h3 className="cta-heading">Let's build it together.</h3>
            <div className="cta-buttons">
              <a href="mailto:youremail@gmail.com" className="cta-link-btn">
                <FaLinkedin /> My Linkedin
              </a>
              <a href="/resume.pdf" download className="cta-link-btn">
                <FaGithub /> Download my resume
              </a>
            </div>
          </div>
          <div className="cta-card">
            <h3 className="cta-card-title">Try me out, risk free!</h3>
            <p className="cta-card-description">Let's build something great together</p>
            <a href="#contact" className="cta-card-btn">Contact</a>
          </div>
        </div>
      </section>
    </>
  )
}

export default CTA

