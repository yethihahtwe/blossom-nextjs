# Code Style and Conventions

## TypeScript Configuration
- Strict TypeScript enabled (`"strict": true`)
- Target: ES2017
- Module resolution: bundler
- Path alias `@/*` maps to `./src/*`

## ESLint Configuration
- Uses Next.js ESLint config (`next/core-web-vitals`, `next/typescript`)
- Strict linting rules enforced
- No `any` types allowed - use `unknown` or specific types
- Unused imports and variables are not allowed
- HTML entities must be properly escaped in JSX

## Naming Conventions
- **Files**: kebab-case for regular files, PascalCase for React components
- **Components**: PascalCase (e.g., `Header.tsx`, `NewsCard.tsx`)
- **Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

## Component Structure
- Use functional components with TypeScript
- Props interfaces defined above component
- Export default at the bottom
- Use React 19 features where appropriate

## Styling
- **Tailwind CSS 4.0**: Uses `@import "tailwindcss"` instead of `@tailwind` directives
- Configuration via `@theme` blocks in CSS files
- Custom colors defined in globals.css
- **NO tailwind.config.ts file** - conflicts with v4

## Database Access
- All database operations through Supabase client
- Type-safe queries with TypeScript interfaces
- Row Level Security (RLS) enabled
- Functions in `src/lib/` directory (e.g., `news.ts`, `announcements.ts`)

## Error Handling
- Always handle errors in async operations
- Use try-catch blocks in API routes
- Provide meaningful error messages
- Log errors to console in development

## Import Organization
- Third-party imports first
- Internal imports grouped by type (@/components, @/lib, @/types)
- Relative imports last