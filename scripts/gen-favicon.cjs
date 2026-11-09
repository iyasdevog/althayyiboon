const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  let sharp;
  try {
    sharp = require('sharp');
    const svgPath = path.join(__dirname, '../public/favicon.svg');
    const svg = fs.readFileSync(svgPath);
    const sizes = [192, 512];
    for (const size of sizes) {
      await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, `../public/favicon-${size}.png`));
      console.log(`Generated favicon-${size}.png`);
    }
  } catch (e) {
    console.error('sharp not available:', e.message);
    console.log('Please install sharp: npm install sharp');
  }
}

generateFavicons();

