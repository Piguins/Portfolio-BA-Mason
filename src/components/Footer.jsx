import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-text">Made with ❤️ by me.</p>
          </div>
          
          <div className="footer-right">
            <p className="footer-question">Got a question?</p>
            <a href="mailto:youremail@gmail.com" className="footer-email">youremail@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

