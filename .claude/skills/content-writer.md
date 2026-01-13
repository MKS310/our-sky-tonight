# Content Writer Skill

## Purpose
Manage HTML templates, content structure, copy, and semantic HTML for "Our Sky Tonight".

## Scope
This skill focuses on the content and presentation layer, ensuring well-structured, accessible HTML and clear, engaging copy throughout the site.

---

## Responsibilities

### HTML Template Management
- Update template functions in [templates.js](../templates.js)
- Add new content sections
- Remove or reorder existing sections
- Ensure semantic HTML5 structure

### Content Structure
- Organize information hierarchy
- Create dashboard layouts
- Design content cards and widgets
- Implement progressive disclosure patterns

### Copy & Messaging
- Write and update static text
- Craft engaging headlines
- Create informative descriptions
- Maintain friendly, accessible tone

### SEO & Metadata
- Update page title and meta description
- Add OpenGraph tags for social sharing
- Ensure proper heading hierarchy (h1, h2, h3)
- Create meaningful link text

### Accessibility
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure proper alt text for images
- Maintain logical tab order

---

## Primary Files

### Templates
- [templates.js](../templates.js) - All HTML template functions

### Related Files
- [index.js](../index.js) - Orchestrates template rendering
- [dist/styles.css](../dist/styles.css) - CSS classes used in templates

---

## Template Structure

### Main Document Template
```javascript
module.exports.document = function(body, imageUrls, quote, dateTimeInfo, apod, horoscopes, weather)
```

Located in [templates.js](../templates.js:197)

**Assembles**:
- HTML head (meta tags, title, stylesheet)
- Header/navigation
- All content sections
- Footer
- Returns complete HTML document

---

### Content Section Templates

#### 1. Header Info Section
**Function**: `headerInfoSection(quote)` - [templates.js](../templates.js:24)

**Purpose**: Display daily inspirational quote

**Content**: Quote text, author, source attribution

---

#### 2. Moon/Sun Links Section
**Function**: `moonSunLinksSection()` - [templates.js](../templates.js:146)

**Purpose**: Quick links to moon/sun data

**Content**: 4 info boxes with links to external resources

---

#### 3. Daily Dashboard Section
**Function**: `dailyDashboardSection(weather)` - [templates.js](../templates.js:40)

**Purpose**: Weather forecast and aurora alerts

**Content**: 4-period weather widget, aurora forecast image

---

#### 4. Clear Sky Section
**Function**: `clearSkySection()` - [templates.js](../templates.js:178)

**Purpose**: Clear sky chart and ISS tracking

**Content**: Embedded chart image, ISS link

---

#### 5. Photo Gallery Section
**Function**: `photoGallerySection(imageUrls)` - [templates.js](../templates.js:1)

**Purpose**: Horizontal scrolling photo gallery

**Content**: All images from `/images/gallery/`

---

#### 6. APOD Section
**Function**: `apodSection(apod)` - [templates.js](../templates.js:95)

**Purpose**: NASA Astronomy Picture of the Day

**Content**: Image/video, title, explanation, archive link

---

#### 7. Horoscopes Section
**Function**: `horoscopesSection(horoscopes)` - [templates.js](../templates.js:120)

**Purpose**: Daily horoscopes for all zodiac signs

**Content**: 12 horoscope cards

---

## Common Tasks

### Task: Add New Content Section
1. Read [templates.js](../templates.js)
2. Create new section function:
   ```javascript
   function newSection(data) {
     return `<section class="row mb-4">
       <div class="col">
         <h2 class="h3">Section Title</h2>
         <div class="chart-container">
           ${data}
         </div>
       </div>
     </section>`;
   }
   ```
3. Add function to `module.exports.document`
4. Update [index.js](../index.js) if new data needed
5. Test build and verify output

### Task: Reorder Content Sections
1. Read [templates.js](../templates.js:197) - find `document()` function
2. Locate section function calls in template string
3. Reorder calls to match desired priority
4. Example:
   ```javascript
   ${moonSunLinksSection()}        // Priority 1
   ${dailyDashboardSection(weather)} // Priority 2
   ${clearSkySection()}            // Priority 3
   ```
5. Build and verify new order

### Task: Update Static Copy
1. Read [templates.js](../templates.js)
2. Find text to update (titles, labels, descriptions)
3. Edit directly in template strings
4. Maintain consistent tone (friendly, informative)
5. Check spelling and grammar

