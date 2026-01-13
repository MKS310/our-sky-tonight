# Design System Skill

## Purpose
Manage all design-related changes including colors, typography, layout, CSS, and visual styling for "Our Sky Tonight".

## Scope
This skill focuses on the visual presentation layer of the application, ensuring a terminal-inspired, high-contrast, mobile-first design system that maintains consistency across all components.

---

## Responsibilities

### Color Palette Management
- Update CSS color variables in [dist/styles.css](../dist/styles.css)
- Maintain terminal-inspired color scheme (see CLAUDE.md for palette)
- Ensure WCAG AA contrast ratios for accessibility
- Test colors in dark environments (primary use case: stargazing)

### Typography
- Manage font families and sizes
- Use monospace fonts for data/code elements
- Use system fonts for headings and body text
- Ensure readability on mobile devices

### Layout & Spacing
- Implement and maintain responsive grid system
- Manage spacing variables (margins, padding)
- Create card-based layouts for dashboard components
- Ensure mobile-first responsive design

### Component Styling
- Style individual UI components (cards, buttons, links)
- Add terminal-style borders and accents
- Create hover/focus states for interactive elements
- Maintain visual hierarchy

### Accessibility
- Ensure keyboard navigation styles (focus indicators)
- Maintain sufficient color contrast
- Support screen reader compatibility (via CSS)
- Test with browser accessibility tools

---

## Primary Files

### Main Stylesheet
- [dist/styles.css](../dist/styles.css) - All CSS styles and variables

### Template Files (for HTML structure affecting styles)
- [templates.js](../templates.js) - HTML templates that use CSS classes

---

## Key Design Patterns

### Terminal Aesthetic
The design should evoke modern terminal emulators (tmux, vim) with:
- Deep black backgrounds
- Bright white/cyan text
- Accent colors for different data types
- Monospace fonts for data display
- Clean lines and borders

### Mobile-First Approach
Design for small screens first, then enhance for larger screens:
```css
/* Mobile default */
.component { /* styles */ }

/* Tablet and up */
@media (min-width: 768px) { /* enhancements */ }

/* Desktop */
@media (min-width: 1200px) { /* further enhancements */ }
```

### Card-Based Layout
Information should be grouped into scannable cards:
- Clear visual boundaries
- Consistent padding/spacing
- Background color differentiation
- Shadow/border effects

---

## Color Palette Reference

### Base Colors (Terminal)
```css
--terminal-bg-deep: #0a0e14;     /* Deep space black */
--terminal-bg: #151820;          /* Terminal background */
--terminal-bg-light: #1f2430;    /* Elevated surfaces (cards) */

--terminal-fg: #e6edf3;          /* Primary text */
--terminal-fg-muted: #8b949e;    /* Secondary text */
--terminal-fg-dim: #6e7681;      /* Tertiary text */
```

### Accent Colors (Astronomy-Inspired)
```css
--accent-green: #3fb950;         /* Success states */
--accent-cyan: #58a6ff;          /* Links, interactive */
--accent-blue: #79c0ff;          /* Sky/aurora references */
--accent-yellow: #f0883e;        /* Sun/warnings */
--accent-magenta: #bc8cff;       /* Special events */
--accent-purple: #8b5cf6;        /* Nebula references */
--accent-star: #ffd700;          /* Stars/moon */
```

---

## Common Tasks

### Task: Update Color Palette
1. Read [dist/styles.css](../dist/styles.css)
2. Update `:root` CSS variables
3. Test contrast ratios with WebAIM Contrast Checker
4. Build site and verify visually
5. Check mobile and desktop views

### Task: Improve Mobile Layout
1. Read current [dist/styles.css](../dist/styles.css)
2. Identify layout issues on small screens
3. Add/update media queries
4. Test at breakpoints: 320px, 375px, 768px, 1024px
5. Verify touch targets are minimum 44x44px

### Task: Add New Component Styles
1. Read [templates.js](../templates.js) to understand HTML structure
2. Add new CSS classes in [dist/styles.css](../dist/styles.css)
3. Follow existing naming conventions
4. Maintain terminal aesthetic consistency
5. Test responsiveness

### Task: Accessibility Audit
1. Check color contrast ratios (minimum 4.5:1 for text)
2. Ensure focus indicators are visible
3. Test keyboard navigation
4. Verify semantic HTML in templates
5. Run browser accessibility checker (Lighthouse)

---

## Design System Checklist

When making design changes, verify:

- [ ] Colors meet WCAG AA contrast requirements
- [ ] Design works on mobile (320px) and desktop (1920px)
- [ ] Touch targets are minimum 44x44px
- [ ] Monospace fonts used for data, system fonts for text
- [ ] Terminal aesthetic maintained (dark, high-contrast)
- [ ] Visual hierarchy is clear (important info stands out)
- [ ] Hover/focus states are defined for interactive elements
- [ ] CSS variables used for colors (not hardcoded hex values)
- [ ] Changes tested in both Chrome and Safari
- [ ] No layout shift or content reflow issues

---

## Resources

### Tools
- Chrome DevTools (Responsive Design Mode)
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Lighthouse Accessibility Audit (Chrome DevTools)

### Inspiration
- Modern terminal themes: Dracula, Nord, Tokyo Night
- GitHub's Primer design system (terminal aesthetic)
- Space/astronomy imagery for color inspiration

---

## Notes

- This is a static site with no JavaScript for styling (pure CSS)
- Styles should be progressively enhanced (mobile first)
- Performance matters: minimize CSS file size
- Maintain simplicity: avoid over-engineering
- Design for dark observing environments (stargazers)
