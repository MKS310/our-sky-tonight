# Feature Development Skill

## Purpose
Implement cross-cutting features that span multiple areas: design, data, content, and functionality.

## Scope
This skill focuses on building new features that don't fit neatly into a single domain, requiring coordination across design system, data pipeline, content templates, and potentially deployment.

---

## Responsibilities

### Feature Planning
- Break down features into implementation tasks
- Identify affected files and systems
- Plan integration points
- Consider mobile and desktop experiences

### Cross-System Integration
- Coordinate changes across multiple files
- Ensure design, data, and content work together
- Maintain consistency with existing patterns
- Test end-to-end functionality

### Client-Side Interactivity (Future)
- Add JavaScript for dynamic behavior
- Implement local storage for preferences
- Create interactive components
- Progressive enhancement approach

### Architecture Decisions
- Evaluate trade-offs between approaches
- Maintain simplicity and minimalism
- Avoid over-engineering
- Document architectural changes

---

## Primary Files

### All Files (Cross-Cutting)
- [index.js](../index.js) - Data and build logic
- [templates.js](../templates.js) - HTML structure
- [dist/styles.css](../dist/styles.css) - Styling
- [.github/workflows/build.yml](../.github/workflows/build.yml) - Deployment
- [sources.json](../sources.json) - Configuration

---

## Feature Development Process

### Phase 1: Planning
1. **Define requirements**: What does the feature do?
2. **Identify scope**: Which files/systems affected?
3. **Design approach**: How will it work?
4. **Consider mobile**: Mobile and desktop differences?
5. **Document plan**: Update CLAUDE.md if architectural change

### Phase 2: Implementation
1. **Data layer**: Update [index.js](../index.js) if new data needed
2. **Template layer**: Update [templates.js](../templates.js) for HTML
3. **Style layer**: Update [dist/styles.css](../dist/styles.css) for design
4. **Configuration**: Update [sources.json](../sources.json) or workflow if needed

### Phase 3: Testing
1. **Build test**: Run `npm run build` successfully
2. **Visual test**: Check desktop and mobile views
3. **Interaction test**: Test user interactions
4. **Edge cases**: Test error scenarios

### Phase 4: Documentation
1. **Update CLAUDE.md**: Document new patterns
2. **Update skills**: Update relevant skill docs
3. **Add comments**: Explain complex logic
4. **Create examples**: Show how to use feature

---

## Data Source Discovery Process

### Research Phase
When discovering new data sources for the dashboard:

1. **Web Search**: Look for astronomy APIs, RSS feeds, embeds
   - Search: "astronomy RSS feeds", "space weather API", "meteor shower API"
   - Search: "astronomy joke API", "space trivia API", "astronomy word of the day"
   - Check: NASA, ESA, space.com, astronomy.com, sky & telescope

2. **Evaluate Sources**: Check each source against criteria
   - Is it free/low-cost?
   - Does it have good documentation?
   - Is it reliable (uptime, maintenance)?
   - Does it support CORS or is it RSS?
   - What are the rate limits?

3. **Test Integration**: Try fetching data
   - Use `curl` or Postman to test API endpoints
   - Check RSS feed validity (feedvalidator.org)
   - Verify data format and quality
   - Test error handling

4. **Content Review**: Assess value
   - Is the content accurate and high-quality?
   - Does it fit the dashboard theme?
   - Is it redundant with existing data?
   - Will users find it useful/interesting?

### Data Source Categories

**Core Astronomy (Essential)**:
- Weather forecasts and current conditions
- Sunrise/sunset times
- Moon phases and rise/set times
- Aurora alerts and space weather
- Clear sky viewing conditions

**News & Updates (Informative)**:
- Space agency RSS feeds (NASA, ESA, SpaceX)
- Astronomy news sites (space.com, astronomy.com)
- Sky & Telescope, Astronomy Magazine
- Astrophotography communities
- Local astronomy club updates

**Sky Events (Timely)**:
- ISS pass predictions
- Meteor shower calendars
- Eclipses and transits
- Planet visibility and conjunctions
- Comet appearances
- Satellite tracking (Starlink, Hubble)

**Educational (Learning)**:
- Astronomy Picture of the Day (APOD)
- Constellation of the month
- Astronomy facts and trivia
- Space history ("this day in space")
- Beginner guides and tips

**Fun Stuff (Entertainment)**:
- Daily astronomy jokes
- Space-themed quotes
- Word of the day (astronomy terms)
- Silly horoscopes (for fun, not serious)
- Space trivia challenges
- Astronomy memes (if appropriate)

### Content Balance Guidelines

**60% Core Info**: The essentials
- Weather, sun/moon data, observing conditions
- These should always be visible and prioritized

**30% News & Education**: Keep learning
- RSS feeds, articles, educational content
- Can be collapsible on mobile for space

**10% Fun & Entertainment**: Add personality
- Jokes, quotes, trivia, horoscopes
- Group into a "Fun Stuff" section
- Keep it light and non-intrusive

