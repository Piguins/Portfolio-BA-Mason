import './Reviews.css'

const Reviews = () => {
  return (
    <section id="reviews" className="reviews-section">
      <h2 className="reviews-title">Customers reviews</h2>
      <div className="reviews-items">
        <div className="review-card">
          <div className="review-avatar">
            <div className="avatar-placeholder"></div>
          </div>
          <p className="review-text">
            To ensure that the Community continues to be the best place to find business analysis resources, we ask that you avoid the following
          </p>
          <p className="review-author">Anna Writens</p>
          <span className="review-role">Designer</span>
        </div>
        <div className="review-card">
          <div className="review-avatar">
            <div className="avatar-placeholder"></div>
          </div>
          <p className="review-text">
            To ensure that the Community continues to be the best place to find business analysis resources, we ask that you avoid the following
          </p>
          <p className="review-author">Anna Writens</p>
          <span className="review-role">Designer</span>
        </div>
        <div className="review-card">
          <div className="review-avatar">
            <div className="avatar-placeholder"></div>
          </div>
          <p className="review-text">
            To ensure that the Community continues to be the best place to find business analysis resources, we ask that you avoid the following
          </p>
          <p className="review-author">Anna Writens</p>
          <span className="review-role">Designer</span>
        </div>
      </div>
      <div className="reviews-arrows">
        <button className="arrow-btn"><span>←</span></button>
        <button className="arrow-btn active"><span>→</span></button>
      </div>
    </section>
  )
}

export default Reviews

