# our-sky-tonight

A little place to meander the cosmos and plan the next astral adventure :)

## Features

- **Daily Dashboard**: Weather forecasts and aurora predictions for Neenah, WI
- **Astronomy Resources**: Links to sky charts, planetariums, and celestial event trackers
- **News Feeds**: Latest astronomy news from NASA, Space.com, Astronomy.com, and AstroButterfly
- **Daily Quote**: Inspirational quotes via ZenQuotes API
- **Photo Gallery**: Rotating display of astronomy photos
- **Moon & Sun Info**: Quick links to moon phases and sunrise/sunset times

## Development

### Building the Site

```bash
npm install
npm run build
```

### Testing Locally

To view the site locally without deploying to GitHub:

```bash
# Navigate to the dist folder and start a local server
cd dist
python3 -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

## Deployment

The site automatically builds and deploys to GitHub Pages:
- **On push** to the main branch
- **Daily** at 7 AM UTC (via scheduled workflow)
- **Manually** via workflow dispatch

