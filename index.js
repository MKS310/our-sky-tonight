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

// Function to fetch visible planets for Neenah, WI
function fetchVisiblePlanets() {
  return new Promise((resolve) => {
    const latitude = 44.1858;
    const longitude = -88.4626;
    const url = `https://api.visibleplanets.dev/v3?latitude=${latitude}&longitude=${longitude}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const planets = JSON.parse(data);
          // Filter for planets that are above horizon and reasonably visible
          if (planets.data && Array.isArray(planets.data)) {
            const visiblePlanets = planets.data.filter(planet =>
              planet.aboveHorizon && planet.altitude > 0
            );
            resolve(visiblePlanets);
          } else {
            resolve([]);
          }
        } catch (err) {
          console.log('Error parsing visible planets:', err);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching visible planets:', err);
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

// Function to get upcoming meteor showers
function getUpcomingMeteorShowers() {
  // 2026 major meteor showers with peak dates
  const meteorShowers = [
    { name: 'Quadrantids', peak: '2026-01-04', peakDate: new Date('2026-01-04'), rate: '120/hr', description: 'Best viewed before dawn' },
    { name: 'Lyrids', peak: '2026-04-22', peakDate: new Date('2026-04-22'), rate: '20/hr', description: 'Ancient shower from Comet Thatcher' },
    { name: 'Eta Aquarids', peak: '2026-05-06', peakDate: new Date('2026-05-06'), rate: '60/hr', description: 'Debris from Halley\'s Comet' },
    { name: 'Perseids', peak: '2026-08-12', peakDate: new Date('2026-08-12'), rate: '100/hr', description: 'Most popular shower, excellent for viewing' },
    { name: 'Draconids', peak: '2026-10-08', peakDate: new Date('2026-10-08'), rate: 'Variable', description: 'Best viewed in evening' },
    { name: 'Orionids', peak: '2026-10-21', peakDate: new Date('2026-10-21'), rate: '25/hr', description: 'Also from Halley\'s Comet' },
    { name: 'Leonids', peak: '2026-11-17', peakDate: new Date('2026-11-17'), rate: '15/hr', description: 'Fast, bright meteors' },
    { name: 'Geminids', peak: '2026-12-14', peakDate: new Date('2026-12-14'), rate: '150/hr', description: 'Best shower of the year' }
  ];

  const now = new Date();
  // Filter for upcoming showers within next 90 days
  const upcoming = meteorShowers.filter(shower => {
    const daysUntil = (shower.peakDate - now) / (1000 * 60 * 60 * 24);
    return daysUntil >= -2 && daysUntil <= 90; // Show if peak is within 90 days or just passed (2 days ago)
  });

  // Format the showers
  return upcoming.map(shower => ({
    name: shower.name,
    peak: shower.peakDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    rate: shower.rate,
    description: shower.description,
    daysUntil: Math.ceil((shower.peakDate - now) / (1000 * 60 * 60 * 24))
  }));
}

// Function to fetch ISS pass predictions for Neenah, WI using Open-Notify API
function fetchISSPasses() {
  return new Promise((resolve) => {
    const latitude = 44.1858;
    const longitude = -88.4626;
    const http = require('http'); // Open-Notify uses http, not https
    const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}&n=5`;

    http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.response && Array.isArray(response.response)) {
            // Get the passes and format the data
            const formattedPasses = response.response.map(pass => ({
              risetime: pass.risetime,
              duration: pass.duration,
              riseDate: new Date(pass.risetime * 1000).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
              }),
              riseTime: new Date(pass.risetime * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit'
              }),
              durationMin: Math.round(pass.duration / 60)
            }));
            resolve(formattedPasses);
          } else {
            resolve([]);
          }
        } catch (err) {
          console.log('Error parsing ISS passes:', err);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching ISS passes:', err);
      resolve([]);
    });
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

