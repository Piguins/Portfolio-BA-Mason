import { Link } from 'react-router-dom'
import { FiArrowRight, FiDownload } from 'react-icons/fi'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Xin chào, tôi là <span className="highlight">Mason</span>
              </h1>
              <h2 className="hero-subtitle">Business Analyst chuyên nghiệp</h2>
              <p className="hero-description">
                Chuyên phân tích nghiệp vụ, tối ưu hóa quy trình và tạo ra các giải pháp 
                kinh doanh hiệu quả. Với kinh nghiệm trong việc kết nối giữa công nghệ và 
                nghiệp vụ, tôi giúp các tổ chức đạt được mục tiêu chiến lược của họ.
              </p>
              <div className="hero-buttons">
                <Link to="/projects" className="btn btn-primary">
                  Xem dự án <FiArrowRight />
                </Link>
                <a href="/resume.pdf" download className="btn btn-secondary">
                  <FiDownload /> Tải CV
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-placeholder">
                <div className="placeholder-content">
                  <span>Your Photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Tại sao chọn tôi?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Phân tích dữ liệu</h3>
              <p>Chuyển đổi dữ liệu thành insights có giá trị để hỗ trợ quyết định kinh doanh</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Tối ưu quy trình</h3>
              <p>Xác định và cải thiện các quy trình nghiệp vụ để tăng hiệu quả</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Giao tiếp hiệu quả</h3>
              <p>Kết nối giữa stakeholders và team kỹ thuật một cách rõ ràng</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Giải pháp sáng tạo</h3>
              <p>Đề xuất các giải pháp đổi mới để giải quyết thách thức kinh doanh</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

