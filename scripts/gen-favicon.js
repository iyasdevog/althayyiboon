// Script to generate favicon PNGs from favicon.svg using sharp
// Run: node scripts/gen-favicon.js

const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('sharp not found, trying canvas...');
    return generateWithCanvas();
  }

  const svgPath = path.join(__dirname, '../public/favicon.svg');
  const svg = fs.readFileSync(svgPath);

  const sizes = [192, 512];
  for (const size of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../public/favicon-${size}.png`));
    console.log(`✓ Generated favicon-${size}.png`);
  }
}

async function generateWithCanvas() {
  const { createCanvas } = require('canvas');
  const { Canvg } = require('canvg');

  const svgContent = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'), 'utf8');
  const sizes = [192, 512];

  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const v = await Canvg.from(ctx, svgContent, { ignoreMouse: true, ignoreAnimation: true });
    v.resize(size, size);
    await v.render();
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, `../public/favicon-${size}.png`), buffer);
    console.log(`✓ Generated favicon-${size}.png`);
  }
}

generateFavicons().catch(console.error);

