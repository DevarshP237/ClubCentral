const fs = require('fs');

const deepData = JSON.parse(fs.readFileSync('C:/Education/Websites/ClubCentral/scraped_deep_details_enriched.json', 'utf8'));

// Creative callouts tailored for each club
const creativeCTAs = {
  'lavasa-trekkers': {
    headline: "Ready to be part of the next expedition?",
    subline: "Pack your rucksack, tie your boots, and explore the undiscovered peaks and mist-laden waterfalls of the Sahyadri valley.",
    buttonLabel: "Claim Your Trek Pass →",
    actionPlaceholder: "Expedition Registration"
  },
  'readers-club': {
    headline: "Ready to turn the page and enter the circle?",
    subline: "Whether you devour classic fiction, modern philosophy, or speculative sci-fi — find fellow bibliophiles who read between the lines.",
    buttonLabel: "Join the Literary Circle →",
    actionPlaceholder: "Reader Intake"
  },
  'art-and-creative-club': {
    headline: "Ready to paint your canvas and leave your mark?",
    subline: "From live murals to digital concept art and sustainable crafts — unleash your creative imagination across the Lavasa campus.",
    buttonLabel: "Ignite Your Artistry →",
    actionPlaceholder: "Artist Registration"
  },
  'rotaract-club': {
    headline: "Ready to lead impactful change and serve the community?",
    subline: "Step into youth leadership, execute high-impact social initiatives, and build a global network of compassionate changemakers.",
    buttonLabel: "Become a Rotaractor →",
    actionPlaceholder: "Fellowship Induction"
  },
  'inclusiverse': {
    headline: "Ready to build a world where everyone belongs?",
    subline: "Empower specially-abled children, champion neurodiversity, and craft life-changing adaptive sports and cultural experiences.",
    buttonLabel: "Champion Inclusion →",
    actionPlaceholder: "Volunteer Intake"
  },
  'yogadhyanam-club': {
    headline: "Ready to find stillness amidst the Sahyadri mountains?",
    subline: "Balance academic intensity with ancient yogic mindfulness, breathwork, and deep restorative tranquility.",
    buttonLabel: "Begin Your Practice →",
    actionPlaceholder: "Mindfulness Enrollment"
  },
  'lavasa-dance-academy': {
    headline: "Ready to step into the rhythm and own the stage?",
    subline: "Master classical foundations, contemporary choreography, and electrifying street dance with Lavasa's premier dance crew.",
    buttonLabel: "Join the Dance Ensemble →",
    actionPlaceholder: "Audition Registration"
  },
  'inherito-club': {
    headline: "Ready to scale your family enterprise into the future?",
    subline: "Learn next-generation governance, modern venture scaling, and connect with business leaders steering multi-generational legacies.",
    buttonLabel: "Enter the Legacy →",
    actionPlaceholder: "Member Registration"
  },
  'under-25': {
    headline: "Ready to plug into India's largest youth culture movement?",
    subline: "Create, curate, and celebrate youth creativity, campus festivals, and digital innovation with the official Under 25 chapter.",
    buttonLabel: "Ignite Under 25 →",
    actionPlaceholder: "Crew Induction"
  },
  'avian-allies': {
    headline: "Ready to take wing and track the rare birds of the Western Ghats?",
    subline: "From Indian Pittas to Malabar Grey Hornbills, grab your binoculars and discover the vibrant avian sanctuary of Lavasa.",
    buttonLabel: "Grab Your Binoculars →",
    actionPlaceholder: "Birder Registration"
  },
  'macguffin-film-club': {
    headline: "Ready to write, shoot, and direct cinematic stories?",
    subline: "Analyze auteur cinema, write screenplay drafts, and collaborate on short film productions under the Sahyadri skies.",
    buttonLabel: "Roll Camera & Join →",
    actionPlaceholder: "Crew Intake"
  },
  'quest-reach': {
    headline: "Ready to publish, innovate, and pioneer original research?",
    subline: "Equip yourself with advanced methodology, data science toolkits, and academic paper co-authorship for peer-reviewed journals.",
    buttonLabel: "Begin Your Inquiry →",
    actionPlaceholder: "Researcher Registration"
  },
  'solace-circle': {
    headline: "Ready to find a safe haven and empower your peers?",
    subline: "A confidential, supportive student sanctuary dedicated to active listening, mental wellness, and community warmth.",
    buttonLabel: "Step into the Circle →",
    actionPlaceholder: "Peer Support Intake"
  },
  'speaksphere': {
    headline: "Ready to command the podium and amplify your voice?",
    subline: "Overcome stage hesitation, conquer parliamentary debates, and master articulate keynote delivery that moves audiences.",
    buttonLabel: "Take the Mic →",
    actionPlaceholder: "Orator Induction"
  },
  'lavasa-running-club': {
    headline: "Ready to lace up and conquer the sunrise valley trails?",
    subline: "From 5K sunrise dashes to marathon prep along the Dasve lakeshore — train your endurance with a passionate community.",
    buttonLabel: "Start Your Stride →",
    actionPlaceholder: "Runner Registration"
  },
  'lavasa-music-academy': {
    headline: "Ready to strike a chord and make the valley sing?",
    subline: "Jam with instrumentalists, record acoustic tracks, vocalize with choral ensembles, and teach young talents via Little Harmonies.",
    buttonLabel: "Audition & Jam Now →",
    actionPlaceholder: "Musician Intake"
  },
  'christ-equestrian-club': {
    headline: "Ready to mount up and master the art of horsemanship?",
    subline: "Experience the discipline, grace, and athletic bond of equestrian training under certified physical education mentorship.",
    buttonLabel: "Ride with Us →",
    actionPlaceholder: "Rider Registration"
  },
  'pika-play': {
    headline: "Ready to unleash your fandom and conquer game night?",
    subline: "From Super Smash scrims to anime screenings, manga exchanges, and cosplay showcases — your guild is assembled.",
    buttonLabel: "Join the Guild →",
    actionPlaceholder: "Gamer & Anime Intake"
  },
  'global-academic-club': {
    headline: "Ready to map your path to Ivy League and Oxford?",
    subline: "Receive curated guidance on GRE/GMAT prep, statement of purpose drafting, and Ivy League graduate fellowship admissions.",
    buttonLabel: "Chart Your Journey →",
    actionPlaceholder: "Fellowship Advisory"
  },
  'nature-club': {
    headline: "Ready to guard the biodiversity of the Western Ghats?",
    subline: "Spearhead sapling plantation, biodiversity tracking, lake conservation drives, and sustainable green campus initiatives.",
    buttonLabel: "Join the Eco Guard →",
    actionPlaceholder: "Eco Volunteer Intake"
  },
  'photography-club': {
    headline: "Ready to capture the light and tell stories through your lens?",
    subline: "Master manual aperture, golden hour landscape shooting, street photojournalism, and studio editing masterclasses.",
    buttonLabel: "Frame the Moment →",
    actionPlaceholder: "Photographer Intake"
  },
  'varsity-esports': {
    headline: "Ready to join the collegiate roster and dominate scrims?",
    subline: "Compete in Valorant, BGMI, and FIFA inter-university tournaments, or learn game engine mechanics with student developers.",
    buttonLabel: "Enter the Arena →",
    actionPlaceholder: "Esports Tryouts"
  },
  'econovation-club': {
    headline: "Ready to decode global markets, policy, and financial innovation?",
    subline: "Debate central bank policies, analyze algorithmic markets, and build financial models that explain global macroeconomic trends.",
    buttonLabel: "Join the Analysts →",
    actionPlaceholder: "Economist Intake"
  }
};

