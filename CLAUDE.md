# TODO
[] 

## Project Overview
- Creating a public-facing website for a private school
- Platform: Next.js 15.3.5 with TypeScript
- Development URL: localhost:3000 (or localhost:3001 if port 3000 is in use)

## Technical Details
- Framework: Next.js 15.3.5 with TypeScript and React 19
- Styling: Tailwind CSS 4.0 (early development version) with `@import "tailwindcss"` and `@theme` configuration
- Database: Supabase (PostgreSQL) with Row Level Security
- Frontend: React components with TypeScript
- Development: Next.js with Turbopack for fast development

## Tailwind CSS v4 Configuration
- Uses `@import "tailwindcss"` instead of traditional `@tailwind` directives
- Configuration done via `@theme` blocks in CSS files
- PostCSS plugin: `@tailwindcss/postcss` 
- No traditional `tailwind.config.ts` file needed
- Custom colors defined in globals.css `@theme` block
- IMPORTANT: Do not create tailwind.config.ts as it conflicts with v4

## Supabase Database Configuration
- Database: PostgreSQL hosted on Supabase
- Client library: @supabase/supabase-js v2.52.0
- Configuration file: src/lib/supabase.ts
- Environment variables needed:
  - NEXT_PUBLIC_SUPABASE_URL (project URL)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY (anonymous key)
- Tables: news, announcements
- Features: Row Level Security (RLS) enabled for public read access
- Data access functions: src/lib/news.ts, src/lib/announcements.ts
- Schema file: supabase-schema.sql (run in Supabase SQL Editor)

## Color Palette
- Primary color: #791218 (School red)
- Secondary colors: #faad13 (Golden yellow), #8a419a (Purple)
- Text colors: #333333 (Dark), #ffffff (Light)
- Background: #f8f9fa (Light gray)

## Next.js Project Structure
- Components: Header, HeroSection, NewsSection, ProgramsSection, AboutSection, ContactSection, Footer, ScrollToTop
- Pages: app/page.tsx (main page), app/layout.tsx (root layout)
- Styles: src/styles/style.css, app/globals.css, Tailwind CSS
- Types: TypeScript definitions for News, Announcement
- Public Assets: public/ directory for images, fonts, and static files
- API Routes: TBD (will be added for content management)

## Database Models
1. **News**: title, slug, content, featured_image, excerpt, published_at, status
2. **Announcement**: title, slug, content, featured_image, excerpt, priority (normal/important/urgent), published_at, status

## WYSIWYG Editor Implementation
- ✅ TipTap WYSIWYG editor integrated for news content editing
- ✅ Rich text formatting (bold, italic, headings, lists, links, images, alignment)
- ✅ Database persistence fixed - updateNews function implemented in src/lib/news.ts
- ✅ Frontend rendering with dangerouslySetInnerHTML and Tailwind prose classes
- ✅ @tailwindcss/typography plugin installed and configured
- ✅ Enhanced prose styles in globals.css for proper rich text display

## Loading States and UX Improvements
- ✅ Shimmer loading effects added to frontend news page (src/app/news/page.tsx)  
- ✅ Navigation loading pages created:
  - src/app/news/loading.tsx (news page loading)
  - src/app/news/[slug]/loading.tsx (individual article loading)
- ✅ Skeleton components with proper structure matching actual content
- ✅ Professional loading experience during page navigation

## Navigation Menu Enhancements
- ✅ Fixed navigation menu highlighting for visited pages
- ✅ Active state detection for both page routes and anchor links
- ✅ Scroll-based active section detection for anchor links (#about, #programs, #contact)
- ✅ Proper active class styling for all navigation items
- ✅ Loading spinner indicators for page transitions
- ✅ Mobile menu auto-close on navigation

## Coding Guidelines
- Do not explain what you have done in the chat response
- Do not show a summary of solution in chat response
- Do not write summary for each chat response
