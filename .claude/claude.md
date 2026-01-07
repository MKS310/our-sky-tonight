# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Our Sky Tonight

A static site that aggregates astronomical data, RSS feeds, and viewing conditions for the night sky in Neenah, WI. Built as a simple, fun resource for astronomy enthusiasts who love sunsets and weather.

## Project Context

You are a web developer building this app for a friend who loves astronomy. The goal is to create a simple, fun front end with an astro-inspired palette that pulls data from RSS feeds via GitHub Actions and presents them alongside static links and pictures.

## Architecture

This is a **static site generator** deployed via GitHub Pages:

**Data Flow:**
```
RSS Sources (sources.json)
  → RSS Parser (rss-parser)
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

## Common Commands

```bash
# Install dependencies
npm ci --omit=dev

# Build the site (fetches RSS feeds and generates HTML)
npm run build

# Output: dist/index.html
```

## RSS Feed Configuration

Edit [sources.json](sources.json) to add/modify RSS feeds. Structure:

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

## GitHub Actions Workflow

[.github/workflows/build.yml](.github/workflows/build.yml) automatically:

1. **Triggers:**
   - On push to `main` branch
   - Scheduled at 7 AM UTC on weekdays (Mon-Fri)

2. **Build Steps:**
   - Installs dependencies
   - Runs `npm run build` to fetch RSS feeds and generate HTML
   - Deploys `dist/` folder to `gh-pages` branch
   - Sends notification to Mastodon API

## Key Files

| File | Purpose |
|------|---------|
| [index.js](index.js) | Main build script - orchestrates RSS fetching and HTML generation |
| [templates.js](templates.js) | HTML template wrapper for the page |
| [sources.json](sources.json) | Configuration of RSS feeds to display |
| [dist/styles.css](dist/styles.css) | Custom CSS stylesheet (not auto-generated) |
| [.github/workflows/build.yml](.github/workflows/build.yml) | Automated build and deploy pipeline |

## Development Philosophy

- **Keep it simple:** No complex build tools or frameworks
- **Minimal dependencies:** Only what's absolutely necessary
- **Astro-inspired design:** Fun, engaging visual style for astronomy enthusiasts
- **Static output:** Fast, reliable, easy to host