// Returns a daily astrophotography tip, rotated by day-of-year
function getAstroPhotographyTip() {
  const tips = [
    { tip: 'For Milky Way shots, use ISO 1600–3200, f/2.8 or faster, and the 500 rule: divide 500 by your focal length to find max shutter seconds before stars trail.', category: 'Camera Settings' },
    { tip: 'Shoot RAW, never JPEG. The extra dynamic range in RAW files is critical for recovering shadow detail in dark sky images during post-processing.', category: 'Camera Settings' },
    { tip: 'For lunar photography, use ISO 100–400 and fast shutter speeds (1/250s+). The moon is much brighter than it looks — treat it like daylight shooting.', category: 'Camera Settings' },
    { tip: 'When shooting planets, use your highest frame rate and record video or burst mode. Stack the sharpest frames later to reduce atmospheric turbulence effects.', category: 'Planetary Imaging' },
    { tip: 'Use live view and digital zoom to 10x when focusing on stars. Adjust until the stars are the smallest, sharpest pinpoints you can achieve.', category: 'Focusing' },
    { tip: 'Tape your focus ring with gaffer tape once you nail focus in the dark. Temperature drops can shift focus slightly as the night progresses.', category: 'Focusing' },
    { tip: 'A dew heater strap on your lens or telescope objective prevents dew from fogging optics on humid nights. Essential for multi-hour sessions.', category: 'Equipment' },
    { tip: 'An intervalometer lets you take dozens of exposures hands-free for stacking or time-lapses. Even cheap ones work well — the camera does the hard work.', category: 'Equipment' },
    { tip: 'An equatorial or alt-az tracking mount eliminates star trails in long exposures. Even a simple star tracker (Sky-Watcher Star Adventurer, iOptron SkyGuider) transforms wide-field shots.', category: 'Equipment' },
    { tip: 'Use a red flashlight to preserve night vision. Your eyes take 20–30 minutes to fully dark-adapt; a single white light flash resets the clock.', category: 'Field Technique' },
    { tip: 'Give your camera 20–30 minutes to cool down to ambient temperature before shooting. Warm sensors in cold air produce more thermal noise.', category: 'Camera Settings' },
    { tip: 'Shoot multiple exposures and stack them to reduce noise. Free tools like DeepSkyStacker (Windows) or Siril (cross-platform) automate this process.', category: 'Post-Processing' },
    { tip: 'In Lightroom or Photoshop, start post-processing with noise reduction before increasing exposure or contrast — this prevents amplifying noise alongside the signal.', category: 'Post-Processing' },
    { tip: 'Star trails require 30–60+ continuous exposures. Use an app like Startrails or StarStax to stack them into a single image showing full arcs.', category: 'Creative Techniques' },
    { tip: 'Point toward Polaris (North Star) for circular star trails. Point away from it for straight or diagonal streaks. Both are compelling; choose based on your composition.', category: 'Creative Techniques' },
    { tip: 'Light pollution gradients show up as orange or gray glows from cities. Shoot when the source is behind you, or use a light pollution filter (L-Pro, CLS) to reduce it.', category: 'Light Pollution' },
    { tip: 'Dark sky finder apps like Light Pollution Map or Clear Outside help you find nearby dark sky sites. Even 30 miles from a city can dramatically improve your shots.', category: 'Light Pollution' },
    { tip: 'March–September is Milky Way season in the Northern Hemisphere. The galactic core rises above the horizon and is most dramatic at 1–3 AM local time in spring.', category: 'Seasonal Targets' },
    { tip: 'Winter skies offer Orion Nebula (M42), the Pleiades cluster, and excellent transparency due to dry cold air. Bundle up — cold fingers make camera adjustments miserable.', category: 'Seasonal Targets' },
    { tip: 'The Andromeda Galaxy (M31) is the farthest object visible to the naked eye at 2.5 million light-years. Find it in the autumn sky north of the Great Square of Pegasus.', category: 'Targets' },
    { tip: 'Jupiter and Saturn reward even basic DSLR setups. A 300mm+ telephoto shows Jupiter\'s moons as dots; a 1000mm equivalent begins to show Saturn\'s rings.', category: 'Planetary Imaging' },
    { tip: 'A histogram is your best exposure tool in the dark. Aim to push the histogram right without clipping highlights — this gives you the best signal-to-noise ratio.', category: 'Camera Settings' },
    { tip: 'Calibration frames — darks, flats, and bias — dramatically improve stacked images by removing sensor noise patterns and lens vignetting. Take them every session.', category: 'Post-Processing' },
    { tip: 'Foreground elements — trees, silos, a telescope silhouette — anchor Milky Way images and provide scale. Shoot the foreground at blue hour before full dark for natural color.', category: 'Composition' },
    { tip: 'The rule of thirds applies to night sky photography too. Place the horizon in the lower third, Milky Way core in the upper portion, and the brightest region slightly off-center.', category: 'Composition' },
    { tip: 'Patience is your most important tool. The best seeing conditions, the clearest skies, and the most dramatic Milky Way rise all require waiting. Plan around moonrise/set times.', category: 'Field Technique' },
    { tip: 'Smartphone apps like SkySafari, Stellarium, or PhotoPills let you pre-visualize exactly where the Milky Way will be at any location, date, and time. Plan your shot in advance.', category: 'Planning' },
    { tip: 'Shoot during new moon week for the darkest skies. A full moon brightens the sky enough to wash out faint nebulae and drastically cut Milky Way contrast.', category: 'Planning' },
    { tip: 'Star clusters and nebulae are often better targets for beginners than galaxies. The Orion Nebula, Pleiades, and Omega Centauri show stunning detail with modest equipment.', category: 'Targets' },
    { tip: 'JPEG white balance is baked in permanently. In RAW, you can shift white balance in post to reveal the true amber-to-blue tones of a dark sky without quality loss.', category: 'Post-Processing' }
  ];

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));

  return tips[dayOfYear % tips.length];
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
promises.push(fetchVisiblePlanets());
promises.push(fetchHoroscopes());
promises.push(fetchISSPasses());

Promise.all(promises).then((results) => {
  // Extract results: quote is 6th from end, apod is 5th from end, weather is 4th from end, planets is 3rd from end, horoscopes is 2nd from end, iss is last
  const quote = results[results.length - 6];
  const apod = results[results.length - 5];
  const weather = results[results.length - 4];
  const planets = results[results.length - 3];
  const horoscopes = results[results.length - 2];
  const issPasses = results[results.length - 1];
  const feeds = results.slice(0, results.length - 6);

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

  // Get upcoming meteor showers
  const meteorShowers = getUpcomingMeteorShowers();

  // Get daily astrophotography tip
  const astroTip = getAstroPhotographyTip();

  // Get current date/time info
  const now = new Date();
  const dateTimeInfo = {
    date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };

  output = templates.document(output, galleryImages, quote, dateTimeInfo, apod, horoscopes, weather, planets, issPasses, meteorShowers, astroTip);

  // Copy images to dist folder
  copyImages();

  createFile('./dist/index.html', output)
});