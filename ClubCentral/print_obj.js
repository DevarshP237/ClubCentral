const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/trekkers_subpage.html', 'utf8');

// Find the section that contains objectives and description
const objIdx = html.indexOf('What We Pursue');
if (objIdx !== -1) {
  console.log(html.substring(objIdx - 200, objIdx + 2000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
