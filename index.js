const fs = require('fs');
const path = require('path');
let Parser = require('rss-parser');
const templates = require('./templates.js');
let parser = new Parser();
const promises = [];
const sources = JSON.parse(fs.readFileSync('sources.json'));

// Create the requried folders
fs.mkdir(`./dist`, () => {});

// Function to get a random image from gallery
function getRandomGalleryImage() {
  const galleryDir = './images/gallery/';
  try {
    const files = fs.readdirSync(galleryDir);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      return null; // No images found
    }

    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    return `images/gallery/${randomImage}`;
  } catch (err) {
    console.log('No gallery images found');
    return null;
  }
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
    promises.push(parser.parseURL(item.url))
  });
});

Promise.all(promises).then((feeds) => {
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

  // Get random gallery image
  const galleryImage = getRandomGalleryImage();

  output = templates.document(output, galleryImage);

  // Copy images to dist folder
  copyImages();

  createFile('./dist/index.html', output)
});