const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/source_scraped.html', 'utf8');

const start = html.indexOf('ad27ru-grid');
console.log('ad27ru-grid index:', start);
const slice = html.substring(start, start + 40000);
fs.writeFileSync('C:/Education/Websites/ClubCentral/clubs_grid_slice.html', slice, 'utf8');
console.log('Saved clubs_grid_slice.html, length:', slice.length);
