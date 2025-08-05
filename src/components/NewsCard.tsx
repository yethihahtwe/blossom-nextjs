import Image from 'next/image';
import Link from 'next/link';
import { type News } from '@/lib/supabase';

interface NewsCardProps {
  news: News;
  showExcerpt?: boolean;
  showCategory?: boolean;
}

export default function NewsCard({ news, showExcerpt = true, showCategory = true }: NewsCardProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };;

  return (
    <article className="news-card">
      <Link href={`/news/${news.slug}`} className="block">
        {news.featured_image && (
          <Image
            src={news.featured_image}
            alt={news.title}
            width={400}
            height={200}
            className="news-image"
          />
        )}
        
        <div className="news-content">
          <div className="news-date">
            {formatDate(news.published_at)}
          </div>
          <h3>{news.title}</h3>
          {showExcerpt && (
            <p>{news.excerpt}</p>
          )}
          {showCategory && news.category && (
            <div className="mt-2">
              <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{backgroundColor: '#791218', color: 'white'}}>
                {news.category}
              </span>
            </div>
          )}
          {news.reading_time && (
            <div className="mt-2 text-sm text-gray-500">
              {news.reading_time} min read
              {news.author && (
                <span> • By {news.author}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}