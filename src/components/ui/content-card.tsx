import Link from 'next/link'
import Image from 'next/image'
import { BaseContent } from '@/lib/types/content'
import { DateFormatter } from '@/lib/utils/date-formatter'

/**
 * Configuration for content formatters
 */
export interface ContentFormatters<T extends BaseContent> {
  getUrl: (item: T) => string
  getCategoryBadge?: (item: T) => React.ReactNode
  getPriorityBadge?: (item: T) => React.ReactNode
  getExtraInfo?: (item: T) => React.ReactNode
}

/**
 * Props for generic content card
 */
interface ContentCardProps<T extends BaseContent> {
  content: T
  showExcerpt?: boolean
  showCategory?: boolean
  showAuthor?: boolean
  formatters: ContentFormatters<T>
  className?: string
}

/**
 * Generic content card component that can display any content type
 */
export function ContentCard<T extends BaseContent>({
  content,
  showExcerpt = true,
  showCategory = false,
  showAuthor = false,
  formatters,
  className = ''
}: ContentCardProps<T>) {
  const hasAuthor = 'author' in content && showAuthor
  const hasReadingTime = 'reading_time' in content
  const url = formatters.getUrl(content)

  return (
    <article className={`news-card-article ${className}`}>
      {/* Featured Image */}
      {content.featured_image && (
        <Link href={url}>
          <div className="news-image-container">
            <Image
              src={content.featured_image}
              alt={content.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="news-content-container">
        {/* Date */}
        {content.published_at && (
          <time className="news-date">
            {DateFormatter.formatDate(content.published_at)}
          </time>
        )}

        {/* Title */}
        <Link href={url}>
          <h3 className="news-title">
            {content.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {showExcerpt && content.excerpt && (
          <p className="news-excerpt">
            {content.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="news-footer">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Badge */}
            {showCategory && formatters.getCategoryBadge && (
              formatters.getCategoryBadge(content)
            )}

            {/* Priority Badge */}
            {formatters.getPriorityBadge && (
              formatters.getPriorityBadge(content)
            )}

            {/* Extra Info (Author, Reading Time, etc.) */}
            {formatters.getExtraInfo && (
              formatters.getExtraInfo(content)
            )}
          </div>

          {/* Reading Time / Author */}
          {(hasAuthor || hasReadingTime) && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              {hasAuthor && (
                <span>By {(content as any).author}</span>
              )}
              {hasAuthor && hasReadingTime && <span>•</span>}
              {hasReadingTime && (
                <span>{(content as any).reading_time} min read</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * News-specific formatters
 */
export const newsFormatters: ContentFormatters<any> = {
  getUrl: (news) => `/news/${news.slug}`,
  getCategoryBadge: (news) => (
    <span className="news-category">
      {news.category}
    </span>
  ),
  getExtraInfo: (news) => {
    if (news.author && news.reading_time) {
      return (
        <div className="text-sm text-gray-500">
          <span>By {news.author}</span>
          <span className="mx-1">•</span>
          <span>{news.reading_time} min read</span>
        </div>
      )
    }
    return null
  }
}

/**
 * Announcement-specific formatters
 */
export const announcementFormatters: ContentFormatters<any> = {
  getUrl: (announcement) => `/announcements/${announcement.slug}`,
  getPriorityBadge: (announcement) => {
    const priorityStyles = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      important: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      normal: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyles[announcement.priority]}`}>
        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
      </span>
    )
  }
}