import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <div className="section-badge">About Our School</div>
            <h2>Building Character, Inspiring Excellence</h2>
            <p className="about-description">
              For nearly three decades, Blossom Private School has been Myanmar&apos;s premier 
              educational institution, combining rigorous academics with character development 
              and cultural appreciation.
            </p>

            <div className="values-list">
              <div className="value-item">
                <div className="value-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                  </svg>
                </div>
                <div className="value-content">
                  <h4>Values-Based Education</h4>
                  <p>Instilling Buddhist principles and Myanmar cultural values</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                    <path d="M2 12h20"/>
                  </svg>
                </div>
                <div className="value-content">
                  <h4>Global Perspective</h4>
                  <p>Preparing students for international opportunities</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="6"/>
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </div>
                <div className="value-content">
                  <h4>Academic Excellence</h4>
                  <p>Consistently high performance in national examinations</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <Image
              src="/building-character.jpg"
              alt="Building Character"
              width={600}
              height={400}
              className="about-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;