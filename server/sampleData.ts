import { StoredMemory } from '../src/types/memory.js';

// Vintage atmospheric stadium archival artifact as an inline SVG data URI
export const VINTAGE_STADIUM_ARTIFACT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="flood" cx="50%" cy="10%" r="80%">
      <stop offset="0%" stop-color="%23FFF6D6" stop-opacity="0.9"/>
      <stop offset="25%" stop-color="%23D4AF37" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="%230A1224" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="%2304060B" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="%2304060B"/>
  <rect width="800" height="600" fill="url(%23flood)"/>
  
  <!-- Floodlight towers in distance -->
  <line x1="120" y1="80" x2="120" y2="350" stroke="%233A4A6B" stroke-width="4"/>
  <circle cx="120" cy="80" r="14" fill="%23FFF6D6" opacity="0.95"/>
  <circle cx="120" cy="80" r="45" fill="%23E5C158" opacity="0.25"/>
  
  <line x1="680" y1="80" x2="680" y2="350" stroke="%233A4A6B" stroke-width="4"/>
  <circle cx="680" cy="80" r="14" fill="%23FFF6D6" opacity="0.95"/>
  <circle cx="680" cy="80" r="45" fill="%23E5C158" opacity="0.25"/>

  <!-- Grandstand silhouettes and crowd terraces -->
  <polygon points="40,380 760,380 800,550 0,550" fill="%23070E1C" stroke="%231D2D4E" stroke-width="1"/>
  <path d="M60 420 Q400 395 740 420" stroke="%23D4AF37" stroke-width="1.5" opacity="0.4" fill="none"/>
  <path d="M40 460 Q400 435 760 460" stroke="%23D4AF37" stroke-width="1" opacity="0.3" fill="none"/>
  <path d="M20 500 Q400 475 780 500" stroke="%23D4AF37" stroke-width="1" opacity="0.2" fill="none"/>

  <!-- Silhouettes of figures: adult and child holding hands -->
  <g transform="translate(385, 430)" fill="%23030509">
    <ellipse cx="0" cy="0" rx="9" ry="10" />
    <path d="M-12 10 Q0 6 12 10 L14 55 L-14 55 Z"/>
    <ellipse cx="26" cy="18" rx="6" ry="7" />
    <path d="M18 26 Q26 23 34 26 L35 55 L17 55 Z"/>
    <path d="M8 28 Q18 32 20 30" stroke="%23030509" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Pitch markings at the lower bottom -->
  <ellipse cx="400" cy="570" rx="340" ry="25" fill="none" stroke="%231F3320" stroke-width="18" opacity="0.5"/>
  <line x1="60" y1="565" x2="740" y2="565" stroke="%23FFF" stroke-width="1.5" opacity="0.35"/>
  
  <!-- Archival stamp -->
  <rect x="580" y="520" width="180" height="50" rx="4" fill="none" stroke="%23D4AF37" stroke-width="1.5" opacity="0.6"/>
  <text x="670" y="542" font-family="monospace" font-size="11" fill="%23D4AF37" text-anchor="middle" letter-spacing="2">ARCHIVE RECORD</text>
  <text x="670" y="558" font-family="monospace" font-size="10" fill="%23CBD5E1" text-anchor="middle" letter-spacing="1.5">OCTOBER 1998 // SEC 4</text>
