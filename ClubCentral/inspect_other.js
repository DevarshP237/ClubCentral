const fs = require('fs');

async function inspectOtherSubpages() {
  const slugs = ['dance-academy', 'econovation', 'pikaplay', 'readers', 'rotaract', 'varsityclub'];
  for (const slug of slugs) {
    const url = `https://lavasa.christuniversity.in/center/C/CLB/${slug}`;
    try {
      const resp = await fetch(url);
      const text = await resp.text();
      // find title or content in each-content-wrapper
      const mainIdx = text.indexOf('each-content-wrapper');
      console.log(`\n=== Slug: ${slug} (length ${text.length}) ===`);
      if (mainIdx !== -1) {
        const slice = text.substring(mainIdx, mainIdx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        console.log(slice.slice(0, 400));
      } else {
        console.log('No each-content-wrapper found');
      }
    } catch(e) {
      console.log('Error:', e.message);
    }
  }
}

inspectOtherSubpages();
