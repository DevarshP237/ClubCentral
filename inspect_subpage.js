const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/trekkers_subpage.html', 'utf8');

// Look for headings and content sections
const headings = [...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(h => h.length > 0);
console.log('Headings on Trekkers subpage:', headings.slice(0, 30));

// Look for faculty, coordinators, events, objectives, mission
['Faculty', 'Coordinator', 'Objective', 'Vision', 'Mission', 'Events', 'About', 'Team', 'Gallery', 'Registration', 'Contact'].forEach(term => {
  const idx = html.toLowerCase().indexOf(term.toLowerCase());
  if (idx !== -1) {
    console.log(`\n--- Found term: ${term} at index ${idx} ---`);
    console.log(html.substring(idx - 100, idx + 400).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  }
});
