# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Our Sky Tonight

A static site that aggregates astronomical data, RSS feeds, and viewing conditions for the night sky in Neenah, WI. Built as a simple, fun resource for astronomy enthusiasts who love sunsets and weather.

## Project Context

You are a web developer building this app for a friend who loves astronomy. The goal is to create a terminal-inspired, mobile-first astronomy dashboard with a simple, fun front end and an astro-inspired palette that pulls weather, astronomical data, RSS feeds, and viewing conditions from RSS feeds via GitHub Actions and presents them alongside static links and pictures. 

---

## Architecture

This is a **static site generator** deployed via GitHub Pages:

**Data Flow:**
```
RSS Sources (sources.json)
  → RSS Parser (rss-parser)
  → Weather API (NOAA NWS)
  → Astronomy APIs (NASA, etc.)
  → HTML Generator (index.js)
  → HTML Template (templates.js)
  → Static Output (dist/index.html)
  → GitHub Pages
```

**Key Characteristics:**
- Minimal dependencies (only `rss-parser`)
- No build tools, bundlers, or frameworks
- Pure Node.js with simple string templating
- Automated via GitHub Actions
- Progressive enhancement for interactivity

---

## Common Commands

```bash
# Install dependencies
npm ci --omit=dev

# Build the site (fetches RSS feeds and generates HTML)
npm run build

# Output: dist/index.html
```

---

## Key Files

| File | Purpose |
|------|---------|
| [index.js](index.js) | Main build script - orchestrates RSS fetching, API calls, and HTML generation |
| [templates.js](templates.js) | HTML template functions for page sections |
| [sources.json](sources.json) | Configuration of RSS feeds to display |
| [dist/styles.css](dist/styles.css) | Custom CSS stylesheet with terminal-inspired design system |
| [.github/workflows/build.yml](.github/workflows/build.yml) | Automated build and deploy pipeline |
| [.claude/skills/](/.claude/skills/) | Claude Code skill definitions for maintainability |

---

## Design System

### Design Philosophy
**Terminal-Inspired Astronomy Dashboard**
- Modern terminal aesthetics (tmux/vim-inspired) blended with space themes
- High contrast for readability in dark observing conditions
- Mobile-first, dashboard-style information architecture
- Monospace fonts for data, clean sans-serif for navigation

### Color Palette (Terminal + Space Hybrid)

**Base Colors:**
```css
--terminal-bg-deep: #0a0e14;        /* Deep space black */
--terminal-bg: #151820;             /* Terminal background */
--terminal-bg-light: #1f2430;       /* Elevated surfaces */

--terminal-fg: #e6edf3;             /* Bright white text */
--terminal-fg-muted: #8b949e;       /* Muted gray text */
--terminal-fg-dim: #6e7681;         /* Dimmed text */
```

**Accent Colors (inspired by astronomy + terminal):**
```css
--accent-green: #3fb950;            /* Success, "online" indicators */
--accent-cyan: #58a6ff;             /* Links, interactive elements */
--accent-blue: #79c0ff;             /* Aurora/sky references */
--accent-yellow: #f0883e;           /* Warning, sun references */
--accent-magenta: #bc8cff;          /* Special events, highlights */
--accent-purple: #8b5cf6;           /* Nebula references */
--accent-star: #ffd700;             /* Star/moon highlights */
```

### Typography
- **Data/Code**: `'SF Mono', 'Cascadia Code', 'Fira Code', monospace`
- **Headings**: `system-ui, -apple-system, 'Segoe UI', sans-serif`
- **Body**: `system-ui` (clean, readable)

### Mobile-First Principles
1. **Critical data above the fold**: Weather NOW, sunset/sunrise TODAY, moon phase
2. **Card-based layout**: Each data point in scannable cards
3. **Touch-friendly**: Minimum 44px tap targets
4. **Progressive disclosure**: Collapse less critical sections
5. **Performance**: Optimize images, lazy-load content

---

## Content Organization

### Information Hierarchy (Priority Order)

**1. Hero Dashboard (Above the Fold - Mobile)**
- Current weather conditions with icon
- Sunrise/sunset times (with countdown)
- Moon phase & moonrise/moonset
- Aurora activity status

**2. Tonight's Sky (Second Priority)**
- Clear sky chart (viewing conditions)
- Visible planets tonight
- Special events (meteor showers, ISS passes)
- Weather forecast (4-period widget)

**3. Extended Information (Below Fold)**
- Photo gallery (horizontal scroll)
- Astronomy Picture of the Day (APOD)
- News RSS feeds (collapsible sections)
- Horoscopes (entertainment)

