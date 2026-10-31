const fs = require('fs');
const https = require('https');

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

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false, timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => resolve(''));
  });
}

async function scrapeAll() {
  const results = {};
  console.log(`Starting scrape of ${clubsList.length} club subpages...`);

  for (const c of clubsList) {
    const url = `https://lavasa.christuniversity.in/center/C/CLB/${c.slug}`;
    console.log(`Fetching: ${c.name} (${url})`);
    const html = await fetchPage(url);
    if (!html) {
      console.log(`  Failed or empty: ${c.name}`);
      results[c.id] = { url, error: 'Empty response' };
      continue;
    }

    // Extract JSON-LD
    let jsonldData = null;
    const m = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (m) {
      try {
        jsonldData = JSON.parse(m[1]);
      } catch (e) {}
    }

    // Extract objectives or about text
    let objectives = [];
    const objMatch = html.match(/Objectives([\s\S]*?)(?=Our Signature|Vision|Mission|Gallery|Contact|$)/i);
    if (objMatch) {
      const text = objMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      objectives.push(text.slice(0, 500));
    }

    // Extract Vision / Mission if present
    let vision = '';
    const vMatch = html.match(/Vision[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    if (vMatch) {
      vision = vMatch[1].replace(/<[^>]+>/g, '').trim();
    }

    // Extract coordinators if not in jsonld
    let coordinators = [];
    if (jsonldData && jsonldData['@graph']) {
      const org = jsonldData['@graph'].find(g => g['@type'] === 'Organization');
      if (org && org.member) {
        coordinators = org.member.map(mem => ({
          role: mem.roleName,
          name: mem.member ? mem.member.name : '',
          title: mem.member ? mem.member.jobTitle : ''
        }));
      }
    }

    results[c.id] = {
      name: c.name,
      url,
      jsonld: jsonldData,
      coordinators,
      objectives,
      vision
    };
  }

  fs.writeFileSync('C:/Education/Websites/ClubCentral/scraped_clubs_full.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Successfully saved scraped_clubs_full.json');
}

scrapeAll();
