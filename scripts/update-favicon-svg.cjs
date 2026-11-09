const fs = require('fs');
const path = require('path');

const buf = fs.readFileSync(path.join(__dirname, '../public/brand-icon.png'));
const b64 = buf.toString('base64');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#020c18"/>
  <image x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${b64}"/>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svg.trim());
console.log('✓ favicon.svg successfully updated with new brand emblem!');
