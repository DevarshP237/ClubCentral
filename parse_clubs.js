const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/source_scraped.html', 'utf8');

const clubsStart = html.indexOf('Tab 5');
const clubsContent = html.substring(clubsStart);

// Let's find all club names and descriptions
// Look for headings and paragraphs in clubsContent
const pRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>([\s\S]*?)(?=<h[1-6]|$)/gi;
let m;
const extracted = [];
while ((m = pRegex.exec(clubsContent)) !== null) {
  const title = m[1].replace(/<[^>]+>/g, '').trim();
  const body = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (title && title.length < 60 && body.length > 20) {
    extracted.push({ title, body: body.slice(0, 300) });
  }
}

console.log('Extracted clubs count:', extracted.length);
extracted.forEach((e, idx) => {
  console.log(`[${idx + 1}] ${e.title} -> ${e.body}\n`);
});
