import Image from 'next/image';

const NewsSection = () => {
  const news = [
    {
      image: '/science-fair.jpg',
      date: 'December 15, 2024',
      title: 'Students Win National Science Fair',
      description: 'Our Grade 10 students secured first place in the Myanmar National Science Fair with their innovative water purification project.'
    },
    {
      image: '/digital-library.jpg',
      date: 'December 10, 2024',
      title: 'New Digital Library Opens',
      description: 'State-of-the-art digital library with over 10,000 books and modern study spaces now open for all students.'
    },
    {
      image: '/cultural-festival.png',
      date: 'December 5, 2024',
      title: 'Annual Cultural Festival Success',
      description: 'Students showcased Myanmar&apos;s rich cultural heritage through traditional dances, music, and art exhibitions.'
    }
  ];

  return (
    <section className="news-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Latest News</div>
          <h2>School Updates & Achievements</h2>
        </div>

        <div className="news-grid">
          {news.map((item, index) => (
            <article key={index} className="news-card">
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={200}
                className="news-image"
              />
              <div className="news-content">
                <div className="news-date">
                  {item.date}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;