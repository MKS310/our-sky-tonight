# Claude Code Skills for "Our Sky Tonight"

This directory contains specialized skill definitions for maintaining and developing the "Our Sky Tonight" astronomy dashboard project.

## What Are Skills?

**Skills** are specialized agent definitions that help Claude Code focus on specific domains when working on the project. Each skill has:
- Clear responsibilities and scope
- Defined primary files it works with
- Common tasks and workflows
- Best practices and guidelines
- Checklists and resources

Think of skills as "expert roles" that Claude can adopt depending on the task at hand.

---

## Available Skills

### 1. [design-system.md](design-system.md)
**Focus**: Design, CSS, layout, typography, colors

**Use for**:
- Updating the terminal-inspired color palette
- Modifying fonts and typography
- Improving responsive layout
- Ensuring accessibility (contrast, focus states)
- Styling new components

**Primary files**: [dist/styles.css](../../dist/styles.css), [templates.js](../../templates.js)

---

### 2. [data-pipeline.md](data-pipeline.md)
**Focus**: APIs, RSS feeds, data fetching, parsing

**Use for**:
- Adding new RSS feeds
- Integrating weather or astronomy APIs
- Fixing API errors or timeouts
- Optimizing data fetching
- Handling fallback data

**Primary files**: [index.js](../../index.js), [sources.json](../../sources.json)

---

### 3. [content-writer.md](content-writer.md)
**Focus**: HTML templates, content structure, copy

**Use for**:
- Adding new content sections
- Reordering page content
- Updating static text and copy
- Improving semantic HTML
- Managing SEO metadata

**Primary files**: [templates.js](../../templates.js)

---

### 4. [deployment.md](deployment.md)
**Focus**: CI/CD, GitHub Actions, build process

**Use for**:
- Updating GitHub Actions workflow
- Changing build schedule
- Adding deployment steps
- Debugging build failures
- Managing secrets and environment variables

**Primary files**: [.github/workflows/build.yml](../../.github/workflows/build.yml), [package.json](../../package.json)

---

### 5. [feature-dev.md](feature-dev.md)
**Focus**: Cross-cutting feature development

**Use for**:
- Building features that span multiple areas
- Adding client-side JavaScript (future)
- Implementing PWA support
- Creating interactive components
- Making architectural decisions

**Primary files**: All files (cross-cutting)

---

### 6. [testing-qa.md](testing-qa.md)
**Focus**: Testing, validation, quality assurance

**Use for**:
- Testing responsive design
- Running accessibility audits
- Validating build process
- Cross-browser testing
- Checking for broken links or errors

**Tools**: Chrome DevTools, Lighthouse, WebAIM, browser testing

---

## How to Use Skills

### Invoking a Skill

When requesting work from Claude Code, specify which skill should be used:

**Examples**:
```
"Use the design-system skill to implement the terminal color palette"

"Use the data-pipeline skill to add an ISS tracking API"

"Use the content-writer skill to reorganize the page layout"

"Use the testing-qa skill to run an accessibility audit"
```

### When to Use Which Skill

**Design changes** → `design-system`
- Updating colors, fonts, spacing
- Responsive layout issues
- Visual styling

**Data/API work** → `data-pipeline`
- RSS feeds, weather APIs
- Data fetching and parsing
- Error handling

**Content/HTML** → `content-writer`
- HTML templates
- Page structure
- Static text and copy

**Build/Deploy** → `deployment`
- GitHub Actions
- Build scripts
- CI/CD pipeline

**New features** → `feature-dev`
- Features that touch multiple areas
- Architectural changes
- JavaScript interactivity

**Quality checks** → `testing-qa`
- Testing and validation
- Accessibility audits
- Bug verification

---

## Skill-Based Development Workflow

### Example: Adding a New Feature

**Feature**: Display ISS pass predictions for Neenah, WI

#### Step 1: Planning (feature-dev skill)
- Define requirements
- Identify affected systems (data + content + design)
- Design approach

