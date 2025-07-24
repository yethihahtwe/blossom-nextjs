# Supabase Setup Guide for Blossom Private School

## 🚀 Quick Setup Steps

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a project name: `blossom-private-school`
4. Set a strong database password
5. Choose your region (closest to your users)

### 2. Get Your Project Credentials
1. Go to your project dashboard
2. Click on the **Settings** gear icon in the sidebar
3. Go to **API** section
4. Copy the following values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Project API Key** - `anon public` (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Set Up Environment Variables
1. Create a `.env.local` file in your project root:
```bash
# Copy .env.example to .env.local and fill in your values
cp .env.example .env.local
```

2. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create:
   - `news` table with sample data
   - `announcements` table with sample data
   - Indexes for performance
   - Row Level Security policies

### 5. Test the Setup
1. Start your development server:
```bash
npm run dev
```

2. Visit your site at `http://localhost:3000`
3. The news section should now load data from Supabase
4. Visit `/news` to see the full news page with Supabase data

## 📊 Database Tables

### News Table
- **id**: UUID (primary key)
- **title**: Article title
- **slug**: URL-friendly identifier
- **content**: Full article content
- **excerpt**: Short description
- **featured_image**: Image URL (optional)
- **category**: News category
- **author**: Author name (optional)
- **reading_time**: Estimated reading time in minutes
- **published_at**: Publication date
- **status**: 'draft' or 'published'

### Announcements Table
- **id**: UUID (primary key)
- **title**: Announcement title
- **slug**: URL-friendly identifier
- **content**: Full announcement content
- **excerpt**: Short description
- **featured_image**: Image URL (optional)
- **priority**: 'normal', 'important', or 'urgent'
- **published_at**: Publication date
- **status**: 'draft' or 'published'

## 🔐 Security Features

- **Row Level Security (RLS)** enabled
- Public read access to published content only
- Draft content is not accessible to public users
- Ready for admin authentication setup

## 📈 Next Steps

1. **Content Management**: Add admin authentication for content management
2. **Image Storage**: Set up Supabase Storage for image uploads
3. **Real-time Features**: Add real-time subscriptions for live updates
4. **Performance**: Add caching with SWR or React Query

## 🛠️ Available Functions

### News Functions (`src/lib/news.ts`)
- `getPublishedNews()` - Get all published news
- `getNewsCategories()` - Get unique categories
- `searchNews(query)` - Search news articles
- `getNewsByCategory(category)` - Filter by category
- `getNewsBySlug(slug)` - Get single article
- `getRecentNews(limit)` - Get recent news for homepage

### Announcements Functions (`src/lib/announcements.ts`)
- `getPublishedAnnouncements()` - Get all published announcements
- `getAnnouncementsByPriority(priority)` - Filter by priority
- `searchAnnouncements(query)` - Search announcements
- `getAnnouncementBySlug(slug)` - Get single announcement
- `getUrgentAnnouncements(limit)` - Get urgent announcements

## 🚀 Deployment to Vercel

Your Supabase setup is ready for Vercel deployment:

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy! 🎉

Your school website will now have a production-ready database that scales automatically with your content needs.