// Base club metadata
const baseClubs = [
  { id: "lavasa-trekkers", logo: "assets/logos/2.png", category: "Outdoor Adventure", logoNum: "2" },
  { id: "readers-club", logo: "assets/logos/3.png", category: "Literature & Arts", logoNum: "3" },
  { id: "art-and-creative-club", logo: "assets/logos/4.png", category: "Arts & Creativity", logoNum: "4" },
  { id: "rotaract-club", logo: "assets/logos/5.png", category: "Community & Service", logoNum: "5" },
  { id: "inclusiverse", logo: "assets/logos/6.png", category: "Community & Service", logoNum: "6" },
  { id: "yogadhyanam-club", logo: "assets/logos/7.png", category: "Health & Wellness", logoNum: "7" },
  { id: "lavasa-dance-academy", logo: "assets/logos/23_.png", category: "Performing Arts", logoNum: "23_" },
  { id: "inherito-club", logo: "assets/logos/8.png", category: "Entrepreneurship", logoNum: "8" },
  { id: "under-25", logo: "assets/logos/1.png", category: "Youth & Culture", logoNum: "1" },
  { id: "avian-allies", logo: "assets/logos/9.png", category: "Wildlife & Nature", logoNum: "9" },
  { id: "macguffin-film-club", logo: "assets/logos/10.png", category: "Cinema & Media", logoNum: "10" },
  { id: "quest-reach", logo: "assets/logos/11.png", category: "Academic & Research", logoNum: "11" },
  { id: "solace-circle", logo: "assets/logos/12.png", category: "Mental Well-being", logoNum: "12" },
  { id: "speaksphere", logo: "assets/logos/13.png", category: "Oratory & Debate", logoNum: "13" },
  { id: "lavasa-running-club", logo: "assets/logos/14.png", category: "Sports & Fitness", logoNum: "14" },
  { id: "lavasa-music-academy", logo: "assets/logos/15.png", category: "Music & Audio", logoNum: "15" },
  { id: "christ-equestrian-club", logo: "assets/logos/16.png", category: "Sports & Fitness", logoNum: "16" },
  { id: "pika-play", logo: "assets/logos/22.png", category: "Gaming & Anime", logoNum: "22" },
  { id: "global-academic-club", logo: "assets/logos/17.png", category: "Academic & Research", logoNum: "17" },
  { id: "nature-club", logo: "assets/logos/18.png", category: "Environment & Ecology", logoNum: "18" },
  { id: "photography-club", logo: "assets/logos/19.png", category: "Visual Arts", logoNum: "19" },
  { id: "varsity-esports", logo: "assets/logos/20.png", category: "Gaming & Esports", logoNum: "20" },
  { id: "econovation-club", logo: "assets/logos/21.png", category: "Economics & Innovation", logoNum: "21" }
];

