'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRecentNews } from '@/lib/news';
import { type News } from '@/lib/supabase';

const NewsSection = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const recentNews = await getRecentNews(3);
        setNews(recentNews);
      } catch (error) {
        console.error('Error loading recent news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };;

  return (
    <section className="news-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Latest News</div>
          <h2>School Updates & Achievements</h2>
        </div>

        <div className="news-grid">
          {loading ? (
            <div className="text-center py-8 col-span-full">
              <p className="text-gray-500">Loading latest news...</p>
            </div>
          ) : news.length > 0 ? (
            news.map((item) => (
              <article key={item.id} className="news-card">
                <Link href={`/news/${item.slug}`} className="block">
                  {item.featured_image && (
                    <Image
                      src={item.featured_image}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="news-image"
                    />
                  )}
                  <div className="news-content">
                    <div className="news-date">
                      {formatDate(item.published_at)}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="text-center py-8 col-span-full">
              <p className="text-gray-500">No recent news available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;