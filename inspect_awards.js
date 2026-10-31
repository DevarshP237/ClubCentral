const fs = require('fs');
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/source_scraped.html', 'utf8');

const awardCardsIndex = html.indexOf('award-card');
console.log('award-card index:', awardCardsIndex);
const slice = html.substring(awardCardsIndex, awardCardsIndex + 15000);
fs.writeFileSync('C:/Education/Websites/ClubCentral/award_cards_slice.html', slice, 'utf8');
console.log('Saved award_cards_slice.html');