</svg>`;

export const KYIV_1975_ARTIFACT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="kyivSky" cx="50%" cy="15%" r="85%">
      <stop offset="0%" stop-color="%2338BDF8" stop-opacity="0.6"/>
      <stop offset="25%" stop-color="%231E3A8A" stop-opacity="0.7"/>
      <stop offset="65%" stop-color="%23070D1C" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="%23020408" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="torchGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23FDE047" stop-opacity="1"/>
      <stop offset="40%" stop-color="%23F97316" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="%23000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="%23020408"/>
  <rect width="800" height="600" fill="url(%23kyivSky)"/>
  
  <!-- Iconic four monumental floodlight masts of Republican Stadium -->
  <line x1="80" y1="40" x2="100" y2="340" stroke="%2360A5FA" stroke-width="5" opacity="0.8"/>
  <polygon points="70,30 90,30 85,50" fill="%23FFF" />
  <circle cx="80" cy="40" r="35" fill="%2360A5FA" opacity="0.3"/>
  
  <line x1="720" y1="40" x2="700" y2="340" stroke="%2360A5FA" stroke-width="5" opacity="0.8"/>
  <circle cx="720" cy="40" r="35" fill="%2360A5FA" opacity="0.3"/>

  <!-- Colossal two-tier concrete bowl terraces with 100,000 torchlights -->
  <path d="M0 320 Q400 290 800 320 L800 560 L0 560 Z" fill="%23081120"/>
  <path d="M0 380 Q400 350 800 380" stroke="%231E293B" stroke-width="2" fill="none"/>
  <path d="M0 430 Q400 405 800 430" stroke="%231E293B" stroke-width="2" fill="none"/>
  <path d="M0 480 Q400 460 800 480" stroke="%231E293B" stroke-width="2" fill="none"/>

  <!-- Flaming newspaper torches across the stands -->
  <g fill="url(%23torchGlow)">
    <circle cx="120" cy="360" r="8"/>
    <circle cx="170" cy="370" r="7"/>
    <circle cx="210" cy="355" r="9"/>
    <circle cx="260" cy="365" r="8"/>
    <circle cx="310" cy="380" r="10"/>
    <circle cx="380" cy="370" r="11"/>
    <circle cx="430" cy="365" r="9"/>
    <circle cx="490" cy="375" r="10"/>
    <circle cx="540" cy="360" r="8"/>
    <circle cx="610" cy="370" r="9"/>
    <circle cx="670" cy="365" r="7"/>
    <circle cx="710" cy="355" r="8"/>
    
    <!-- Lower tier fires -->
    <circle cx="150" cy="420" r="11"/>
    <circle cx="240" cy="425" r="9"/>
    <circle cx="350" cy="430" r="12"/>
    <circle cx="460" cy="428" r="11"/>
    <circle cx="580" cy="425" r="10"/>
    <circle cx="660" cy="420" r="8"/>
  </g>

  <!-- Father and son wrapped in Dynamo blue-and-white scarf -->
  <g transform="translate(390, 460)" fill="%23020617">
    <ellipse cx="0" cy="0" rx="10" ry="12"/>
    <path d="M-14 12 Q0 8 14 12 L16 65 L-16 65 Z"/>
    <ellipse cx="28" cy="20" rx="7" ry="8"/>
    <path d="M20 28 Q28 25 36 28 L37 65 L19 65 Z"/>
    <!-- Scarf wrapped around both -->
    <path d="M-8 20 Q15 28 35 32" stroke="%2338BDF8" stroke-width="6" stroke-linecap="round"/>
    <path d="M-6 24 Q15 32 33 36" stroke="%23FFF" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Pitch and legendary #11 running under floodlights -->
  <rect x="0" y="550" width="800" height="50" fill="%230F291E"/>
  <line x1="50" y1="560" x2="750" y2="560" stroke="%23FFF" stroke-width="2" opacity="0.4"/>
  
  <!-- Archival Stamp -->
  <rect x="520" y="515" width="245" height="55" rx="6" fill="%23020408" stroke="%2338BDF8" stroke-width="1.5" opacity="0.85"/>
  <text x="642" y="537" font-family="monospace" font-size="11" fill="%2338BDF8" text-anchor="middle" letter-spacing="2">KYIV REPUBLICAN STADIUM</text>
  <text x="642" y="555" font-family="monospace" font-size="10" fill="%23E2E8F0" text-anchor="middle" letter-spacing="1.5">OCTOBER 1975 // 100,000 TORCHES</text>
</svg>`;

