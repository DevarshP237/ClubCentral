const fs = require('fs');

const clubsList = [
  { id: 'lavasa-trekkers', slug: 'lavasatrekkers', name: 'Lavasa Trekkers' },
  { id: 'readers-club', slug: 'readers', name: 'Readers Club' },
  { id: 'art-and-creative-club', slug: 'artsandcreative', name: 'Art & Creative Club' },
  { id: 'rotaract-club', slug: 'rotaract', name: 'Rotaract Club' },
  { id: 'inclusiverse', slug: 'inclusiverse', name: 'Inclusiverse' },
  { id: 'yogadhyanam-club', slug: 'yogadhyanam', name: 'Yogadhyanam Club' },
  { id: 'lavasa-dance-academy', slug: 'dance-academy', name: 'Lavasa Dance Academy' },
  { id: 'inherito-club', slug: 'inherito', name: 'Inherito Club' },
  { id: 'under-25', slug: 'under25', name: 'Under 25' },
  { id: 'avian-allies', slug: 'avianallies', name: 'Avian Allies' },
  { id: 'macguffin-film-club', slug: 'macguffin', name: 'MacGuffin Film Club' },
  { id: 'quest-reach', slug: 'questreach', name: 'Quest Reach' },
  { id: 'solace-circle', slug: 'solacecircle', name: 'Solace Circle' },
  { id: 'speaksphere', slug: 'speaksphere', name: 'Speaksphere' },
  { id: 'lavasa-running-club', slug: 'running', name: 'Lavasa Running Club' },
  { id: 'lavasa-music-academy', slug: 'lavasamusicacademy', name: 'Lavasa Music Academy' },
  { id: 'christ-equestrian-club', slug: 'equestrian', name: 'Christ Equestrian Club' },
  { id: 'pika-play', slug: 'pikaplay', name: 'Pika Play' },
  { id: 'global-academic-club', slug: 'globalacademic', name: 'Global Academic Club' },
  { id: 'nature-club', slug: 'natures', name: 'Nature Club' },
  { id: 'photography-club', slug: 'photography', name: 'Photography Club' },
  { id: 'varsity-esports', slug: 'varsityclub', name: 'Varsity E-Sports' },
  { id: 'econovation-club', slug: 'econovation', name: 'Econovation Club' }
];

async function extractAllDetails() {
  const extracted = {};

  for (const club of clubsList) {
    const url = `https://lavasa.christuniversity.in/center/C/CLB/${club.slug}`;
    console.log(`Extracting: ${club.name}...`);
    try {
      const resp = await fetch(url);
      const text = await resp.text();

      // Find overview section
      const overviewIdx = text.indexOf('overview-section');
      const content = overviewIdx !== -1 ? text.substring(overviewIdx, overviewIdx + 20000) : text;

      // Extract About
      let about = '';
      const aboutMatch = content.match(/About (?:the )?Club[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) ||
                         content.match(/About (?:the )?Club\s*<\/h\d+>([\s\S]*?)<\/div>/i);
      if (aboutMatch) {
        about = aboutMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Extract Objectives
      let objectives = [];
      const objMatch = content.match(/Objectives?([\s\S]*?)(?=Events?|Team|Vision|Mission|Gallery|Contact|<footer|$)/i);
      if (objMatch) {
        const rawObj = objMatch[1].replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        objectives = rawObj.slice(0, 1000);
      }

      // Extract Team / Coordinators
      let team = [];
      const teamMatch = content.match(/Our Team([\s\S]*?)(?=Objectives?|Events?|Vision|Mission|Gallery|Contact|<footer|$)/i);
      if (teamMatch) {
        const rawTeam = teamMatch[1].replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        team = rawTeam.slice(0, 600);
      }

      // Extract JSON-LD if present
      let email = null;
      let instagram = null;
      let slogan = null;
      let faculty = [];

      const m = text.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (m) {
        try {
          const j = JSON.parse(m[1]);
          if (j['@graph']) {
            const org = j['@graph'].find(g => g['@type'] === 'Organization');
            if (org) {
              email = org.email || null;
              slogan = org.slogan || null;
              if (org.sameAs && org.sameAs.length) instagram = org.sameAs[0];
              if (org.member) {
                faculty = org.member.map(mem => `${mem.roleName}: ${mem.member ? mem.member.name : ''} (${mem.member ? mem.member.jobTitle : ''})`);
              }
            }
          }
        } catch(e) {}
      }

      extracted[club.id] = {
        id: club.id,
        name: club.name,
        slug: club.slug,
        officialUrl: url,
        about,
        objectives,
        team,
        email,
        instagram,
        slogan,
        faculty
      };
    } catch(e) {
      console.log(`Failed ${club.name}:`, e.message);
    }
  }

  fs.writeFileSync('C:/Education/Websites/ClubCentral/scraped_deep_details.json', JSON.stringify(extracted, null, 2), 'utf8');
  console.log('Saved scraped_deep_details.json!');
}

extractAllDetails();
