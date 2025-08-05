# Task Completion Checklist

## When a Task is Completed, Always Do:

### 1. Code Quality Checks
- [ ] Run `npm run build` to check for TypeScript and ESLint errors
- [ ] Fix any linting errors (no `any` types, unused imports, unescaped HTML entities)
- [ ] Ensure all TypeScript errors are resolved
- [ ] Verify imports are correctly organized

### 2. Testing and Verification
- [ ] Test the functionality in development mode (`npm run dev`)
- [ ] Verify responsive design works on different screen sizes
- [ ] Check that all links and navigation work correctly
- [ ] Verify database operations work if applicable

### 3. Documentation Updates
- [ ] Update TODO.md - mark completed tasks as done
- [ ] Add any new tasks discovered during implementation to TODO.md
- [ ] Update CLAUDE.md if new features or configurations were added

### 4. Code Standards Compliance
- [ ] Follow the established naming conventions
- [ ] Ensure proper TypeScript typing (no `any` types)
- [ ] Use consistent code formatting
- [ ] Add proper error handling where needed

### 5. Deployment Readiness
- [ ] Ensure `npm run build` passes without errors
- [ ] Check that environment variables are properly configured
- [ ] Verify Supabase database schema is up to date if changes were made

## Critical Reminders
- **NEVER commit code that doesn't pass `npm run build`**
- **ALWAYS use Serena MCP for file operations**
- **ALWAYS check TODO.md before and after tasks**
- **NO explanations or summaries in chat responses** (per coding guidelines)

## Common Issues to Watch For
- TypeScript `any` types (use `unknown` or specific types)
- Unescaped HTML entities in JSX (use `&apos;`, `&quot;`)
- Unused imports or variables
- Missing error handling in async operations
- Incorrect Tailwind CSS v4 configuration