### API Discovery Resources

**API Directories**:
- RapidAPI (rapidapi.com) - search "astronomy", "weather", "space"
- Public APIs (github.com/public-apis/public-apis) - astronomy section
- API List (apilist.fun) - space & weather categories

**RSS Feed Directories**:
- Feedly (feedly.com) - search for astronomy topics
- Feedspot (feedspot.com) - astronomy RSS feed lists
- NewsBlur (newsblur.com) - RSS aggregator with search

**Specific Sources to Explore**:
- Open-Notify API (open-notify.org) - ISS data
- AstronomyAPI (astronomyapi.com) - planet positions, moon phases
- 7Timer! (7timer.info) - astronomy weather forecasts
- Heavens Above (heavens-above.com) - satellite tracking
- Clear Dark Sky (cleardarksky.com) - observing conditions
- IMO Meteor Showers (imo.net) - meteor shower data
- JokeAPI (jokeapi.dev) - search for space/science jokes
- Quotable API (quotable.io) - inspirational quotes
- Words API (wordsapi.com) - word definitions

### Integration Checklist

Before adding a new data source:

- [ ] Source is free or low-cost
- [ ] No restrictive rate limits (can build daily)
- [ ] Works with static site generation (no real-time requirement)
- [ ] API/RSS is well-documented
- [ ] Data format is parseable
- [ ] Content is high-quality and accurate
- [ ] Fits dashboard theme (astronomy/space/science)
- [ ] Doesn't duplicate existing data
- [ ] Adds value without overwhelming
- [ ] Tested successfully with build script
- [ ] Error handling implemented
- [ ] Documented in CLAUDE.md

---

## Planned Features (Roadmap)

### Phase 1: Design Overhaul
**Status**: Planned

**Tasks**:
- [ ] Implement terminal-inspired color palette
- [ ] Switch to monospace fonts for data
- [ ] Redesign mobile-first dashboard layout
- [ ] Optimize for high contrast readability
- [ ] Add terminal-style borders and accents

**Files**: [dist/styles.css](../dist/styles.css), [templates.js](../templates.js)

---

### Phase 2: Content Reorganization
**Status**: Planned

**Tasks**:
- [ ] Restructure information hierarchy (weather/sun/moon first)
- [ ] Create compact dashboard cards for critical data
- [ ] Make RSS feeds collapsible/expandable
- [ ] Add "Above the Fold" hero section for mobile

**Files**: [templates.js](../templates.js)

---

### Phase 3: Data Source Discovery & Enhancement
**Status**: Planned

**Tasks**:
- [ ] Research and evaluate new astronomy RSS feeds
- [ ] Discover interesting astronomy widgets and embeds
- [ ] Find complementary APIs (meteor showers, planet visibility, etc.)
- [ ] Add "fun stuff" data sources (joke of the day, word of the day, fun facts)
- [ ] Evaluate educational astronomy content sources
- [ ] Test all new data sources for reliability and build-time performance
- [ ] Document new sources in sources.json and data-pipeline skill

**Files**: [sources.json](../sources.json), [index.js](../index.js), [templates.js](../templates.js)

**Process**: Use the Data Source Discovery Process documented above

---

### Phase 4: Feature Enhancements
**Status**: Future

**Tasks**:
- [ ] Integrate ISS pass predictions (static build-time data)
- [ ] Add meteor shower calendar (upcoming events)
- [ ] Implement dark/light mode toggle with local storage
- [ ] Progressive Web App (PWA) support (installable, offline-capable)
- [ ] Add client-side preferences (collapsed sections, favorite feeds)
- [ ] Create "Fun Stuff" section (jokes, words, facts, horoscopes)

**Files**: Multiple (cross-cutting)

---

### Phase 5: Performance & Polish
**Status**: Future

**Tasks**:
- [ ] Lazy-load images in gallery
- [ ] Optimize API calls and caching strategies
- [ ] Improve error handling and fallbacks for all APIs
- [ ] Comprehensive accessibility audit and improvements
- [ ] Add build-time data validation
- [ ] Optimize image sizes and formats (WebP)

**Files**: [index.js](../index.js), [templates.js](../templates.js), [dist/styles.css](../dist/styles.css)

---

## Feature Implementation Examples

### Example 1: Add New Data Source

**Goal**: Display meteor shower information

**Steps**:
1. **Data layer** ([index.js](../index.js)):
   ```javascript
   function fetchMeteorShowers() {
     return new Promise((resolve) => {
       https.get('API_URL', (res) => {
         // Parse meteor shower data
         resolve(showerData);
       }).on('error', (err) => {
         console.log('Error:', err);
         resolve([]);
       });
     });
   }

   promises.push(fetchMeteorShowers());
   ```

