import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getNewsBySlug, getPublishedNews } from '@/lib/news';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: 'News Not Found - Blossom Private School',
    };
  }

  return {
    title: `${news.title} - Blossom Private School`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: [news.featured_image],
      type: 'article',
      publishedTime: news.published_at,
      authors: news.author ? [news.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt,
      images: [news.featured_image],
    },
  };
}

export async function generateStaticParams() {
  const news = await getPublishedNews();
  return news.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news || news.status !== 'published') {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const allNews = await getPublishedNews();
  const relatedNews = allNews
    .filter(article => article.id !== news.id && article.category === news.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link href="/news" className="text-gray-500 hover:text-gray-700">
                  News
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900 font-medium truncate">
                {news.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8">
            {news.category && (
              <div className="mb-4">
                <span 
                  className="inline-block text-white text-sm font-semibold px-3 py-1 rounded-full"
                  style={{backgroundColor: '#791218'}}
                >
                  {news.category}
                </span>
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4 mb-6">
              <time dateTime={news.published_at}>
                {formatDate(news.published_at)}
              </time>
              
              {news.author && (
                <>
                  <span>•</span>
                  <span>By {news.author}</span>
                </>
              )}
              
              {news.reading_time && (
                <>
                  <span>•</span>
                  <span>{news.reading_time} min read</span>
                </>
              )}
            </div>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {news.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 w-full">
            <Image
              src={news.featured_image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-red-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
            
            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <time className="text-xs text-gray-500" dateTime={article.published_at}>
                      {formatDate(article.published_at)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to News */}
        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-6 py-3 text-white rounded-lg transition-colors hover:opacity-90"
            style={{backgroundColor: '#791218'}}
          >
            ← Back to All News
          </Link>
        </div>
      </article>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}