**4. Footer**
- Last updated timestamp
- Attribution
- GitHub link

---

## Data Sources & APIs

### Current Integrations
1. **Weather**: NOAA National Weather Service API (`api.weather.gov`)
2. **Quotes**: ZenQuotes API (`zenquotes.io`)
3. **APOD**: NASA Astronomy Picture of the Day (`api.nasa.gov`)
4. **Aurora**: NOAA Space Weather images (`services.swpc.noaa.gov`)
5. **RSS Feeds**: Configured in [sources.json](sources.json)

### RSS Feed Configuration

Edit [sources.json](sources.json) to add/modify RSS feeds:

```json
{
  "sections": [
    {
      "title": "Section Name",
      "items": [
        { "title": "Feed Title", "url": "https://example.com/rss" }
      ]
    }
  ]
}
```

Each section can contain multiple feed items. The build script fetches all feeds in parallel and displays the top 10 items from each.

### Data Source Discovery Guidelines

When researching new data sources, consider:

**Categories to Explore**:
1. **Core Astronomy**: RSS feeds, astronomy news, space agency updates
2. **Observing Conditions**: Weather, aurora alerts, light pollution data
3. **Sky Events**: Meteor showers, eclipses, planet visibility, conjunctions
4. **Educational**: Astronomy facts, constellation guides, space history
5. **Fun Stuff**: Astronomy jokes, space trivia, word of the day, daily quotes
6. **Community**: Astrophotography feeds, astronomy clubs, observing reports

**Evaluation Criteria**:
- ✅ **Reliable**: Stable API/RSS, good uptime
- ✅ **Build-time friendly**: Works with static generation (no real-time required)
- ✅ **Free or low-cost**: No expensive API keys
- ✅ **No rate limits**: Or generous limits for daily builds
- ✅ **Quality content**: Accurate, well-formatted, valuable
- ✅ **Not overwhelming**: Fits dashboard without clutter
- ✅ **Non-redundant**: Doesn't duplicate existing data

**Content Balance**:
- **Core Info** (60%): Weather, sun/moon, observing conditions, sky events
- **News & Education** (30%): RSS feeds, astronomy articles, learning content
- **Fun & Entertainment** (10%): Jokes, quotes, trivia, horoscopes