2. **Template layer** ([templates.js](../templates.js)):
   ```javascript
   function meteorShowerSection(showers) {
     return `<section class="row mb-4">
       <div class="col">
         <h2 class="h3">Meteor Showers</h2>
         ${showers.map(s => `
           <div class="info-box">
             <strong>${s.name}</strong>
             <p>Peak: ${s.peak}</p>
             <p>ZHR: ${s.zhr}</p>
           </div>
         `).join('')}
       </div>
     </section>`;
   }
   ```

3. **Style layer** ([dist/styles.css](../dist/styles.css)):
   ```css
   .meteor-info {
     border-left: 3px solid var(--accent-magenta);
     padding-left: 1rem;
   }
   ```

4. **Integration**: Add to `module.exports.document()` in [templates.js](../templates.js)

---

### Example 2: Add Client-Side Interactivity

**Goal**: Add theme toggle (dark/light mode)

**Steps**:
1. **Create JavaScript file** (`dist/script.js`):
   ```javascript
   const toggleTheme = () => {
     const currentTheme = localStorage.getItem('theme') || 'dark';
     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
     document.body.setAttribute('data-theme', newTheme);
     localStorage.setItem('theme', newTheme);
   };

   // Load saved theme on page load
   document.body.setAttribute('data-theme',
     localStorage.getItem('theme') || 'dark');
   ```

2. **Add toggle button** ([templates.js](../templates.js)):
   ```html
   <button onclick="toggleTheme()" class="theme-toggle">
     Toggle Theme
   </button>
   ```

3. **Add light theme CSS** ([dist/styles.css](../dist/styles.css)):
   ```css
   [data-theme="light"] {
     --terminal-bg: #ffffff;
     --terminal-fg: #1a1a1a;
     /* ... more variables */
   }
   ```

4. **Link script** in [templates.js](../templates.js):
   ```html
   <script src="./script.js"></script>
   ```

---

## Progressive Enhancement Philosophy

### Start with HTML
- Site should work with zero JavaScript
- All content accessible without JS
- Links, images, text work by default

### Layer CSS
- Enhance visual presentation
- Responsive design with media queries
- Print styles (optional)

### Add JavaScript Last
- Enhance interaction, don't require it
- Use JavaScript for "nice to have" features
- Provide fallbacks for JS-disabled users

**Example**: Collapsible sections
- **HTML**: Use `<details>` element (works without JS)
- **CSS**: Style open/closed states
- **JS**: Remember state in local storage (enhancement)

---

## Architecture Guidelines

### Maintain Simplicity
- No build tools or bundlers (keep it simple)
- Minimal dependencies (only `rss-parser`)
- Plain JavaScript (no frameworks)
- Static generation (no server runtime)

### Mobile-First Development
- Design for mobile screens first
- Enhance for larger screens
- Test at multiple breakpoints
- Touch-friendly interactions

### Performance Matters
- Optimize images
- Minimize CSS/JS file size
- Lazy-load non-critical content
- Fast build times (<30 seconds)

### Accessibility First
- Keyboard navigation
- Screen reader support
- High contrast colors
- Semantic HTML

---

## Testing Checklist

When implementing new features:

- [ ] Build succeeds without errors
- [ ] Feature works on mobile (320px width)
- [ ] Feature works on desktop (1920px width)
- [ ] Feature works without JavaScript (if applicable)
- [ ] No console errors in browser
- [ ] Keyboard navigation works
- [ ] Links open correctly
- [ ] Images load and have alt text
- [ ] Text is readable (contrast, size)
- [ ] No layout shift or reflow
- [ ] GitHub Actions build succeeds
- [ ] Documentation updated

---

## Common Pitfalls

### Over-Engineering
**Problem**: Adding complexity for hypothetical future needs

**Solution**: Build only what's needed now, refactor later if needed

---

### Tight Coupling
**Problem**: Features too dependent on specific implementation

**Solution**: Use clear interfaces between layers (data → template → style)

---

### Breaking Simplicity
**Problem**: Adding build tools, frameworks, or heavy dependencies

**Solution**: Stick to vanilla JS, CSS, and HTML where possible

---

### Ignoring Mobile
**Problem**: Designing for desktop first, mobile as afterthought

**Solution**: Always start with mobile design, enhance for desktop

---

### Skipping Testing
**Problem**: Assuming feature works without testing edge cases

**Solution**: Test multiple scenarios, browsers, and screen sizes

---

## Resources

### Documentation
- MDN Web Docs: https://developer.mozilla.org/
- Web.dev: https://web.dev/
- Can I Use: https://caniuse.com/

### Testing Tools
- Chrome DevTools (responsive design mode)
- Firefox Developer Tools
- Lighthouse (performance, accessibility)
- WAVE (accessibility checker)

### Inspiration
- https://observatory.nasa.gov/
- https://stellarium-web.org/
- https://www.heavens-above.com/
- https://theskylive.com/

---

## Notes

- Features should enhance, not complicate
- Keep the static site paradigm (no server-side logic)
- Document architectural decisions in CLAUDE.md
- Test with real users when possible (the friend who loves astronomy!)
- Balance feature requests with simplicity
- Consider maintenance burden of new features