export const LISBON_1967_ARTIFACT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="parchment" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23FBF6E9"/>
      <stop offset="50%" stop-color="%23F3E8CE"/>
      <stop offset="100%" stop-color="%23E8D7B0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="%23060B0E"/>
  
  <!-- Wooden desk surface backdrop -->
  <rect x="40" y="40" width="720" height="520" rx="8" fill="%231E150F" opacity="0.8" stroke="%233B2718" stroke-width="2"/>
  
  <!-- Vintage 1967 Matchday Ticket -->
  <g transform="translate(100, 110)">
    <rect width="600" height="360" rx="6" fill="url(%23parchment)" stroke="%23166534" stroke-width="3" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))"/>
    
    <!-- Perforated Tear Line -->
    <line x1="430" y1="0" x2="430" y2="360" stroke="%23854D0E" stroke-width="2" stroke-dasharray="8,6" opacity="0.6"/>
    
    <!-- Green Hoops Heritage Header -->
    <rect x="0" y="0" width="430" height="50" fill="%2315803D"/>
    <text x="215" y="32" font-family="serif" font-weight="bold" font-size="18" fill="%23FFF" text-anchor="middle" letter-spacing="3">COUPE DES CLUBS CHAMPIONS</text>
    
    <text x="215" y="105" font-family="serif" font-weight="bold" font-size="28" fill="%2314532D" text-anchor="middle" letter-spacing="2">ESTÁDIO NACIONAL</text>
    <text x="215" y="135" font-family="sans-serif" font-size="13" fill="%23713F12" text-anchor="middle" letter-spacing="3">LISBOA — 25 DE MAIO DE 1967</text>
    
    <!-- Central Match Teams -->
    <text x="130" y="195" font-family="serif" font-weight="bold" font-size="22" fill="%2315803D">CELTIC F.C.</text>
    <text x="215" y="195" font-family="serif" font-style="italic" font-size="16" fill="%239A3412" text-anchor="middle">v.</text>
    <text x="250" y="195" font-family="serif" font-weight="bold" font-size="22" fill="%231E3A8A">F.C. INTERNAZIONALE</text>
    
    <!-- Four Leaf Clover Archival Symbol -->
    <g transform="translate(195, 225)" fill="%2316A34A" opacity="0.85">
      <circle cx="10" cy="10" r="10"/>
      <circle cx="30" cy="10" r="10"/>
      <circle cx="10" cy="30" r="10"/>
      <circle cx="30" cy="30" r="10"/>
      <path d="M20 25 Q20 50 12 55" stroke="%2315803D" stroke-width="3" fill="none"/>
    </g>
    
    <text x="215" y="325" font-family="monospace" font-size="12" fill="%233F3F46" text-anchor="middle" letter-spacing="2">ENTRADA GERAL // PORTÃO B</text>
    
    <!-- Stub Section -->
    <rect x="430" y="0" width="170" height="50" fill="%23166534"/>
    <text x="515" y="32" font-family="sans-serif" font-weight="bold" font-size="14" fill="%23FFF" text-anchor="middle" letter-spacing="1">TALÃO</text>
    <text x="515" y="120" font-family="monospace" font-size="13" fill="%2314532D" text-anchor="middle">BANCADA</text>
    <text x="515" y="150" font-family="serif" font-weight="bold" font-size="32" fill="%2315803D" text-anchor="middle">EAST</text>
    <text x="515" y="220" font-family="monospace" font-size="11" fill="%23713F12" text-anchor="middle">SEC. 3 • LUG. 67</text>
    <text x="515" y="310" font-family="monospace" font-size="14" font-weight="bold" fill="%23B91C1C" text-anchor="middle" letter-spacing="2">★ 2 - 1 ★</text>
  </g>
