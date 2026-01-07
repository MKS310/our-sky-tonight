function heroSection(imageUrl) {
  if (!imageUrl) {
    return '';
  }

  return `<div class="hero-image-container">
    <img src="${imageUrl}" alt="Night Sky over Neenah, Wisconsin" class="hero-image">
  </div>`;
}

function clearSkyChartSection() {
  return `<section class="row mb-4">
    <div class="col">
      <h2 class="h3">Observing Conditions - Appleton/Neenah</h2>
      <div class="chart-container">
        <iframe src="https://www.cleardarksky.com/c/AppltnWIkey.html?1"
                width="100%"
                height="400"
                frameborder="0"
                title="Clear Sky Chart for Appleton/Neenah">
        </iframe>
        <p class="small mt-2">
          <a href="https://www.cleardarksky.com/c/AppltnWIkey.html" target="_blank" rel="noopener">
            View full Clear Sky Chart →
          </a>
        </p>
      </div>
    </div>
  </section>`;
}

module.exports.document = function (body, imageUrl) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Astronomy viewing conditions, weather, and news for Neenah, Wisconsin. Check clear sky charts and stay updated on celestial events.">
    <title>Our Sky Tonight - Neenah, WI</title>
    <link type="text/css" rel="stylesheet" href="./styles.css?ver=1.0.2" media="all">
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
      <div class="container mb-3">
        ${clearSkyChartSection()}
        <div class="row mb-3">
          <div class="col-md-4 mb-3">
            ${heroSection(imageUrl)}
          </div>
          <div class="col-md-8">
            ${body}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <strong>Updated</strong>: ${new Date()}
          </div>
        </div>
      </div>
      <footer class="bg-dark text-light p-4">
        <div class="container text-center">
          Made with <span class="pe-1">❤️</span> by Maggie in Neenah, Wisconsin
        </div>
      </footer>
    </main>
  </body>
  </html>`;
}