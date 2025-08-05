# Project Structure

## Root Directory
```
/
├── src/                    # Source code
├── public/                 # Static assets
├── docs/                   # Documentation
├── database-migrations/    # Database migration files
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── postcss.config.mjs     # PostCSS configuration
├── components.json        # shadcn/ui component configuration
├── CLAUDE.md              # Project instructions
├── TODO.md                # Task management
├── README.md              # Basic project info
├── supabase-schema.sql    # Database schema
└── user-profiles-schema.sql # User profiles schema
```

## Source Directory Structure
```
src/
├── app/                   # Next.js App Router pages
│   ├── admin/            # Admin panel pages
│   ├── api/              # API routes
│   ├── news/             # News pages
│   ├── announcements/    # Announcement pages
│   ├── admissions/       # Admissions page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── admin/           # Admin-specific components
│   └── [various].tsx    # Page-specific components
├── lib/                 # Utility functions and services
│   ├── types/           # TypeScript type definitions
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── hooks/               # Custom React hooks
├── data/                # Static data and mocks
├── styles/              # Additional stylesheets
└── types/               # Global TypeScript types
```

## Key Files
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/news.ts` - News data access functions
- `src/lib/announcements.ts` - Announcements data access functions
- `src/app/globals.css` - Global styles with Tailwind CSS v4 configuration
- `src/components/Header.tsx` - Main navigation header
- `src/components/Footer.tsx` - Site footer