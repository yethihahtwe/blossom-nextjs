# Blossom International School Website - Project Overview

## Purpose
This is a public-facing website for Blossom International School, a private school. The main requirements include:
- Posting regular news and announcements
- Providing information about the school's programs and services
- Contact forms and admissions information
- Admin panel for content management

## Tech Stack
- **Frontend**: Next.js 15.3.5 with React 19 and TypeScript
- **Styling**: Tailwind CSS 4.0 (early development version)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Rich Text Editor**: TipTap WYSIWYG editor
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Supabase Auth
- **Email**: Nodemailer integration
- **Icons**: Lucide React
- **Charts**: Recharts for analytics
- **ReCAPTCHA**: Google reCAPTCHA v3 integration

## Database Models
1. **News**: title, slug, content, featured_image, excerpt, published_at, status, view_count
2. **Announcements**: title, slug, content, featured_image, excerpt, priority (normal/high/urgent), published_at, status, view_count
3. **Users**: Admin user management
4. **Page Views**: Analytics tracking
5. **Notifications**: Admin notification system

## Key Features
- News and announcements system with WYSIWYG editing
- View tracking and analytics
- Admin panel with user management
- Contact forms with ReCAPTCHA protection
- SEO optimization with meta tags
- Responsive design following school branding
- Loading states and professional UX