</svg>`;

export const CAMP_NOU_1999_ARTIFACT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="campSky" cx="50%" cy="10%" r="80%">
      <stop offset="0%" stop-color="%23FACC15" stop-opacity="0.8"/>
      <stop offset="20%" stop-color="%23DC2626" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="%230F172A" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="%23020617" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="%23020617"/>
  <rect width="800" height="600" fill="url(%23campSky)"/>
  
  <!-- Massive Camp Nou grandstand tiers ascending to the heavens -->
  <path d="M0 250 Q400 210 800 250 L800 550 L0 550 Z" fill="%230A1120"/>
  <path d="M0 310 Q400 270 800 310" stroke="%23DC2626" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M0 370 Q400 330 800 370" stroke="%23FACC15" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M0 430 Q400 400 800 430" stroke="%23DC2626" stroke-width="2" fill="none" opacity="0.6"/>
  
  <!-- Massive Scoreboard Tower showing 90+3' -->
  <rect x="290" y="70" width="220" height="110" rx="8" fill="%23000" stroke="%23E2E8F0" stroke-width="2" filter="drop-shadow(0 0 25px rgba(220,38,38,0.5))"/>
  <text x="400" y="105" font-family="monospace" font-size="14" fill="%2394A3B8" text-anchor="middle" letter-spacing="3">CHAMPIONS LEAGUE 1999</text>
  <text x="350" y="145" font-family="monospace" font-weight="bold" font-size="28" fill="%23DC2626" text-anchor="middle">MNU 2</text>
  <text x="400" y="145" font-family="monospace" font-size="20" fill="%2364748B" text-anchor="middle">-</text>
  <text x="450" y="145" font-family="monospace" font-weight="bold" font-size="28" fill="%2393C5FD" text-anchor="middle">1 FCB</text>
  <text x="400" y="170" font-family="monospace" font-weight="bold" font-size="14" fill="%2322C55E" text-anchor="middle" letter-spacing="4">TIME: 90+3'</text>

  <!-- Cascading red and white ribbons drifting from grandstands -->
  <path d="M120 220 Q200 360 250 540" stroke="%23DC2626" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M680 220 Q600 360 550 540" stroke="%23DC2626" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M300 240 Q320 380 340 540" stroke="%23FFF" stroke-width="2.5" fill="none" opacity="0.7"/>
  <path d="M500 240 Q480 380 460 540" stroke="%23FFF" stroke-width="2.5" fill="none" opacity="0.7"/>

  <!-- Supporter throwing arms up into the warm midnight air -->
  <g transform="translate(400, 430)" fill="%23FFF">
    <ellipse cx="0" cy="0" rx="10" ry="12"/>
    <path d="M-12 12 Q0 8 12 12 L14 65 L-14 65 Z"/>
    <!-- Raised Arms in pure ecstasy -->
    <path d="M-10 20 L-35 -15 L-25 -20 L-6 10 Z"/>
    <path d="M10 20 L35 -15 L25 -20 L6 10 Z"/>
  </g>
  
  <rect x="0" y="550" width="800" height="50" fill="%23071810"/>
  <line x1="50" y1="565" x2="750" y2="565" stroke="%23FFF" stroke-width="2" opacity="0.4"/>
</svg>`;

