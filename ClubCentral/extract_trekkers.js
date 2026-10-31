const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/trekkers_subpage.html', 'utf8');

// Find script type="application/ld+json" or similar
const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
console.log('JSON-LD scripts found:', jsonLdMatches.length);
jsonLdMatches.forEach((m, idx) => {
  console.log(`\n=== JSON-LD ${idx + 1} ===`);
  console.log(m[1].slice(0, 1500));
});

// Also find the main container in the page
const ltkMainIdx = html.indexOf('ltk-page');
if (ltkMainIdx !== -1) {
  console.log('\n=== ltk-page found! ===');
  console.log(html.substring(ltkMainIdx, ltkMainIdx + 3000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
