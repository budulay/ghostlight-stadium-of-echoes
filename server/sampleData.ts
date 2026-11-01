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
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0 0.5  0 0 0 0.12 0"/>
      <feComposite in2="SourceGraphic" in="gl" operator="in"/>
    </filter>
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
    <!-- Grandfather -->
    <ellipse cx="0" cy="0" rx="9" ry="10" />
    <path d="M-12 10 Q0 6 12 10 L14 55 L-14 55 Z"/>
    <!-- Child holding hand -->
    <ellipse cx="26" cy="18" rx="6" ry="7" />
    <path d="M18 26 Q26 23 34 26 L35 55 L17 55 Z"/>
    <!-- Clasped hands -->
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
  }
];
