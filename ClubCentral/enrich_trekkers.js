const fs = require('fs');

const d = JSON.parse(fs.readFileSync('C:/Education/Websites/ClubCentral/scraped_deep_details.json', 'utf8'));

// Special manual enrichments for Trekkers (which used ltk-page)
d['lavasa-trekkers'].about = "Building a community that discovers nature while preserving it for future generations through trekking, outdoor activities, mountain clean-ups, and conservation.";
d['lavasa-trekkers'].slogan = "Explore. Experience. Trek Together.";
d['lavasa-trekkers'].email = "trekkers.lavasa@christuniversity.in";
d['lavasa-trekkers'].instagram = "https://www.instagram.com/lavasa_trekkers/";
d['lavasa-trekkers'].objectives = "01 Outdoor Exploration & Well-being (Physical fitness, mental wellness, adventure through regular treks). 02 Environmental Awareness (Sustainable, eco-friendly trekking habits, Western Ghats conservation). 03 Leadership & Teamwork (Planning and communication skills through student-led initiatives). 04 Community & Belonging (Shared outdoor experiences connecting students and faculty). Signature Initiative: One Student, One Trek.";
d['lavasa-trekkers'].team = "Faculty Coordinators: Dr. Sneha Babu (Assistant Professor), Dr. Anita Kumari (Assistant Professor). Administrative Staff: Alanso Mathew (Administrative Assistant).";

fs.writeFileSync('C:/Education/Websites/ClubCentral/scraped_deep_details_enriched.json', JSON.stringify(d, null, 2), 'utf8');
console.log('Saved scraped_deep_details_enriched.json');