#### Step 2: Data Integration (data-pipeline skill)
- Integrate Open-Notify ISS API
- Parse pass prediction data
- Handle API errors

#### Step 3: Template Creation (content-writer skill)
- Create HTML template for ISS passes
- Structure pass information clearly
- Add semantic markup

#### Step 4: Styling (design-system skill)
- Style ISS pass cards
- Ensure mobile responsiveness
- Add terminal-themed accents

#### Step 5: Testing (testing-qa skill)
- Test on mobile and desktop
- Verify API integration
- Run accessibility audit

#### Step 6: Deployment (deployment skill)
- Verify build succeeds
- Check GitHub Actions
- Monitor deployment

---

## Skill Interaction Patterns

### Pattern 1: Sequential Workflow
Use skills in sequence for complex changes:
1. `data-pipeline` → Add new data source
2. `content-writer` → Create template
3. `design-system` → Style component
4. `testing-qa` → Validate result

### Pattern 2: Focused Work
Use single skill for isolated changes:
- `design-system` → Update color palette
- `data-pipeline` → Fix RSS feed
- `content-writer` → Reorder sections

### Pattern 3: Iterative Refinement
Use skills iteratively to refine:
1. `content-writer` → Draft layout
2. `design-system` → Initial styling
3. `testing-qa` → Test and identify issues
4. `design-system` → Fix issues
5. `testing-qa` → Re-test

---

## Maintaining Skills

### When to Update Skills

Update skill documentation when:
- New patterns emerge
- File structure changes
- Best practices evolve
- Tools or APIs change
- Common issues are discovered

### How to Update Skills

1. Identify outdated information
2. Update relevant skill markdown file
3. Test updated guidance
4. Document changes in commit message

---

## Benefits of Skills-Based Development

### Focus & Clarity
- Clear scope for each task
- Reduced context switching
- Focused expertise

### Consistency
- Standardized patterns
- Best practices encoded
- Repeatable workflows

### Maintainability
- Clear responsibility boundaries
- Easy to onboard new contributors
- Self-documenting codebase

### Quality
- Task-specific checklists
- Domain-specific testing
- Reduced errors

---

## Quick Reference

### File → Skill Mapping

| File | Primary Skill | Secondary Skills |
|------|---------------|------------------|
| [dist/styles.css](../../dist/styles.css) | design-system | - |
| [templates.js](../../templates.js) | content-writer | design-system |
| [index.js](../../index.js) | data-pipeline | feature-dev |
| [sources.json](../../sources.json) | data-pipeline | - |
| [.github/workflows/build.yml](../../.github/workflows/build.yml) | deployment | - |
| [package.json](../../package.json) | deployment | - |

### Task → Skill Mapping

| Task | Skill |
|------|-------|
| Update color palette | design-system |
| Add RSS feed | data-pipeline |
| Reorganize page layout | content-writer |
| Fix build error | deployment |
| Add new feature | feature-dev |
| Test accessibility | testing-qa |
| Improve mobile design | design-system |
| Integrate new API | data-pipeline |
| Update static text | content-writer |
| Change build schedule | deployment |
| Add JavaScript interactivity | feature-dev |
| Cross-browser testing | testing-qa |

---

## Notes

- Skills are guidelines, not strict rules
- Some tasks span multiple skills (use feature-dev)
- Skills evolve as the project grows
- Document new patterns as you discover them
- Keep skills focused and actionable

---

## Resources

- **Main documentation**: [.claude/CLAUDE.md](../CLAUDE.md)
- **Project repository**: https://github.com/MKS310/our-sky-tonight
- **Live site**: GitHub Pages URL

---

## Contributing

When working on this project:
1. Choose appropriate skill for your task
2. Follow guidelines in skill documentation
3. Update skill docs if you discover new patterns
4. Run tests before pushing changes
5. Document architectural decisions in [CLAUDE.md](../CLAUDE.md)
