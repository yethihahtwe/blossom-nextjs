# Suggested Commands for Blossom NextJS Project

## Development Commands
- `npm run dev` - Start development server with Turbopack (runs on localhost:3000)
- `npm run build` - Build production version and run ESLint/TypeScript checks
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linting

## Important Notes
- **Always run `npm run build` after making changes** to ensure no TypeScript or ESLint errors
- The project uses strict TypeScript and ESLint configuration
- Build process will fail if there are any linting or type errors

## Database Commands
- Supabase database schema files are in the root directory:
  - `supabase-schema.sql` - Main database schema
  - `user-profiles-schema.sql` - User profile extensions
- Run these SQL files in Supabase SQL Editor to set up the database

## Development Workflow
1. Always check TODO.md for current tasks
2. Add new tasks to TODO.md before implementing
3. Use `npm run dev` for development
4. Run `npm run build` to verify no errors before committing
5. Use Serena MCP for all file operations and code analysis

## Git Commands (Linux)
- `git status` - Check current status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote repository

## System Commands (Linux)
- `ls` - List directory contents
- `cd <directory>` - Change directory
- `grep <pattern> <files>` - Search for patterns in files
- `find <directory> -name <pattern>` - Find files by name pattern