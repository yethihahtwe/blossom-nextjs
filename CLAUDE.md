## Instruction
- Always read TODO.md and check when a task is done
- Add every new task under TODO first then implement and check when done

## Project Overview
- Creating a public-facing website for a private school
- Initial requirements include posting regular activities, news, and announcements
- Platform: Next.js 15.3.5 with TypeScript
- Hosting: TBD (migrated from Namecheap Stellar Plus)
- Database: TBD (considering modern alternatives to MySQL)
- Development URL: localhost:3000

## Project Status
- ✅ Hero slider design and animations ready for Next.js integration
- ✅ Content structure defined (News, Activities, Announcements)
- ✅ Next.js project initialized with TypeScript and Tailwind CSS
- ✅ Basic component structure created (Header, Hero, News, Programs, About, Contact, Footer)
- 🔄 Next: Implement dynamic content management and integrate custom design

## Technical Details
- Framework: Next.js 15.3.5 with TypeScript and React 19
- Styling: Tailwind CSS 4.0 with custom CSS
- Database: TBD (considering Prisma with PostgreSQL or Supabase)
- Frontend: React components with TypeScript
- Admin panel: TBD (considering Sanity CMS or custom solution)
- Development: Next.js with Turbopack for fast development

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
- Types: TypeScript definitions for News, Activity, Announcement
- Public Assets: public/ directory for images, fonts, and static files
- API Routes: TBD (will be added for content management)

## Database Models
1. **News**: title, slug, content, featured_image, excerpt, published_at, status
2. **Activity**: title, slug, content, featured_image, excerpt, event_date, location, status
3. **Announcement**: title, slug, content, featured_image, excerpt, priority (normal/important/urgent), published_at, status