export const SAMPLE_MEMORIES: StoredMemory[] = [
  {
    id: "sample-under-the-lights-1998",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    title: "UNDER THE LIGHTS",
    year: 1998,
    theme: "Generational Love & Quiet Reverence",
    emotion: "Deep Nostalgia & Awe",
    story: "In 1998, a boy entered the stadium guided by his grandfather's weathered hand. The score, the opponent, and the tactical nuances dissolved into the autumn air, but the sacred architecture of the night endured: towering floodlights burning through misty dusk, a cathedral roar rising from thousands of voices, and the profound safety found in small fingers wrapped tightly around steadfast guidance. Long after final whistles blow and turnstiles rust shut, the light remains.",
    epitaph: "Some matches never end.",
    tags: ["Grandfather", "Night Match", "Floodlights", "Childhood", "1998", "Cathedral of Echoes"],
    known_facts: [
      "Attended with grandfather",
      "Took place in approximately 1998",
      "Night match under active stadium floodlights",
      "Held grandfather's hand amid the crowd"
    ],
    unknowns: [
      "Exact football club and opposing team",
      "Name and location of the stadium",
      "Final match score and goalscorers",
      "Exact calendar date of the fixture"
    ],
    originalInput: {
      rawText: "My grandfather took me to a football match in 1998. I barely remember the game, but I remember the lights, the crowd and holding his hand.",
      suggestedTitle: "UNDER THE LIGHTS",
      suggestedYear: 1998
    },
    artifactImage: VINTAGE_STADIUM_ARTIFACT,
    seatLocation: {
      stand: "North Stand",
      tier: "Lower Tier",
      sectorNumber: 4,
      seatNumber: 42,
      x: 32,
      y: 28
    },
    isDemo: true
  },
  {
    id: "sample-rain-soaked-derby-1989",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    title: "THE DELUGE DERBY",
    year: 1989,
    theme: "Shared Tribulation & Communal Warmth",
    emotion: "Euphoria Through Adversity",
    story: "Sheets of rain beat down upon the open wooden terraces until coats were sodden and breath turned to white steam in the floodlight beams. Nobody left. When the 89th-minute equalizer struck the sodden netting, five thousand strangers collapsed into each other in an embrace of wild, dripping ecstasy. A cup of lukewarm Bovril passed hand to hand warmed more than fingers that night.",
    epitaph: "When the sky opened, the ground held us together.",
    tags: ["Terraces", "Rain", "Derby", "1980s", "Late Equalizer", "Bovril"],
    known_facts: [
      "Took place in torrential rain on open terraces",
      "Approximate year 1989",
      "Late equalizing goal in the dying minutes",
      "Shared hot drinks and communal celebration"
    ],
    unknowns: [
      "Confirmed clubs involved",
      "Player who scored the 89th-minute goal",
      "Specific ground name"
    ],
    originalInput: {
      rawText: "A rainy derby match in 1989. We were drenched on the open terrace, freezing cold, but when we scored in the last minute we were hugging complete strangers.",
      suggestedTitle: "THE DELUGE DERBY",
      suggestedYear: 1989
    },
    artifactImage: undefined,
    seatLocation: {
      stand: "South Stand",
      tier: "Terrace",
      sectorNumber: 7,
      seatNumber: 19,
      x: 68,
      y: 72
    },
    isDemo: true
  },
  {
    id: "sample-kyiv-chestnut-1975",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    title: "THE CHESTNUT ROAR OF KYIV",
    year: 1975,
    theme: "Defiance, Unity & Autumn Gold",
    emotion: "Pride & Collective Transcendence",
    story: "October 1975 in Kyiv. One hundred thousand souls packed the concrete bowls of the Republican Stadium under icy autumn drizzle. When Oleh Blokhin slipped past Franz Beckenbauer to strike the net against Bayern Munich, the stands did not merely cheer—they ignited. Thousands of rolled-up newspapers and match programmes were set ablaze like miniature torchlights into the freezing night sky, illuminating the golden chestnut trees surrounding the ground. A grandfather wrapped his woollen scarf around his son's neck, whispering that in dark times, eleven men in white and blue could outshine the world.",
    epitaph: "One hundred thousand paper torches in the autumn chill.",
    tags: ["Dynamo Kyiv", "Super Cup 1975", "Blokhin", "Kyiv", "Chestnut Trees", "Paper Torches"],
    known_facts: [
      "Took place in Kyiv in October 1975",
      "Republican Stadium packed with ~100,000 spectators",
      "Oleh Blokhin scored against Bayern Munich",
      "Fans ignited rolled-up newspapers like torches in the cold stands"
    ],
    unknowns: [
      "Exact minute of the second goal",
      "Temperature at the final whistle",
      "Exact gate number on the original paper ticket"
    ],
    originalInput: {
      rawText: "Kyiv, October 1975. 100,000 people at the Republican Stadium for Dynamo Kyiv vs Bayern Munich. When Blokhin scored, the entire stadium lit rolled-up newspapers on fire like torches in the cold night. My father wrapped his scarf around me and said we would never forget this night.",
      suggestedTitle: "THE CHESTNUT ROAR OF KYIV",
      suggestedYear: 1975,
      club: "Dynamo Kyiv",
      stadium: "Republican Stadium, Kyiv"
    },
    artifactImage: KYIV_1975_ARTIFACT,
    seatLocation: {
      stand: "West Stand",
      tier: "Lower Tier",
      sectorNumber: 11,
      seatNumber: 75,
      x: 22,
      y: 54
    },
    isDemo: true
  },
  {
    id: "sample-camp-nou-1999",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    title: "THREE MINUTES BEYOND MIDNIGHT",
    year: 1999,
    theme: "The Miracle Beyond Hope",
    emotion: "Ecstatic Disbelief & Resurrected Joy",
    story: "May 1999 in Barcelona. The clock on the massive Camp Nou scoreboard had already ticked into added time, and Bayern's ribbons were already being tied to the trophy. The air was thick with Catalan spring humidity and the heavy resignation of supporters preparing for defeat. Then, David Beckham swung in a corner. Teddy Sheringham turned it home. Before the delirium had even settled, another corner flew in, Ole Gunnar Solskjær stuck out a boot, and the heavens cracked open. Supporters collapsed across row after row of plastic seats, weeping, screaming, clinging to strangers whose names they never asked.",
    epitaph: "Football, bloody hell.",
    tags: ["Camp Nou", "1999", "Champions League", "Injury Time", "Manchester United", "Miracle"],
    known_facts: [
      "Champions League final at Camp Nou, May 1999",
      "Manchester United trailed until the 90th minute",
      "Two goals scored in three minutes of stoppage time",
      "Pure pandemonium in the stands"
    ],
    unknowns: [
      "Exact seat number in the upper tier",
      "Who caught the scarf thrown into the lower concourse"
    ],
    originalInput: {
      rawText: "Camp Nou, May 1999. We were 1-0 down in the 90th minute. I was with my older brother, practically crying. Then Sheringham and Solskjaer scored in stoppage time. I lost my voice, my shoes, and my mind. I've never felt pure magic like that again.",
      suggestedTitle: "THREE MINUTES BEYOND MIDNIGHT",
      suggestedYear: 1999,
      club: "Manchester United",
      stadium: "Camp Nou, Barcelona"
    },
    artifactImage: CAMP_NOU_1999_ARTIFACT,
    seatLocation: {
      stand: "South Stand",
      tier: "Upper Tier",
      sectorNumber: 14,
      seatNumber: 99,
      x: 78,
      y: 76
    },
    isDemo: true
  },
  {
    id: "sample-lisbon-clover-1967",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    title: "THE LISBON CLOVER",
    year: 1967,
    theme: "Pure Heritage & Working-Class Wonder",
    emotion: "Sunlit Reverence & Timeless Glory",
    story: "May 1967. Eleven men born within thirty miles of Glasgow walked onto the sun-baked Portuguese turf in green and white hoops. In an old wooden desk in Edinburgh, there still lies an original matchday ticket stub—creased, stained with olive oil and coffee, accompanied by a pressed four-leaf clover picked near the River Tagus that afternoon. To hold it is to remember eleven local lads who proved that ordinary boys from rainy streets could conquer European royalty in the blinding Atlantic sun.",
    epitaph: "Born within thirty miles of the ground. Crowned beside the Atlantic.",
    tags: ["Celtic", "Lisbon Lions", "1967", "Ticket Stub", "Estadio Nacional", "Heritage"],
    known_facts: [
      "European Cup Final, May 1967, Lisbon",
      "Celtic defeated Inter Milan 2-1",
      "Team composed entirely of local players from within 30 miles",
      "Keepsake ticket stub preserved in family desk"
    ],
    unknowns: [
      "Exact bus route taken from Lisbon center",
      "The name of the cafe where the ticket was kept"
    ],
    originalInput: {
      rawText: "My uncle was in Lisbon in 1967 when Celtic won the European Cup. He kept his ticket in a drawer with a pressed clover until the day he passed. He always said the sun in Portugal felt like God was smiling on the East End of Glasgow.",
      suggestedTitle: "THE LISBON CLOVER",
      suggestedYear: 1967,
      club: "Celtic",
      stadium: "Estádio Nacional, Lisbon"
    },
    artifactImage: LISBON_1967_ARTIFACT,
    seatLocation: {
      stand: "East Stand",
      tier: "Terrace",
      sectorNumber: 3,
      seatNumber: 67,
      x: 80,
      y: 36
    },
    isDemo: true
  }
];
