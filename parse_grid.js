const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/clubs_grid_slice.html', 'utf8');

const regex = /<div class="ad27ru-club">([\s\S]*?)<\/div>\s*<\/div>/gi;
// Or let's look for ad27ru-title and ad27ru-desc
const titles = [...html.matchAll(/class="ad27ru-title">([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const descs = [...html.matchAll(/class="ad27ru-desc">([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const imgs = [...html.matchAll(/<img[^>]*src="([^"]*)"/gi)].map(m => m[1]);
const links = [...html.matchAll(/href="([^"]*center\/C\/CLB\/[^"]*)"/gi)].map(m => m[1]);

console.log('Found titles:', titles.length);
console.log('Found descs:', descs.length);
console.log('Found links:', links.length);

titles.forEach((t, i) => {
  console.log(`\n=== [${i+1}] ${t} ===`);
  console.log('Link:', links[i] || 'N/A');
  console.log('Desc:', descs[i] || 'N/A');
});
