import './FAQ.css'

const FAQ = () => {
  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-label">FAQ</span>
          <h2 className="faq-title">Frequently Asked <span className="faq-title-accent">Questions</span></h2>
          <p className="faq-intro">If you have any other questions, you can contact me by email</p>
          <a href="mailto:youremail@gmail.com" className="faq-email">youremail@gmail.com</a>
        </div>
        <div className="faq-list">
          <div className="faq-item faq-item-open">
            <div className="faq-question">
              <h3>Do you do business analysis or business consulting?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              <p>Community files are design files creators have shared with the Community. Create templates for wireframe, UI kits, asset libraries, and design systems. Or share educational resources, interactive tutorials, and tools to use across the design process.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>How long does a business analysis project take?</h3>
              <span className="faq-icon">+</span>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>Will you work on the project in your account or mine?</h3>
              <span className="faq-icon">+</span>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>I'm an agency, what you can do for us?</h3>
              <span className="faq-icon">+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ

