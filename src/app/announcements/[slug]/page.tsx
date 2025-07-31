import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { announcementsService } from '@/lib/services/announcements.service';
import { DateFormatter } from '@/lib/utils/date-formatter';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await announcementsService.getBySlug(slug);

  if (!announcement) {
    return {
      title: 'Announcement Not Found - Blossom International School',
    };
  }

  return {
    title: `${announcement.title} - Blossom International School`,
    description: announcement.excerpt,
    openGraph: {
      title: announcement.title,
      description: announcement.excerpt,
      images: announcement.featured_image ? [announcement.featured_image] : [],
      type: 'article',
      publishedTime: announcement.published_at || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: announcement.title,
      description: announcement.excerpt,
      images: announcement.featured_image ? [announcement.featured_image] : [],
    },
  };
}

export async function generateStaticParams() {
  const announcements = await announcementsService.getPublished();
  return announcements.map((announcement) => ({
    slug: announcement.slug,
  }));
}

export default async function AnnouncementPage({ params }: PageProps) {
  const { slug } = await params;
  const announcement = await announcementsService.getBySlug(slug);

  if (!announcement || announcement.status !== 'published') {
    notFound();
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { backgroundColor: '#dc2626', color: 'white' }; // Red
      case 'important':
        return { backgroundColor: '#faad13', color: 'white' }; // Golden yellow
      case 'normal':
      default:
        return { backgroundColor: '#16a34a', color: 'white' }; // Green
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'URGENT ANNOUNCEMENT';
      case 'important':
        return 'IMPORTANT ANNOUNCEMENT';
      case 'normal':
      default:
        return 'SCHOOL ANNOUNCEMENT';
    }
  };

  const allAnnouncements = await announcementsService.getPublished();
  const relatedAnnouncements = allAnnouncements
    .filter(item => item.id !== announcement.id && item.priority === announcement.priority)
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
                <Link href="/announcements" className="text-gray-500 hover:text-gray-700">
                  Announcements
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900 font-medium truncate">
                {announcement.title}
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
            {/* Priority Badge */}
            <div className="mb-4">
              <span 
                className="inline-block text-white text-sm font-semibold px-4 py-2 rounded-full"
                style={getPriorityStyle(announcement.priority)}
              >
                {getPriorityLabel(announcement.priority)}
              </span>
            </div>

            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {announcement.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4 mb-6">
              {announcement.published_at && (
                <time dateTime={announcement.published_at}>
                  {DateFormatter.formatDate(announcement.published_at)}
                </time>
              )}
            </div>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {announcement.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          {announcement.featured_image && (
            <div className="relative h-96 w-full">
              <Image
                src={announcement.featured_image}
                alt={announcement.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-red-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
            
          </div>
        </div>

        {/* Related Announcements */}
        {relatedAnnouncements.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedAnnouncements.map((item) => (
                <Link
                  key={item.id}
                  href={`/announcements/${item.slug}`}
                  className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {item.featured_image && (
                    <div className="relative h-32 w-full">
                      <Image
                        src={item.featured_image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2">
                      <span 
                        className="inline-block text-xs font-semibold px-2 py-1 rounded-full"
                        style={getPriorityStyle(item.priority)}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    {item.published_at && (
                      <time className="text-xs text-gray-500" dateTime={item.published_at}>
                        {DateFormatter.formatDate(item.published_at)}
                      </time>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Announcements */}
        <div className="mt-8 text-center">
          <Link
            href="/announcements"
            className="inline-flex items-center px-6 py-3 text-white rounded-lg transition-colors hover:opacity-90"
            style={{backgroundColor: '#791218'}}
          >
            ← Back to All Announcements
          </Link>
        </div>
      </article>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}