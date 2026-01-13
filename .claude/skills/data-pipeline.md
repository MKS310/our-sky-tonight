# Data Pipeline Skill

## Purpose
Manage all data sources, API integrations, RSS feeds, and data fetching logic for "Our Sky Tonight".

## Scope
This skill focuses on the data layer of the application, ensuring reliable data fetching, parsing, error handling, and integration of external APIs and RSS feeds.

---

## Responsibilities

### RSS Feed Management
- Add/remove RSS feeds in [sources.json](../sources.json)
- Test RSS feed parsing and validation
- Handle RSS feed errors and timeouts
- Optimize feed fetching performance

### API Integrations
- Integrate new weather, astronomy, and space APIs
- Handle API rate limits and errors
- Implement fallback data for API failures
- Parse and transform API responses

### Data Fetching Logic
- Update data fetching functions in [index.js](../index.js)
- Optimize parallel API calls with `Promise.all()`
- Add caching strategies (if needed)
- Log errors and debug issues

### Data Transformation
- Parse RSS feeds into consistent format
- Transform API responses for templates
- Handle missing or malformed data gracefully
- Ensure data is template-ready

---

## Primary Files

### Configuration
- [sources.json](../sources.json) - RSS feed configuration

### Data Fetching
- [index.js](../index.js) - Main build script with all data fetching logic

---

## Current Data Sources

### 1. Weather Data (NOAA NWS)
**API**: `https://api.weather.gov/gridpoints/GRB/74,68/forecast`

**Function**: `fetchWeatherForecast()` in [index.js](../index.js:98)

**Returns**: Array of 4 forecast periods with temperature, conditions, wind

**Error Handling**: Returns empty array on failure

---

### 2. Daily Quote (ZenQuotes)
**API**: `https://zenquotes.io/api/today`

**Function**: `fetchQuote()` in [index.js](../index.js:36)

**Returns**: Object with `text` and `author`

**Fallback**: Default inspirational quote

---

### 3. NASA APOD (Astronomy Picture of the Day)
**API**: `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`

**Function**: `fetchAPOD()` in [index.js](../index.js:66)

**Returns**: Object with `title`, `url`, `explanation`, `mediaType`

**Note**: DEMO_KEY has rate limits; consider getting real API key

---

### 4. Horoscopes
**Source**: Placeholder data (future API integration)

**Function**: `fetchHoroscopes()` in [index.js](../index.js:146)

**Returns**: Object with horoscopes for all 12 zodiac signs

**TODO**: Replace with real horoscope API

---

### 5. RSS Feeds
**Configuration**: [sources.json](../sources.json)

**Current Feeds**:
- NASA Breaking News
- Space.com
- Astronomy.com
- AstroButterfly
- Neenah Weather (NWS)

**Parsing**: Uses `rss-parser` library

**Limit**: Top 10 items per feed

---

## Common Tasks

### Task: Add New RSS Feed
1. Read [sources.json](../sources.json)
2. Add new feed object to appropriate section:
   ```json
   {
     "title": "Feed Name",
     "url": "https://example.com/rss"
   }
   ```
3. Test build: `npm run build`
4. Verify feed appears in output
5. Check for parsing errors in console

### Task: Integrate New API
1. Read [index.js](../index.js) to understand pattern
2. Create new fetch function following existing pattern:
   ```javascript
   function fetchNewData() {
     return new Promise((resolve) => {
       https.get('API_URL', (res) => {
         // ... parsing logic
         resolve(data);
       }).on('error', (err) => {
         console.log('Error:', err);
         resolve(fallbackData); // Always resolve, never reject
       });
     });
   }
   ```
3. Add to `promises` array before `Promise.all()`
4. Extract result in `.then()` callback
5. Pass to template function

### Task: Handle API Failure
1. Identify failing API (check console logs)
2. Add/improve error handling in fetch function
3. Provide meaningful fallback data
4. Log error for debugging
5. Test with network disabled

### Task: Optimize Data Fetching
1. Review all API calls in [index.js](../index.js)
2. Ensure parallel fetching with `Promise.all()`
3. Consider adding timeout limits
4. Check for redundant API calls
5. Test build performance

---

## Data Flow Diagram

```
sources.json → RSS Parser → Feed Items (top 10 each)
                                ↓
Weather API → fetchWeatherForecast() → Forecast Periods
                                ↓
Quote API → fetchQuote() → Quote Object
                                ↓
NASA API → fetchAPOD() → APOD Data
                                ↓
Horoscope → fetchHoroscopes() → Horoscope Data
                                ↓
                        Promise.all()
                                ↓
                        templates.document()
                                ↓
                        dist/index.html
```

---

## Error Handling Guidelines

### Always Resolve, Never Reject
```javascript
// GOOD
return new Promise((resolve) => {
  api.call()
    .then(data => resolve(data))
    .catch(err => {
      console.log('Error:', err);
      resolve(fallbackData); // Provide fallback
    });
});

// BAD - will break Promise.all()
return new Promise((resolve, reject) => {
  api.call()
    .then(resolve)
    .catch(reject); // Don't reject!
});
```

### Provide Fallback Data
Every API call should have sensible fallback data:
- Weather: Empty array or cached data
- Quote: Default inspirational quote
- APOD: Placeholder image or blank
- RSS: Empty items array

### Log Errors for Debugging
```javascript
.on('error', (err) => {
  console.log('Error fetching [Source]:', err.message);
  resolve(fallbackData);
});
```

---

## API Configuration

### NOAA Weather API
- **No API key required**
- Rate limit: Unknown (generous)
- Location: Neenah, WI (44.1858, -88.4626)
- Grid: GRB/74,68

### NASA APOD API
- **API key**: Currently using `DEMO_KEY`
- Rate limit: 30 requests/hour per IP (demo key)
- **TODO**: Get real API key from https://api.nasa.gov/
- Real key allows 1000 requests/hour

### ZenQuotes API
- **No API key required**
- Rate limit: Unknown
- Endpoint: `/api/today` returns quote of the day

---

## Testing Checklist

When modifying data pipeline:

- [ ] Build succeeds: `npm run build`
- [ ] No console errors during build
- [ ] All data sources return valid data
- [ ] Fallback data works when API fails
- [ ] RSS feeds parse correctly (check for malformed XML)
- [ ] Weather forecast displays 4 periods
- [ ] Quote appears in header
- [ ] APOD image/video loads
- [ ] Build completes in reasonable time (<30 seconds)
- [ ] Check GitHub Actions build logs

---

## Future Enhancements

### Potential New Integrations
1. **ISS Tracking**: Real-time ISS pass predictions for Neenah
   - API: http://api.open-notify.org/iss-pass.json

2. **Meteor Showers**: Upcoming meteor shower calendar
   - API: Consider scraping or finding astronomy calendar API

3. **Planet Visibility**: Calculate which planets are visible tonight
   - Library: astronomy-engine npm package

4. **Light Pollution**: Show light pollution map for area
   - API: lightpollutionmap.info

5. **Real Horoscopes**: Replace placeholder with real API
   - API: Consider https://horoscope-app-api.vercel.app/

---

## Notes

- All data fetching happens at build time (not client-side)
- Static site means data is only as fresh as last build
- GitHub Actions runs build daily at 7 AM UTC
- Consider caching strategy for rate-limited APIs
- Keep dependencies minimal (currently only `rss-parser`)