### Potential Future Integrations
- **ISS Tracking**: Pass predictions for Neenah, WI (http://api.open-notify.org/)
- **Meteor Showers**: Upcoming shower calendar with peak dates/times
- **Planet Visibility**: Calculate which planets are visible tonight
- **Astronomy Calendar**: Monthly sky events and phenomena
- **Space Weather**: Solar flares, geomagnetic storms (beyond aurora)
- **Satellite Tracking**: Starlink trains, Hubble passes
- **Light Pollution Map**: Local conditions and dark sky locations
- **Astronomy Jokes API**: Daily space humor
- **Space Word of the Day**: Astronomy vocabulary builder
- **This Day in Space History**: Notable events on this date

---

## GitHub Actions Workflow

[.github/workflows/build.yml](.github/workflows/build.yml) automatically:

**Triggers:**
- On push to `main` branch
- Scheduled at 7 AM UTC on weekdays (Mon-Fri)

**Build Steps:**
1. Installs dependencies (`npm ci`)
2. Runs `npm run build` to fetch RSS feeds, call APIs, and generate HTML
3. Deploys `dist/` folder to `gh-pages` branch
4. Sends notification to Mastodon API

---

## Claude Skills Framework

To ensure long-term maintainability, this project uses **Claude Code skills**—specialized agents for different development tasks.

### Available Skills

#### 1. `design-system`
**Purpose**: Manage design, CSS, layout, and visual styling

**Responsibilities:**
- Update color palette and CSS variables
- Modify typography and fonts
- Adjust layout grid and spacing
- Ensure responsive design and mobile optimization
- Maintain accessibility standards (WCAG)

**Primary Files**: [dist/styles.css](dist/styles.css), [templates.js](templates.js)

---

#### 2. `data-pipeline`
**Purpose**: Manage data sources, APIs, and RSS feeds

**Responsibilities:**
- Add/remove RSS feeds in [sources.json](sources.json)
- Integrate new data APIs (weather, astronomy, etc.)
- Handle API errors and fallback data
- Optimize data fetching logic
- Update data parsing in [index.js](index.js)

**Primary Files**: [index.js](index.js), [sources.json](sources.json)

---

#### 3. `content-writer`
**Purpose**: Manage HTML templates and content structure

**Responsibilities:**
- Update HTML templates in [templates.js](templates.js)
- Add/remove/reorder content sections
- Update static copy and messaging
- Manage SEO metadata and OpenGraph tags
- Ensure semantic HTML structure

**Primary Files**: [templates.js](templates.js)

---

#### 4. `deployment`
**Purpose**: Manage CI/CD, builds, and deployment

**Responsibilities:**
- Update GitHub Actions workflow
- Modify build scripts and npm commands
- Handle deployment issues
- Manage environment variables and secrets
- Monitor build performance

**Primary Files**: [.github/workflows/build.yml](.github/workflows/build.yml), [package.json](package.json)

---

#### 5. `feature-dev`
**Purpose**: Cross-cutting feature development

**Responsibilities:**
- Implement new features (PWA, interactivity, storage)
- Add client-side JavaScript for dynamic behavior
- Integrate multiple systems (design + data + content)
- Refactor architecture when needed
- Document new features

**Primary Files**: All files (cross-cutting)

---

#### 6. `testing-qa`
**Purpose**: Quality assurance, testing, and validation

**Responsibilities:**
- Test responsive design at breakpoints (mobile, tablet, desktop)
- Validate RSS feed parsing and API integrations
- Check accessibility compliance (keyboard nav, screen readers)
- Verify build process and error handling
- Test error scenarios and fallbacks

**Tools**: Manual testing, browser dev tools, accessibility checkers

---

### How to Use Skills

When requesting work, specify the skill to invoke:

**Examples:**
- "Use `design-system` skill to implement the terminal color palette"
- "Use `data-pipeline` skill to add ISS tracking API"
- "Use `feature-dev` skill to add PWA support"

Skills help Claude focus on specific domains and maintain consistent patterns across the codebase.

---

## Development Roadmap

### Phase 1: Design Overhaul ✅ (Planned)
- [ ] Implement terminal-inspired color palette
- [ ] Switch to monospace fonts for data
- [ ] Redesign mobile-first dashboard layout
- [ ] Optimize for high contrast readability
- [ ] Add terminal-style borders and accents

### Phase 2: Content Reorganization (Planned)
- [ ] Restructure information hierarchy (weather/sun/moon first)
- [ ] Create compact dashboard cards for critical data
- [ ] Make RSS feeds collapsible/expandable
- [ ] Add "Above the Fold" hero section for mobile

### Phase 3: Data Source Discovery & Enhancement (Planned)
- [ ] Research and evaluate new astronomy RSS feeds
- [ ] Discover interesting astronomy widgets and embeds
- [ ] Find complementary APIs (meteor showers, planet visibility, etc.)
- [ ] Add "fun stuff" data sources (joke of the day, word of the day, fun facts)
- [ ] Evaluate educational astronomy content sources
- [ ] Test all new data sources for reliability and build-time performance
- [ ] Document new sources in sources.json and data-pipeline skill

### Phase 4: Feature Enhancements (Future)
- [ ] Integrate ISS pass predictions (static build-time data)
- [ ] Add meteor shower calendar (upcoming events)
- [ ] Implement dark/light mode toggle with local storage
- [ ] Progressive Web App (PWA) support (installable, offline-capable)
- [ ] Add client-side preferences (collapsed sections, favorite feeds)
- [ ] Create "Fun Stuff" section (jokes, words, facts, horoscopes)

### Phase 5: Performance & Polish (Future)
- [ ] Lazy-load images in gallery
- [ ] Optimize API calls and caching strategies
- [ ] Improve error handling and fallbacks for all APIs
- [ ] Comprehensive accessibility audit and improvements
- [ ] Add build-time data validation
- [ ] Optimize image sizes and formats (WebP)

---

## Development Philosophy

- **Keep it simple**: No complex build tools or frameworks
- **Minimal dependencies**: Only what's absolutely necessary
- **Terminal aesthetics**: High contrast, monospace, clean lines
- **Mobile-first**: Design for small screens, enhance for desktop
- **Static output**: Fast, reliable, easy to host
- **Progressive enhancement**: Start with HTML, layer interactivity
- **Skills-based maintenance**: Use Claude skills for focused development

---

## Notes for Claude Code

When working on this project:

1. **Always read files before editing**: Understand context before making changes
2. **Use appropriate skill**: Invoke the right skill for the task at hand
3. **Test responsive design**: Check mobile, tablet, and desktop breakpoints
4. **Preserve simplicity**: Don't over-engineer or add unnecessary complexity
5. **Maintain terminal aesthetic**: Keep the design system consistent
6. **Document decisions**: Update this file when making architectural changes
7. **Error handling**: Always provide fallbacks for API failures
8. **Accessibility**: Ensure keyboard navigation and screen reader support
