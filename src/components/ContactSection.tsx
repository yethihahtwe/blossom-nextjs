const ContactSection = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Visit Our Campus</h2>
            <p className="contact-description">
              Experience our vibrant learning community firsthand. Schedule a campus tour 
              or attend one of our information sessions.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="contact-text">
                  <strong>Thatipahtan Street, Myingyan, Myanmar</strong>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="contact-text">
                  <strong>+95 9 45126 2018</strong>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="contact-text">
                  <strong>info@blossom.edu.mm</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h3>Request Information</h3>
            <form className="contact-form" method="POST" action="#" id="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input type="text" name="first_name" placeholder="First Name" required />
                </div>
                <div className="form-group">
                  <input type="text" name="last_name" placeholder="Last Name" required />
                </div>
              </div>

              <div className="form-group">
                <input type="email" name="email" placeholder="Email Address" required />
              </div>

              <div className="form-group">
                <input type="tel" name="phone" placeholder="Phone Number" required />
              </div>

              <div className="form-group">
                <select name="grade_level" required>
                  <option value="">Grade Level of Interest</option>
                  <option value="primary">Primary Education (Grades 1-5)</option>
                  <option value="secondary">Secondary Education (Grades 6-10)</option>
                  <option value="university-prep">University Preparation (Grades 11-12)</option>
                </select>
              </div>

              <button type="submit" className="contact-submit-btn">Send Information Request</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;