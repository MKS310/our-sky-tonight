const fs = require('fs');
const path = require('path');
const https = require('https');
let Parser = require('rss-parser');
const templates = require('./templates.js');
let parser = new Parser();
const promises = [];
const sources = JSON.parse(fs.readFileSync('sources.json'));

// Create the requried folders
fs.mkdir(`./dist`, () => {});

// Function to get all gallery images, shuffled with random start
function getGalleryImages() {
  const galleryDir = './images/gallery/';
  try {
    const files = fs.readdirSync(galleryDir);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      return []; // No images found
    }

    // Shuffle all images
    const shuffled = imageFiles.sort(() => 0.5 - Math.random());
    return shuffled.map(img => `images/gallery/${img}`);
  } catch (err) {
    console.log('No gallery images found');
    return [];
  }
}

// Function to fetch quote from ZenQuotes API
function fetchQuote() {
  return new Promise((resolve, reject) => {
    https.get('https://zenquotes.io/api/today', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const quotes = JSON.parse(data);
          if (quotes && quotes.length > 0) {
            resolve({ text: quotes[0].q, author: quotes[0].a });
          } else {
            resolve({ text: 'The stars shine brightest in the darkest skies.', author: 'Anonymous' });
          }
        } catch (err) {
          console.log('Error parsing quote:', err);
          resolve({ text: 'The stars shine brightest in the darkest skies.', author: 'Anonymous' });
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching quote:', err);
      resolve({ text: 'The stars shine brightest in the darkest skies.', author: 'Anonymous' });
    });
  });
}

// Function to fetch NASA APOD
function fetchAPOD() {
  return new Promise((resolve) => {
    https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const apod = JSON.parse(data);
          resolve({
            title: apod.title || 'Astronomy Picture of the Day',
            url: apod.url || '',
            explanation: apod.explanation || '',
            mediaType: apod.media_type || 'image',
            date: apod.date || ''
          });
        } catch (err) {
          console.log('Error parsing APOD:', err);
          resolve({ title: 'APOD Unavailable', url: '', explanation: '', mediaType: 'image' });
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching APOD:', err);
      resolve({ title: 'APOD Unavailable', url: '', explanation: '', mediaType: 'image' });
    });
  });
}

// Function to fetch weather forecast from NWS API
function fetchWeatherForecast() {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'OurSkyTonight/1.0 (https://github.com/MKS310/our-sky-tonight)',
        'Accept': 'application/json'
      }
    };

    https.get('https://api.weather.gov/gridpoints/GRB/74,68/forecast', options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const forecast = JSON.parse(data);
          if (forecast.properties && forecast.properties.periods) {
            // Get first 4 periods (Today, Tonight, Tomorrow, Tomorrow Night)
            const periods = forecast.properties.periods.slice(0, 4).map(period => ({
              name: period.name,
              temperature: period.temperature,
              temperatureUnit: period.temperatureUnit,
              shortForecast: period.shortForecast,
              icon: period.icon,
              windSpeed: period.windSpeed,
              windDirection: period.windDirection,
              isDaytime: period.isDaytime
            }));
            resolve(periods);
          } else {
            resolve([]);
          }
        } catch (err) {
          console.log('Error parsing weather forecast:', err);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching weather forecast:', err);
      resolve([]);
    });
  });
}

// Function to fetch horoscopes for all zodiac signs
function fetchHoroscopes() {
  return new Promise((resolve) => {
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                   'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    // Using placeholder horoscopes for now
    // Can be replaced with real API integration later
    const horoscopes = {};
    signs.forEach(sign => {
      horoscopes[sign] = {
        sign: sign.charAt(0).toUpperCase() + sign.slice(1),
        horoscope: 'The stars align in your favor today. Embrace new opportunities and trust your intuition.'
      };
    });

    resolve(horoscopes);
  });
}

// Copy images directory to dist
function copyImages() {
  const sourceDir = './images';
  const destDir = './dist/images';

  if (fs.existsSync(sourceDir)) {
    fs.mkdir(destDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating images directory:', err);
        return;
      }

      // Copy gallery folder
      const gallerySource = path.join(sourceDir, 'gallery');
      const galleryDest = path.join(destDir, 'gallery');

      if (fs.existsSync(gallerySource)) {
        fs.mkdir(galleryDest, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating gallery directory:', err);
            return;
          }

          fs.readdir(gallerySource, (err, files) => {
            if (err) {
              console.error('Error reading gallery directory:', err);
              return;
            }

            files.forEach(file => {
              if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
                fs.copyFile(
                  path.join(gallerySource, file),
                  path.join(galleryDest, file),
                  (err) => {
                    if (err) {
                      console.error(`Error copying ${file}:`, err);
                    } else {
                      console.log(`Copied image: ${file}`);
                    }
                  }
                );
              }
            });
          });
        });
      }
    });
  }
}

function createFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (!err) {
      console.log('File created: ' + fileName);
    }
  });
}

function itemTemplate(item) {
  return `<li class="mb-1">
    <a rel="noopener" target="_blank" href="${item.link}" title="${item.title}">${item.title}</a>
    <time datetime="${item.pubDate}" class="ps-2 small">${item.pubDate}</time>
  </li>`
}

sources.sections.forEach((section) => {
  section.items.forEach((item) => {
    promises.push(
      parser.parseURL(item.url).catch(err => {
        console.log(`Error fetching ${item.title}:`, err.message);
        return { title: item.title, items: [] };
      })
    );
  });
});

// Add API fetches to promises
promises.push(fetchQuote());
promises.push(fetchAPOD());
promises.push(fetchWeatherForecast());
promises.push(fetchHoroscopes());

Promise.all(promises).then((results) => {
  // Extract results: quote is 4th from end, apod is 3rd from end, weather is 2nd from end, horoscopes is last
  const quote = results[results.length - 4];
  const apod = results[results.length - 3];
  const weather = results[results.length - 2];
  const horoscopes = results[results.length - 1];
  const feeds = results.slice(0, results.length - 4);

  let output = ``;

  feeds.forEach((feed) => {
    output += `<section class="row">`;
      output += `<div class="col">`;
        output += `<h2 class="h3">${feed.title}</h2>`;
        output += '<ul class="mb-4">';
        output += feed.items.slice(0, 10).map(itemTemplate).join('');
        output += '</ul>';
      output += `</div>`;
    output += `</section>`;
  });

  // Get all gallery images, shuffled
  const galleryImages = getGalleryImages();

  // Get current date/time info
  const now = new Date();
  const dateTimeInfo = {
    date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };

  output = templates.document(output, galleryImages, quote, dateTimeInfo, apod, horoscopes, weather);

  // Copy images to dist folder
  copyImages();

  createFile('./dist/index.html', output)
});