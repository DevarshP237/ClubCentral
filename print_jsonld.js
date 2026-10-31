const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/trekkers_subpage.html', 'utf8');

const m = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
if (m) {
  try {
    const json = JSON.parse(m[1]);
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.log('JSON parse error:', e.message);
    console.log(m[1].slice(0, 2000));
  }
}
