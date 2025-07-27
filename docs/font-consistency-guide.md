# Font Consistency Guide for Admin Panel

## Overview
This guide provides comprehensive instructions for maintaining Montserrat font consistency across the admin panel and preventing future font-related issues.

## Core System

### 1. Font Configuration
The admin panel uses **Montserrat** as the primary font family, loaded via Next.js Google Fonts:

```typescript
// src/app/admin/font.ts
import { Montserrat } from 'next/font/google'

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-montserrat',
})
```

### 2. CSS Variables System
All typography is controlled through CSS custom properties in `src/styles/admin-theme.css`:

```css
:root {
  --admin-font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  --admin-font-weight-light: 300;
  --admin-font-weight-normal: 400;
  --admin-font-weight-medium: 500;
  --admin-font-weight-semibold: 600;
  --admin-font-weight-bold: 700;
  --admin-font-weight-extrabold: 800;
}
```

## Implementation Patterns

### 1. Component Wrapper Pattern
**Primary Method**: Wrap admin components with the `.admin-panel` class:

```tsx
// ✅ Correct - All child elements inherit Montserrat
<div className="admin-panel">
  <h1>Title</h1>
  <p>Content</p>
  <Button>Action</Button>
</div>
```

### 2. Data Attribute Pattern
**For Portal Components**: Use `data-admin-panel` attribute for components rendered in portals (modals, dropdowns, tooltips):

```tsx
// ✅ Correct - For Radix UI components
<PopoverContent data-admin-panel>
  <div>Content inherits Montserrat</div>
</PopoverContent>

<DialogContent data-admin-panel>
  <h2>Modal Title</h2>
  <p>Modal content</p>
</DialogContent>
```

### 3. Typography Utility Classes
Use admin-specific utility classes for consistent typography:

```tsx
// ✅ Font weights
<h1 className="admin-font-bold">Bold Heading</h1>
<p className="admin-font-medium">Medium Text</p>

// ✅ Font sizes
<h1 className="admin-text-3xl">Large Title</h1>
<p className="admin-text-base">Body Text</p>

// ✅ Line heights
<p className="admin-leading-relaxed">Relaxed paragraph</p>
```

## Component-Specific Guidelines

### 1. Tables and Data Display
```tsx
<div className="admin-panel">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="admin-font-semibold">Title</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="admin-font-normal">Content</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```

### 2. Forms and Inputs
```tsx
<div className="admin-panel">
  <form>
    <Label className="admin-font-medium">Field Label</Label>
    <Input placeholder="Enter text..." />
    <Button className="admin-font-semibold">Submit</Button>
  </form>
</div>
```

### 3. Modals and Dropdowns
```tsx
// For components rendered in portals
<PopoverContent data-admin-panel className="admin-panel">
  <div className="space-y-4">
    <h4 className="admin-font-medium admin-text-base">Filter Options</h4>
    <div className="space-y-2">
      <Checkbox id="option1" />
      <Label htmlFor="option1" className="admin-font-normal admin-text-sm">
        Option 1
      </Label>
    </div>
  </div>
</PopoverContent>
```

### 4. Calendar Components
```tsx
<PopoverContent data-admin-panel className="admin-panel">
  <Calendar
    mode="range"
    selected={dateRange}
    onSelect={setDateRange}
    className="admin-panel"
  />
</PopoverContent>
```

## Automated Font Enforcement

### 1. Global CSS Rules
The system includes aggressive CSS rules to enforce Montserrat across all admin components:

```css
/* Automatic inheritance for admin components */
.admin-panel,
.admin-panel *,
[data-admin-panel],
[data-admin-panel] * {
  font-family: var(--admin-font-family) !important;
}

/* Portal components */
[data-radix-popper-content-wrapper] *,
[data-radix-popover-content] *,
[data-slot] * {
  font-family: var(--admin-font-family) !important;
}
```

### 2. Component Library Overrides
Specific overrides for common UI libraries:

```css
/* React Day Picker */
.rdp, .rdp * {
  font-family: var(--admin-font-family) !important;
}

/* Shadcn/UI Components */
[data-slot], [data-slot] * {
  font-family: var(--admin-font-family) !important;
}
```

## Best Practices

### 1. New Component Checklist
When creating new admin components:

- [ ] Wrap with `.admin-panel` class
- [ ] Add `data-admin-panel` for portal components
- [ ] Use admin typography utility classes
- [ ] Test in both light and dark modes
- [ ] Verify font inheritance in all interactive states

### 2. Third-Party Component Integration
When integrating new UI libraries:

1. **Identify portal/wrapper elements**: Look for components that render outside the normal DOM tree
2. **Add CSS overrides**: Include specific selectors in `admin-theme.css`
3. **Use data attributes**: Apply `data-admin-panel` to wrapper components
4. **Test thoroughly**: Verify font consistency across all component states

### 3. Common Mistakes to Avoid

❌ **Don't do this:**
```tsx
// Missing admin-panel wrapper
<div>
  <Table>...</Table>
</div>

// No data attribute for portal component
<PopoverContent>
  <div>Content</div>
</PopoverContent>
```

✅ **Do this instead:**
```tsx
// Proper wrapper
<div className="admin-panel">
  <Table>...</Table>
</div>

// Portal component with data attribute
<PopoverContent data-admin-panel className="admin-panel">
  <div>Content</div>
</PopoverContent>
```

## Debugging Font Issues

### 1. Browser DevTools
1. Open DevTools → Elements
2. Select the problematic element
3. Check Computed styles for `font-family`
4. Verify inheritance chain

### 2. CSS Specificity
If fonts aren't applying:
1. Check for higher specificity rules
2. Add `!important` to admin CSS rules if needed
3. Verify CSS loading order

### 3. Common Solutions
- **Missing wrapper**: Add `.admin-panel` class
- **Portal components**: Add `data-admin-panel` attribute
- **Third-party overrides**: Add specific CSS selectors
- **Inheritance issues**: Use `!important` declarations

## Testing Checklist

### Visual Verification
- [ ] All text uses Montserrat font
- [ ] Font weights are consistent
- [ ] Interactive states maintain font
- [ ] Dropdowns and modals use Montserrat
- [ ] Calendar components use Montserrat
- [ ] Form elements use Montserrat

### Cross-Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

### Theme Testing
- [ ] Light mode consistency
- [ ] Dark mode consistency
- [ ] Theme transition maintains fonts

## Maintenance

### Regular Audits
1. **Monthly Review**: Check new components for font consistency
2. **CSS Updates**: Update overrides when adding new UI libraries
3. **Documentation**: Keep this guide updated with new patterns

### Performance Considerations
- Font loading uses `display: swap` for better UX
- All font weights are loaded to prevent FOUT (Flash of Unstyled Text)
- CSS uses efficient selectors to minimize performance impact

## Support and Troubleshooting

### Common Issues
1. **Fonts not loading**: Check Google Fonts connection
2. **Inheritance broken**: Verify CSS specificity
3. **Portal components**: Ensure `data-admin-panel` attribute

### Getting Help
- Review this guide first
- Check browser DevTools for CSS inheritance
- Test with minimal reproduction case
- Document specific component causing issues

---

**Last Updated**: 2025-01-26  
**Version**: 1.0  
**Maintainer**: Development Team