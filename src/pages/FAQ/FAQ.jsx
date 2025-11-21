import { useState } from 'react'
import './FAQ.css'
import { useTranslations } from '../../hooks/useTranslations'

const FAQ = () => {
  const t = useTranslations()
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-label">{t.faq.label}</span>
          <h2 className="faq-title">{t.faq.title} <span className="faq-title-accent">{t.faq.titleAccent}</span></h2>
          <p className="faq-intro">{t.faq.intro}</p>
          <a href={`mailto:${t.faq.email}`} className="faq-email">{t.faq.email}</a>
        </div>
        <div className="faq-list">
          {t.faq.questions.map((item, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'faq-item-open' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{item.question}</h3>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && item.answer && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ

