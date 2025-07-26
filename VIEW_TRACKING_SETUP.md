# View Tracking Implementation Guide

## 🚀 Overview
This implementation provides comprehensive view tracking for news articles and announcements, helping prevent Supabase auto-pause through natural database activity.

## 📋 Setup Instructions

### 1. Database Setup
Run the SQL migration in your Supabase SQL Editor:
```sql
-- File: database-migrations/add-view-tracking.sql
-- Copy and paste the entire contents into Supabase SQL Editor
```

This will:
- ✅ Add `view_count` columns to `news` and `announcements` tables
- ✅ Create `page_views` table for detailed analytics
- ✅ Set up RLS policies for security
- ✅ Create database functions and views
- ✅ Add necessary indexes for performance

### 2. Environment Variables
Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Implementation in Public Pages

#### For News Articles:
```tsx
import ViewTracker from '@/components/view-tracker'

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Add this component to track views */}
      <ViewTracker type="news" id={params.id} />
      
      {/* Your article content */}
      <article>
        {/* Article content here */}
      </article>
    </div>
  )
}
```

#### For Announcements:
```tsx
import ViewTracker from '@/components/view-tracker'

export default function AnnouncementPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Add this component to track views */}
      <ViewTracker type="announcement" id={params.id} />
      
      {/* Your announcement content */}
      <article>
        {/* Announcement content here */}
      </article>
    </div>
  )
}
```

## 🔧 API Endpoints

### POST /api/track-view
Tracks a view for content:
```typescript
fetch('/api/track-view', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'news', // or 'announcement'
    id: 'content-uuid'
  })
})
```

### GET /api/track-view
Health check endpoint to prevent auto-pause:
```typescript
fetch('/api/track-view') // Returns database health status
```

## 📊 Analytics Functions

### Get View Statistics:
```typescript
import { getViewStats } from '@/lib/analytics'

const stats = await getViewStats()
// Returns: totalViews, newsViews, announcementViews, etc.
```

### Get Top Content:
```typescript
import { getTopContent } from '@/lib/analytics'

const topContent = await getTopContent(10)
// Returns: Array of most viewed content
```

### Get Recent View Trends:
```typescript
import { getRecentViewTrends } from '@/lib/analytics'

const trends = await getRecentViewTrends()
// Returns: Daily view counts for last 7 days
```

## 🛡️ Security Features

- ✅ **RLS Policies**: Only published content can be viewed/tracked
- ✅ **Input Validation**: API validates content type and ID
- ✅ **Rate Limiting**: Built-in protection via Supabase
- ✅ **IP Tracking**: Anonymized IP logging for analytics
- ✅ **Error Handling**: Graceful failure without breaking UI

## 🔄 Auto-Pause Prevention

This system prevents Supabase auto-pause through:
1. **Visitor Activity**: Every page view creates database activity
2. **Admin Dashboard**: Regular data fetching keeps connection alive
3. **Search Functionality**: Database queries from admin searches
4. **Health Checks**: Optional automated pings via GET endpoint

## 📈 Benefits

### Immediate Benefits:
- ✅ **Real Analytics**: Actual view counts instead of mock data
- ✅ **Content Insights**: See which articles are most popular
- ✅ **Database Activity**: Natural prevention of auto-pause
- ✅ **Performance Tracking**: Monitor content engagement

### Future Enhancements:
- 📊 Advanced analytics dashboard
- 🎯 Content recommendation engine
- 📱 Mobile app analytics integration
- 🌍 Geographic view tracking

## 🔍 Monitoring

### Check Database Activity:
```sql
-- View recent page views
SELECT * FROM page_views 
ORDER BY viewed_at DESC 
LIMIT 10;

-- Check total views per content type
SELECT content_type, COUNT(*) as total_views
FROM page_views 
GROUP BY content_type;
```

### Monitor API Health:
```bash
curl https://yourdomain.com/api/track-view
# Should return: {"status":"healthy","timestamp":"..."}
```

## 🚨 Troubleshooting

### Common Issues:

1. **Views not tracking**: Check browser console for API errors
2. **Database errors**: Verify RLS policies are correctly applied
3. **Missing permissions**: Ensure anon role has proper grants

### Debug Steps:
1. Test API endpoint directly with curl/Postman
2. Check Supabase logs for RLS policy violations
3. Verify content ID exists and is published
4. Monitor network tab for failed requests

## 📝 Maintenance

### Regular Tasks:
- Monitor view tracking performance
- Clean old page_views data if needed
- Review top content analytics
- Check database health status

### Optional Cleanup (run monthly):
```sql
-- Remove page views older than 90 days
DELETE FROM page_views 
WHERE viewed_at < NOW() - INTERVAL '90 days';
```

This implementation provides a robust, scalable view tracking system that serves dual purposes: valuable analytics and automatic database activity to prevent Supabase pausing.