function photoGallerySection(imageUrls) {
  if (!imageUrls || imageUrls.length === 0) {
    return '';
  }

  const galleryImages = imageUrls.map(url => `
    <div class="gallery-slide">
      <img src="${url}" alt="Night Sky over Neenah, Wisconsin" class="gallery-image">
    </div>
  `).join('');

  return `<section class="row mb-4">
    <div class="col">
      <h2 class="h3">Photo Gallery</h2>
      <div class="chart-container">
        <div class="photo-gallery">
          ${galleryImages}
        </div>
      </div>
    </div>
  </section>`;
}

function headerInfoSection(quote) {
  return `<section class="info-header mb-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="info-box quote-box">
            <em>"${quote.text}"</em>
            <p class="text-end mb-0"><small>— ${quote.author}</small></p>
            <p class="text-end mb-0"><small><a href="https://zenquotes.io/" target="_blank" rel="noopener">via ZenQuotes</a></small></p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function dailyDashboardSection(weather) {
  let weatherWidget = '';

  if (weather && weather.length > 0) {
    weatherWidget = weather.map(period => `
      <div class="weather-period">
        <div class="weather-period-name">${period.name}</div>
        <img src="${period.icon}" alt="${period.shortForecast}" class="weather-icon">
        <div class="weather-temp">${period.temperature}°${period.temperatureUnit}</div>
        <div class="weather-forecast">${period.shortForecast}</div>
        <div class="weather-wind">${period.windDirection} ${period.windSpeed}</div>
      </div>
    `).join('');
  } else {
    weatherWidget = '<p class="text-center">Weather forecast unavailable</p>';
  }

  return `<section class="row mb-4">
    <div class="col-md-6 mb-3">
      <h2 class="h3">Weather Forecast - Neenah, WI</h2>
      <div class="chart-container">
        <div class="weather-widget">
          ${weatherWidget}
        </div>
        <p class="small text-center mb-2 mt-3">
          <a href="https://forecast.weather.gov/MapClick.php?lat=44.1858&lon=-88.4626#.Uw1T-rS3CrU" target="_blank" rel="noopener">
            View detailed forecast →
          </a>
        </p>
        <p class="small text-center mb-0">
          <a href="https://www.cleardarksky.com/c/AppltnWIkey.html" target="_blank" rel="noopener">
            Clear Sky Chart →
          </a>
        </p>
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <h2 class="h3">Aurora Forecast</h2>
      <div class="chart-container chart-container-grey">
        <img src="https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg"
             alt="NOAA Aurora Forecast - Northern Hemisphere"
             style="width: 100%; height: auto; border-radius: 4px;">
        <p class="small mt-2">
          <a href="https://www.swpc.noaa.gov/communities/space-weather-enthusiasts-dashboard" target="_blank" rel="noopener">
            NOAA Space Weather →
          </a> |
          <a href="https://new-star.org/aurora-space/" target="_blank" rel="noopener">
            Aurora Space →
          </a>
        </p>
      </div>
    </div>
  </section>`;
}

function apodSection(apod) {
  if (!apod || !apod.url) {
    return '';
  }

  return `<section class="row mb-4">
    <div class="col">
      <h2 class="h3">NASA Astronomy Picture of the Day</h2>
      <div class="chart-container">
        ${apod.mediaType === 'video'
          ? `<iframe src="${apod.url}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`
          : `<img src="${apod.url}" alt="${apod.title}" style="width: 100%; height: auto; border-radius: 4px;">`
        }
        <h4 class="mt-3">${apod.title}</h4>
        <p class="small">${apod.explanation}</p>
        <p class="small mt-2">
          <a href="https://apod.nasa.gov/apod/" target="_blank" rel="noopener">
            View APOD Archive →
          </a>
        </p>
      </div>
    </div>
  </section>`;
}

function horoscopesSection(horoscopes) {
  if (!horoscopes) {
    return '';
  }

  const signs = Object.keys(horoscopes);
  const horoscopeHTML = signs.map(sign => `
    <div class="col-md-3 mb-3">
      <div class="horoscope-card">
        <h4>${horoscopes[sign].sign}</h4>
        <p class="small">${horoscopes[sign].horoscope}</p>
      </div>
    </div>
  `).join('');

  return `<section class="row mb-4">
    <div class="col">
      <h2 class="h3">Daily Horoscopes (Work in Progress...Aren't we all...)</h2>
      <p class="small mb-3">For entertainment purposes only!</p>
      <div class="row">
        ${horoscopeHTML}
      </div>
    </div>
  </section>`;
}

function moonSunLinksSection() {
  return `<section class="row mb-4">
    <div class="col-md-3 mb-3">
      <div class="info-box">
        <strong>Moon Phase</strong>
        <p class="mb-1"><a href="https://theskylive.com/moon-info" target="_blank" rel="noopener">Current Phase →</a></p>
        <p class="mb-0"><a href="https://theskylive.com/planetarium?obj=moon" target="_blank" rel="noopener">Moonrise/Moonset →</a></p>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="info-box">
        <strong>Sun Times</strong>
        <p class="mb-0"><a href="https://www.timeanddate.com/sun/usa/neenah" target="_blank" rel="noopener">Sunrise/Sunset Times →</a></p>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="info-box">
        <strong>Sky Charts & Viewing</strong>
        <p class="mb-1"><a href="https://theskylive.com/" target="_blank" rel="noopener">TheSkyLive.com →</a></p>
        <p class="mb-0"><a href="https://theskylive.com/planetarium" target="_blank" rel="noopener">Visible Planets →</a></p>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="info-box">
        <strong>Space Weather</strong>
        <p class="mb-1"><a href="https://www.swpc.noaa.gov/communities/space-weather-enthusiasts-dashboard" target="_blank" rel="noopener">NOAA Dashboard →</a></p>
        <p class="mb-0"><a href="https://new-star.org/aurora-space/" target="_blank" rel="noopener">Aurora Space →</a></p>
      </div>
    </div>
  </section>`;
}

function clearSkySection() {
  return `<section class="row mb-4">
    <div class="col-md-9 mb-3">
      <h2 class="h3">Clear Sky Chart</h2>
      <div class="chart-container">
        <a href="https://www.cleardarksky.com/c/AppltnWIkey.html" target="_blank" rel="noopener">
          <img src="https://www.cleardarksky.com/c/AppltnWIcsk.gif?c=813647" alt="Clear Sky Chart for Appleton/Neenah" style="width: 100%; height: auto; border-radius: 4px;">
        </a>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="info-box">
        <strong>Satellite Tracking</strong>
        <p class="mb-0"><a href="https://spotthestation.nasa.gov/" target="_blank" rel="noopener">ISS Spot the Station →</a></p>
      </div>
    </div>
  </section>`;
}

module.exports.document = function (body, imageUrls, quote, dateTimeInfo, apod, horoscopes, weather) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Astronomy viewing conditions, weather, and news for Neenah, Wisconsin. Check clear sky charts and stay updated on celestial events. A little place to meander the cosmos and plan the next astral adventure :)">
    <title>Our Sky Tonight - Neenah, WI</title>
    <link type="text/css" rel="stylesheet" href="./styles.css?ver=1.0.3" media="all">
  </head>
  <body>
    <main>
      <header class="bg-dark mb-4">
        <nav class="container navbar navbar-dark">
        <div class="container-fluid">
          <div>
            <h1 class="text-light h2 mb-0">Our Sky Tonight</h1>
            <p class="text-light small mb-0">Astronomy viewing conditions and news</p>
          </div>
          <a rel="noopener" href="https://github.com/MKS310/our-sky-tonight" class="text-light" title="See repository on Github">Github</a>
        </div>
        </nav>
      </header>
      ${headerInfoSection(quote)}
      <div class="container mb-3">
        ${moonSunLinksSection()}
        ${dailyDashboardSection(weather)}
        ${clearSkySection()}
        ${photoGallerySection(imageUrls)}
        ${apodSection(apod)}
        <section class="row mb-4">
          <div class="col">
            <h2 class="h3">Astro News RSS Feeds :)</h2>
          </div>
        </section>
        ${body}
        <div class="row mb-3">
          <div class="col">
            <small><strong>Updated</strong>: ${new Date()}</small>
          </div>
        </div>
      </div>
      <div class="container mb-3">
        ${horoscopesSection(horoscopes)}
      </div>
      <footer class="bg-dark text-light p-4">
        <div class="container text-center">
          Made for Mike with <span class="pe-1">❤️</span> by Maggie (& Claude) in Neenah, Wisconsin
        </div>
      </footer>
    </main>
  </body>
  </html>`;
}