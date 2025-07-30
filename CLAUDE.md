## Instruction
- Always read TODO.md and check when a task is done
- Add every new task under TODO first then implement and check when done

## Project Overview
- Creating a public-facing website for a private school
- Initial requirements include posting regular news and announcements
- Platform: Next.js 15.3.5 with TypeScript
- Hosting: TBD (migrated from Namecheap Stellar Plus)
- Database: TBD (considering modern alternatives to MySQL)
- Development URL: localhost:3000

## Project Status
- ✅ Hero slider design and animations ready for Next.js integration
- ✅ Content structure defined (News, Announcements)
- ✅ Next.js project initialized with TypeScript and Tailwind CSS
- ✅ Basic component structure created (Header, Hero, News, Programs, About, Contact, Footer)
- 🔄 Next: Implement dynamic content management and integrate custom design

## Technical Details
- Framework: Next.js 15.3.5 with TypeScript and React 19
- Styling: Tailwind CSS 4.0 (early development version) with `@import "tailwindcss"` and `@theme` configuration
- Database: Supabase (PostgreSQL) with Row Level Security
- Frontend: React components with TypeScript
- Admin panel: TBD (considering Sanity CMS or custom solution)
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

## Design and Layout
- Inside ./references directory, web designs and png files have been added for website reference
- Hero section implemented as a slider with educational icons (Learn, Play, Skill, Award)
- Layout referenced from https://blossom.edu.mm, to be used as a base layout
- Specific design details follow web-design.jpg in the references directory
- Cambridge English Qualifications branding integrated
- TODO: Make logo_dark_mode and cambridge_dark_mode images bigger. Align them to make their top margins same level with the slider. logo_dark_mode should be rectangular. Refer to the web-design.jpg.

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

## Coding Guidelines
- Do not explain what you have done in the chat response
- Do not show a summary of solution in chat response
- Do not write summary for each chat response