const ProgramsSection = () => {
  const programs = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="m22 21-3-3"/>
          <circle cx="20" cy="8" r="3"/>
        </svg>
      ),
      title: "Primary Education",
      grade: "Grades 1-5 • Ages 6-11",
      description: "Foundation learning with emphasis on Myanmar language, English, mathematics, and cultural studies in a nurturing environment.",
      features: [
        "Bilingual curriculum (Myanmar & English)",
        "Character development programs",
        "Arts and sports activities"
      ]
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      title: "Secondary Education",
      grade: "Grades 6-10 • Ages 12-16",
      description: "Comprehensive middle school education preparing students for advanced studies with strong academic foundation.",
      features: [
        "STEM-focused curriculum",
        "Leadership development",
        "Community service projects"
      ]
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
          <path d="M22 10v6"/>
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>
        </svg>
      ),
      title: "University Preparation",
      grade: "Grades 11-12 • Ages 17-18",
      description: "Advanced placement courses and university counseling to prepare students for top universities worldwide.",
      features: [
        "International curriculum options",
        "University application support",
        "Scholarship guidance"
      ]
    }
  ];

  return (
    <section className="programs-section" id="programs">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Academic Programs</div>
          <h2>Comprehensive Education for Every Stage</h2>
          <p className="section-description">
            From early childhood to university preparation, our programs are designed to nurture 
            intellectual curiosity and personal growth.
          </p>
        </div>

        <div className="programs-grid">
          {programs.map((program, index) => (
            <div key={index} className="program-card">
              <div className="program-icon">
                {program.icon}
              </div>
              <h3>{program.title}</h3>
              <div className="program-grade">{program.grade}</div>
              <p className="program-description">{program.description}</p>
              <ul className="program-features">
                {program.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;