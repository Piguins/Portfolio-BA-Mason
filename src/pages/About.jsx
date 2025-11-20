import './About.css'

const About = () => {
  return (
    <div className="about">
      <section className="about-hero">
        <div className="container">
          <h1 className="page-title">Về tôi</h1>
          <p className="page-subtitle">Tìm hiểu thêm về hành trình và đam mê của tôi</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Chào mừng đến với portfolio của tôi</h2>
              <p>
                Tôi là một Business Analyst với niềm đam mê trong việc phân tích nghiệp vụ 
                và tạo ra các giải pháp kinh doanh hiệu quả. Với nền tảng vững chắc về phân tích 
                dữ liệu và hiểu biết sâu sắc về quy trình nghiệp vụ, tôi giúp các tổ chức đạt được 
                mục tiêu của họ thông qua việc tối ưu hóa quy trình và ra quyết định dựa trên dữ liệu.
              </p>
              <p>
                Trong sự nghiệp của mình, tôi đã làm việc với nhiều dự án đa dạng, từ các startup 
                công nghệ đến các tập đoàn lớn. Tôi tin rằng việc kết nối giữa công nghệ và nghiệp vụ 
                là chìa khóa để tạo ra giá trị bền vững.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Dự án đã hoàn thành</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">5+</div>
                <div className="stat-label">Năm kinh nghiệm</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">30+</div>
                <div className="stat-label">Khách hàng hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="experience">
        <div className="container">
          <h2 className="section-title">Kinh nghiệm làm việc</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2022 - Hiện tại</div>
              <div className="timeline-content">
                <h3>Senior Business Analyst</h3>
                <h4>Công ty ABC</h4>
                <p>
                  Dẫn dắt các dự án phân tích nghiệp vụ lớn, làm việc trực tiếp với stakeholders 
                  để xác định yêu cầu và đảm bảo việc triển khai thành công.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2020 - 2022</div>
              <div className="timeline-content">
                <h3>Business Analyst</h3>
                <h4>Công ty XYZ</h4>
                <p>
                  Phân tích và tối ưu hóa quy trình nghiệp vụ, tạo ra các báo cáo phân tích và 
                  hỗ trợ ra quyết định chiến lược.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2018 - 2020</div>
              <div className="timeline-content">
                <h3>Junior Business Analyst</h3>
                <h4>Công ty DEF</h4>
                <p>
                  Bắt đầu sự nghiệp với việc hỗ trợ các dự án phân tích, học hỏi và phát triển 
                  kỹ năng trong môi trường thực tế.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="education">
        <div className="container">
          <h2 className="section-title">Học vấn</h2>
          <div className="education-grid">
            <div className="education-card">
              <h3>Cử nhân Kinh doanh</h3>
              <h4>Đại học ABC</h4>
              <p>2014 - 2018</p>
              <p>Chuyên ngành: Quản trị kinh doanh</p>
            </div>
            <div className="education-card">
              <h3>Chứng chỉ Business Analysis</h3>
              <h4>IIBA</h4>
              <p>2019</p>
              <p>Chứng chỉ chuyên nghiệp về phân tích nghiệp vụ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

