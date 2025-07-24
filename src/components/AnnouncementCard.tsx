import Image from 'next/image';
import Link from 'next/link';
import { Announcement } from '@/types/announcement';

interface AnnouncementCardProps {
  announcement: Announcement;
  showExcerpt?: boolean;
  showCategory?: boolean;
}

export default function AnnouncementCard({ announcement, showExcerpt = true, showCategory = true }: AnnouncementCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        return 'URGENT';
      case 'important':
        return 'IMPORTANT';
      case 'normal':
      default:
        return 'ANNOUNCEMENT';
    }
  };

  return (
    <article className="announcement-card-article">
      <Link href={`/announcements/${announcement.slug}`} className="block">
        <div className="announcement-image-container">
          {announcement.featured_image ? (
            <Image
              src={announcement.featured_image}
              alt={announcement.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>
        
        <div className="announcement-content-container">
          {/* Priority Badge */}
          <div className="mb-2">
            <span 
              className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={getPriorityStyle(announcement.priority)}
            >
              {getPriorityLabel(announcement.priority)}
            </span>
          </div>

          {showCategory && announcement.category && (
            <div className="mb-2">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {announcement.category}
              </span>
            </div>
          )}
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-red-700" style={{color: '#333333'}}>
            {announcement.title}
          </h3>
          
          {showExcerpt && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {announcement.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <div className="flex items-center space-x-2">
              <time dateTime={announcement.published_at}>
                {formatDate(announcement.published_at)}
              </time>
            </div>
            
            {announcement.author && (
              <span className="text-gray-600">By {announcement.author}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}