// Read parsed grid for descriptions from source
const html = fs.readFileSync('C:/Education/Websites/ClubCentral/clubs_grid_slice.html', 'utf8');
const titles = [...html.matchAll(/class="ad27ru-title">([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const descs = [...html.matchAll(/class="ad27ru-desc">([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

const compiledClubs = baseClubs.map((b, idx) => {
  const d = deepData[b.id] || {};
  const cta = creativeCTAs[b.id] || {
    headline: "Ready to join the community?",
    subline: "Register your interest and take part in upcoming campus activities.",
    buttonLabel: "Join Now →",
    actionPlaceholder: "Membership Registration"
  };

  const name = titles[idx] || d.name || b.id;
  const officialDesc = descs[idx] || d.about || "";
  const officialUrl = d.officialUrl || `https://lavasa.christuniversity.in/center/C/CLB/${b.id}`;

  return {
    id: b.id,
    name: name,
    shortDescription: officialDesc,
    fullDescription: officialDesc,
    detailedAbout: d.about && d.about.length > 20 ? d.about : officialDesc,
    objectives: d.objectives || "Details coming soon from faculty mentors.",
    team: d.team || "Details coming soon from student council coordinators.",
    category: b.category,
    type: "Student Club",
    badge: b.category,
    logoImage: b.logo,
    officialUrl: officialUrl,
    email: d.email || `${b.id.replace('-club', '')}.lavasa@christuniversity.in`,
    instagram: d.instagram || null,
    slogan: d.slogan || null,
    creativeCTA: cta,
    isFeatured: [
      'lavasa-trekkers',
      'varsity-esports',
      'pika-play',
      'inclusiverse',
      'lavasa-music-academy',
      'macguffin-film-club'
    ].includes(b.id),
    status: "Active"
  };
});

const outJs = `/**
 * ClubCentral — Christ University Pune Lavasa Campus
 * Official 23 Student Clubs Dataset
 * Source of truth: https://lavasa.christuniversity.in/center/C/clubslavasa
 * Deep subpages scraped & verified.
 */

const CLUBS_DATA = ${JSON.stringify(compiledClubs, null, 2)};

const CATEGORIES = [
  "All Categories",
  "Outdoor Adventure",
  "Gaming & Esports",
  "Gaming & Anime",
  "Arts & Creativity",
  "Visual Arts",
  "Cinema & Media",
  "Music & Audio",
  "Performing Arts",
  "Community & Service",
  "Health & Wellness",
  "Mental Well-being",
  "Academic & Research",
  "Economics & Innovation",
  "Entrepreneurship",
  "Sports & Fitness",
  "Wildlife & Nature",
  "Environment & Ecology",
  "Literature & Arts",
  "Oratory & Debate",
  "Youth & Culture"
];

const INITIAL_EVENTS = [
  {
    id: "evt-01",
    title: "Western Ghats Monsoon Trail: Stage 1",
    hostGroupId: "lavasa-trekkers",
    hostGroupName: "Lavasa Trekkers",
    date: "2026-11-08",
    time: "06:30 AM - 11:30 AM",
    location: "Dasve Lakeside Trailhead // Sahyadri Ridge",
    description: "Beginner-friendly 7.5km ridge hike exploring waterfall gullies and native flora. Mandatory safety briefing and gear check at 06:15 AM.",
    registrationLink: "club.html?id=lavasa-trekkers#enquire",
    isRegistrationOpen: true,
    category: "Outdoor Adventure"
  },
  {
    id: "evt-02",
    title: "Inter-Department Collegiate Valorant Scrims",
    hostGroupId: "varsity-esports",
    hostGroupName: "Varsity E-Sports",
    date: "2026-11-12",
    time: "05:00 PM - 09:00 PM",
    location: "Analytics Block High-Performance Lab B",
    description: "Double-elimination collegiate scrims open to all registered student teams. Streamed live with live student commentary.",
    registrationLink: "club.html?id=varsity-esports#enquire",
    isRegistrationOpen: true,
    category: "Gaming & Esports"
  },
  {
    id: "evt-03",
    title: "Anime Screening & Pop-Culture Trivia Night",
    hostGroupId: "pika-play",
    hostGroupName: "Pika Play (Anime & Games)",
    date: "2026-11-15",
    time: "06:00 PM - 08:30 PM",
    location: "Central Block Mini Auditorium",
    description: "Screening of Makoto Shinkai short films followed by multi-round team anime trivia and game showcase.",
    registrationLink: "club.html?id=pika-play#enquire",
    isRegistrationOpen: true,
    category: "Gaming & Anime"
  },
  {
    id: "evt-04",
    title: "Adaptive Sports & Art Engagement Morning",
    hostGroupId: "inclusiverse",
    hostGroupName: "Inclusiverse",
    date: "2026-11-20",
    time: "09:30 AM - 01:00 PM",
    location: "Sports Complex & Open Atrium",
    description: "Inclusive athletic drills, parachute games, and finger-painting workshops conducted alongside specially-abled children.",
    registrationLink: "club.html?id=inclusiverse#enquire",
    isRegistrationOpen: true,
    category: "Community & Service"
  },
  {
    id: "evt-05",
    title: "Acoustic Valley Sundowner Jam",
    hostGroupId: "lavasa-music-academy",
    hostGroupName: "Lavasa Music Academy",
    date: "2026-11-22",
    time: "05:30 PM - 07:30 PM",
    location: "Amphitheatre overlooking Dasve Lake",
    description: "Unplugged evening open to student vocalists, guitarists, and percussionists. Bring your acoustic instrument.",
    registrationLink: "club.html?id=lavasa-music-academy#enquire",
    isRegistrationOpen: true,
    category: "Music & Audio"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CLUBS_DATA, CATEGORIES, INITIAL_EVENTS };
}
`;

fs.writeFileSync('C:/Education/Websites/ClubCentral/js/data.js', outJs, 'utf8');
console.log('Successfully written enriched js/data.js!');