### Task: Improve Semantic HTML
1. Review template functions for non-semantic elements
2. Replace `<div>` with semantic alternatives:
   - `<article>` for self-contained content
   - `<aside>` for sidebars
   - `<nav>` for navigation
   - `<section>` for thematic grouping
3. Ensure proper heading hierarchy
4. Add ARIA labels if needed

### Task: Add SEO Metadata
1. Read [templates.js](../templates.js:197) - find `<head>` section
2. Update or add meta tags:
   ```html
   <meta name="description" content="...">
   <meta property="og:title" content="...">
   <meta property="og:description" content="...">
   <meta property="og:image" content="...">
   ```
3. Ensure title is descriptive and concise
4. Verify viewport meta tag for mobile

---

## Content Guidelines

### Tone & Voice
- **Friendly**: Approachable, not overly technical
- **Informative**: Educational about astronomy
- **Concise**: Respect user's time
- **Accessible**: Clear language, no jargon

### Writing Best Practices
1. **Use active voice**: "Check tonight's sky" not "Tonight's sky can be checked"
2. **Be specific**: "Clear until 11 PM" not "Clear tonight"
3. **Front-load important info**: Put key data first
4. **Use lists**: Break up dense content
5. **Add context**: Explain why data matters

### Link Text
Good:
- "View detailed forecast →"
- "Sunrise/Sunset Times →"
- "ISS Spot the Station →"

Bad:
- "Click here"
- "More info"
- "Link"

---

## Accessibility Checklist

When updating templates:

- [ ] Use semantic HTML5 elements
- [ ] Maintain heading hierarchy (h1 → h2 → h3)
- [ ] Add alt text for all images
- [ ] Use descriptive link text (no "click here")
- [ ] Include ARIA labels for icon buttons
- [ ] Ensure form inputs have labels
- [ ] Use `<time>` element for dates
- [ ] Add `rel="noopener"` to external links
- [ ] Verify logical tab order
- [ ] Test with keyboard navigation

---

## Template Patterns

### Info Box Pattern
```javascript
<div class="info-box">
  <strong>Title</strong>
  <p class="mb-1"><a href="..." target="_blank" rel="noopener">Link Text →</a></p>
</div>
```

### Weather Widget Pattern
```javascript
<div class="weather-period">
  <div class="weather-period-name">${name}</div>
  <img src="${icon}" alt="${forecast}" class="weather-icon">
  <div class="weather-temp">${temp}°${unit}</div>
  <div class="weather-forecast">${forecast}</div>
  <div class="weather-wind">${wind}</div>
</div>
```

### Card Pattern
```javascript
<div class="horoscope-card">
  <h4>${title}</h4>
  <p class="small">${content}</p>
</div>
```

### Section Wrapper Pattern
```javascript
<section class="row mb-4">
  <div class="col">
    <h2 class="h3">Section Title</h2>
    <!-- content -->
  </div>
</section>
```

---

## HTML Structure Reference

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags, title, stylesheet -->
</head>
<body>
  <main>
    <header><!-- Site header/nav --></header>

    <!-- Hero: Quote section -->

    <div class="container">
      <!-- Moon/sun links -->
      <!-- Weather dashboard -->
      <!-- Clear sky chart -->
      <!-- Photo gallery -->
      <!-- APOD -->
      <!-- RSS feeds -->
    </div>

    <div class="container">
      <!-- Horoscopes -->
    </div>

    <footer><!-- Attribution --></footer>
  </main>
</body>
</html>
```

---

## Future Content Ideas

### Potential New Sections
1. **Tonight's Highlights**: Top 3 things to observe tonight
2. **Event Calendar**: Upcoming astronomical events
3. **Stargazing Tips**: Rotating astronomy tips/facts
4. **Community Photos**: User-submitted photos (if interactive version)
5. **Equipment Corner**: Telescope/binocular recommendations
6. **Constellation of the Month**: Featured constellation

### Content Enhancements
- Add countdown timers (requires JS)
- Collapsible sections for mobile
- "Print this page" friendly layout
- Export data as PDF
- Share buttons for social media

---

## Notes

- Templates are pure JavaScript string concatenation (no template engine)
- All content is server-rendered at build time (static HTML)
- No client-side JavaScript for content rendering
- Keep templates simple and maintainable
- Avoid complex logic in templates (do it in index.js)
- Use template literals for clean multiline HTML
- Escape user data if ever dynamic (currently all static)
