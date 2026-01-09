function imageGalleryColumn(imageUrls) {
  if (!imageUrls || imageUrls.length === 0) {
    return '';
  }

  return imageUrls.map(url => `
    <div class="gallery-image-container mb-3">
      <img src="${url}" alt="Night Sky over Neenah, Wisconsin" class="gallery-image">
    </div>
  `).join('');
}

function headerInfoSection(quote, dateTimeInfo) {
  return `<section class="info-header mb-4">
    <div class="container">
      <div class="row g-3">
        <div class="col-md-2">
          <div class="info-box">
            <strong>Date & Time</strong>
            <p class="mb-0 small">${dateTimeInfo.date}</p>
            <p class="mb-0">${dateTimeInfo.time}</p>
          </div>
        </div>
        <div class="col-md-5">
          <div class="info-box quote-box">
            <em>"${quote.text}"</em>
            <p class="text-end mb-0"><small>— ${quote.author}</small></p>
            <p class="text-end mb-0"><small><a href="https://zenquotes.io/" target="_blank" rel="noopener">via ZenQuotes</a></small></p>
          </div>
        </div>
        <div class="col-md-2">
          <div class="info-box">
            <strong>Moon Phase</strong>
            <p class="mb-0"><a href="https://theskylive.com/moon-info" target="_blank" rel="noopener">Current Phase →</a></p>
            <p class="mb-0"><a href="https://theskylive.com/planetarium?obj=moon" target="_blank" rel="noopener">Moonrise/Moonset →</a></p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="info-box">
            <strong>Sun Times</strong>
            <p class="mb-0"><a href="https://www.timeanddate.com/sun/usa/neenah" target="_blank" rel="noopener">Sunrise/Sunset Times →</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function dailyDashboardSection() {
  return `<section class="row mb-4">
    <div class="col-md-6 mb-3">
      <h2 class="h3">Today's Weather - Neenah, WI</h2>
      <div class="chart-container">
        <iframe src="https://www.cleardarksky.com/c/AppltnWIkey.html?1"
                width="100%"
                height="300"
                frameborder="0"
                style="background: white;"
                title="Clear Sky Chart for Appleton/Neenah">
        </iframe>
        <p class="small mt-2">
          <a href="https://www.cleardarksky.com/c/AppltnWIkey.html" target="_blank" rel="noopener">
            View detailed forecast →
          </a>
        </p>
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <h2 class="h3">Aurora Forecast</h2>
      <div class="chart-container">
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

function astronomyLinksSection() {
  return `<section class="row mb-4">
    <div class="col">
      <h2 class="h3">Astronomy Resources</h2>
      <div class="chart-container">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-2">
              <strong>Sky Tonight:</strong>
              <a href="https://theskylive.com/" target="_blank" rel="noopener">TheSkyLive.com →</a>
            </p>
            <p class="mb-2">
              <strong>Visible Planets:</strong>
              <a href="https://theskylive.com/planetarium" target="_blank" rel="noopener">Planetarium →</a>
            </p>
            <p class="mb-2">
              <strong>Clear Sky Charts:</strong>
              <a href="https://www.cleardarksky.com/c/AppltnWIkey.html" target="_blank" rel="noopener">Appleton/Neenah →</a>
            </p>
          </div>
          <div class="col-md-6">
            <p class="mb-2">
              <strong>Space Weather:</strong>
              <a href="https://www.swpc.noaa.gov/communities/space-weather-enthusiasts-dashboard" target="_blank" rel="noopener">NOAA Dashboard →</a>
            </p>
            <p class="mb-2">
              <strong>Aurora Forecast:</strong>
              <a href="https://new-star.org/aurora-space/" target="_blank" rel="noopener">Aurora Space →</a>
            </p>
            <p class="mb-2">
              <strong>ISS Tracker:</strong>
              <a href="https://spotthestation.nasa.gov/" target="_blank" rel="noopener">NASA Spot the Station →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

module.exports.document = function (body, imageUrls, quote, dateTimeInfo) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Astronomy viewing conditions, weather, and news for Neenah, Wisconsin. Check clear sky charts and stay updated on celestial events.">
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
      ${headerInfoSection(quote, dateTimeInfo)}
      <div class="container mb-3">
        <div class="row">
          <div class="col-md-3 mb-3">
            ${imageGalleryColumn(imageUrls)}
          </div>
          <div class="col-md-9">
            ${dailyDashboardSection()}
            ${astronomyLinksSection()}
            ${body}
            <div class="row mb-3">
              <div class="col">
                <small><strong>Updated</strong>: ${new Date()}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="bg-dark text-light p-4">
        <div class="container text-center">
          Made with <span class="pe-1">❤️</span> for Mike by Maggie in Neenah, Wisconsin
        </div>
      </footer>
    </main>
  </body>
  </html>`;
}