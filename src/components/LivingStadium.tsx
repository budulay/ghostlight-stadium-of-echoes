import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Eye, Flame, Compass, Filter, Calendar, Share2, GitBranch, Ghost } from 'lucide-react';
import { StoredMemory, MuseumTheme } from '../types/memory';

interface LivingStadiumProps {
  memories: StoredMemory[];
  onSelectMemory: (memory: StoredMemory) => void;
  onAwakenClick: () => void;
  highlightedMemoryId?: string;
  theme?: MuseumTheme;
}

function sanitizeSeatPosition(loc: StadiumSeatLocation): { x: number; y: number } {
  let { x, y, stand } = loc;
  // If coordinates encroach into the pitch (X: 20-80%, Y: 23-77%), snap them strictly into stand rows
  if (x > 20 && x < 80 && y > 23 && y < 77) {
    switch (stand) {
      case 'North Stand':
        y = 16;
        break;
      case 'South Stand':
        y = 84;
        break;
      case 'West Stand':
        x = 14;
        break;
      case 'East Stand':
        x = 86;
        break;
      default:
        y = 16;
        break;
    }
  }
  return { x, y };
}

export const LivingStadium: React.FC<LivingStadiumProps> = ({
  memories,
  onSelectMemory,
  onAwakenClick,
  highlightedMemoryId,
  theme = 'midnight',
}) => {
  const [hoveredMemory, setHoveredMemory] = useState<StoredMemory | null>(null);
  const [selectedStand, setSelectedStand] = useState<string>('all');
  const [showConstellations, setShowConstellations] = useState(true);
  const [marigoldTributes, setMarigoldTributes] = useState<Record<string, number>>({});

  const isDarkroom = theme === 'darkroom';
  const isHalloween = theme === 'halloween';

  const handleAddMarigold = (e: React.MouseEvent, memoryId: string) => {
    e.stopPropagation();
    setMarigoldTributes((prev) => ({
      ...prev,
      [memoryId]: (prev[memoryId] || 0) + 1,
    }));
  };

  const filteredMemories = selectedStand === 'all'
    ? memories
    : memories.filter((m) => m.seatLocation.stand === selectedStand);

  const luminosityPercent = Math.min(100, Math.round((memories.length / 50) * 100));

  // Compute Constellation Links (Echo Threads) between memories sharing era or themes
  const constellationLinks: Array<{ from: StoredMemory; to: StoredMemory; reason: string }> = [];
  if (showConstellations && memories.length > 1) {
    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const m1 = memories[i];
        const m2 = memories[j];

        // Link if same club
        if (
          m1.originalInput.club &&
          m2.originalInput.club &&
          m1.originalInput.club.toLowerCase() === m2.originalInput.club.toLowerCase()
        ) {
          constellationLinks.push({ from: m1, to: m2, reason: `Club Bond: ${m1.originalInput.club}` });
        }
        // Link if same decade
        else if (
          m1.year &&
          m2.year &&
          Math.floor(m1.year / 10) === Math.floor(m2.year / 10)
        ) {
          constellationLinks.push({ from: m1, to: m2, reason: `Era Bond: ${Math.floor(m1.year / 10)}0s` });
        }
        // Link if shared emotional keyword
        else if (
          m1.emotion.toLowerCase().includes('nostalgia') &&
          m2.emotion.toLowerCase().includes('nostalgia')
        ) {
          constellationLinks.push({ from: m1, to: m2, reason: 'Nostalgic Resonance' });
        }
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stadium Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-500/15 pb-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-amber-300 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Interactive Sanctuary Map
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide mt-1">
            The Living Stadium
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-slate-300 mt-1 max-w-xl">
            Each preserved memory illuminates a seat in the eternal stands. Hover to inspect the echoes; click to open the full exhibit.
          </p>
        </div>

        {/* Luminosity & Controls Widget */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 border border-amber-400/25 p-3 sm:p-4 rounded-2xl backdrop-blur-md">
          <div className="space-y-1">
            <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              Sanctuary Luminosity
            </div>
            <div className="text-xl sm:text-2xl font-cinzel font-bold text-amber-300 flex items-baseline gap-2">
              {luminosityPercent}%
              <span className="text-xs font-mono font-normal text-slate-400">
                ({memories.length} / 50 seats)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-36 sm:w-44 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${luminosityPercent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* Toggle Echo Threads */}
          <button
            onClick={() => setShowConstellations(!showConstellations)}
            title="Toggle glowing constellation threads between related memories"
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
              showConstellations
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Echo Threads</span>
          </button>

          <button
            onClick={onAwakenClick}
            className="px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase bg-amber-400/20 text-amber-200 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Light a Seat
          </button>
        </div>
      </div>

      {/* Stand Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-cinzel text-slate-400 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filter Stand:
          </span>
          {['all', 'North Stand', 'South Stand', 'East Stand', 'West Stand'].map((stand) => (
            <button
              key={stand}
              onClick={() => setSelectedStand(stand)}
              className={`px-3 py-1 rounded-lg text-xs font-sans tracking-wide transition-all cursor-pointer ${
                selectedStand === stand
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-medium shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                  : 'text-slate-400 bg-slate-900/60 border border-slate-800 hover:text-white'
              }`}
            >
              {stand === 'all' ? 'Entire Stadium' : stand}
            </button>
          ))}
        </div>

        {constellationLinks.length > 0 && showConstellations && (
          <div className="text-xs font-mono text-amber-300/80 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{constellationLinks.length} Active Echo Constellations</span>
          </div>
        )}
      </div>

      {/* Interactive Stadium Pitch & Grandstands Floorplan */}
      <div className={`relative w-full rounded-3xl border transition-colors duration-500 p-3 sm:p-6 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.95)] flex items-center justify-center ${
        isHalloween
          ? 'border-purple-600/35 bg-gradient-to-b from-[#170B26] via-[#0D0616] to-[#170B26]'
          : isDarkroom
          ? 'border-amber-600/30 bg-gradient-to-b from-[#1C1510] via-[#100D09] to-[#1C1510]'
          : 'border-amber-500/25 bg-gradient-to-b from-[#070D1B] via-[#040711] to-[#070D1B]'
      }`}>
        {/* Subtle Floodlight Halos at 4 Corners */}
        <div className={`absolute top-4 left-4 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
          isHalloween ? 'bg-purple-500/20' : isDarkroom ? 'bg-amber-500/15' : 'bg-amber-400/10'
        }`} />
        <div className={`absolute top-4 right-4 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
          isHalloween ? 'bg-orange-500/20' : isDarkroom ? 'bg-amber-500/15' : 'bg-amber-400/10'
        }`} />
        <div className={`absolute bottom-4 left-4 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
          isHalloween ? 'bg-orange-500/20' : isDarkroom ? 'bg-amber-500/15' : 'bg-amber-400/10'
        }`} />
        <div className={`absolute bottom-4 right-4 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
          isHalloween ? 'bg-purple-500/20' : isDarkroom ? 'bg-amber-500/15' : 'bg-amber-400/10'
        }`} />

        {/* Stadium Exact 1000:650 Frame (Coordinates for SVG and Seats are 1:1 Locked) */}
        <div className="relative w-full max-w-[1050px] aspect-[1000/650] select-none">
          {/* Stadium Architectural Overlay SVG */}
          <svg
            className={`absolute inset-0 w-full h-full pointer-events-none ${isHalloween ? 'text-purple-500/25' : isDarkroom ? 'text-amber-500/25' : 'text-amber-500/15'}`}
            viewBox="0 0 1000 650"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          {/* Outer Stadium Perimeter Oval */}
          <rect
            x="30"
            y="25"
            width="940"
            height="600"
            rx="120"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 6"
          />

          {/* Upper Tier Walkway */}
          <rect
            x="80"
            y="65"
            width="840"
            height="520"
            rx="90"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Lower Tier Walkway */}
          <rect
            x="140"
            y="110"
            width="720"
            height="430"
            rx="60"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Pitch Perimeter (Greenish Grass vs Aged Turf vs Abyssal Violet Pitch) */}
          <rect
            x="220"
            y="160"
            width="560"
            height="330"
            rx="16"
            fill={isHalloween ? "#120A20" : isDarkroom ? "#1B2217" : "#061A12"}
            fillOpacity={isHalloween ? 0.75 : isDarkroom ? 0.6 : 0.45}
            stroke={isHalloween ? "#A855F7" : isDarkroom ? "#D97706" : "#10B981"}
            strokeWidth="1.5"
            strokeOpacity={isHalloween ? 0.45 : isDarkroom ? 0.4 : 0.3}
          />

          {/* Halfway line */}
          <line
            x1="500"
            y1="160"
            x2="500"
            y2="490"
            stroke={isHalloween ? "#A855F7" : isDarkroom ? "#D97706" : "#10B981"}
            strokeWidth="1.5"
            strokeOpacity={isDarkroom ? 0.45 : 0.35}
          />

          {/* Center Circle */}
          <circle
            cx="500"
            cy="325"
            r="65"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <circle cx="500" cy="325" r="3" fill="#10B981" fillOpacity="0.6" />

          {/* Penalty Box Left */}
          <rect
            x="220"
            y="235"
            width="100"
            height="180"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
          <rect
            x="220"
            y="275"
            width="40"
            height="100"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.25"
          />

          {/* Penalty Box Right */}
          <rect
            x="680"
            y="235"
            width="100"
            height="180"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
          <rect
            x="740"
            y="275"
            width="40"
            height="100"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.25"
          />

          {/* Stand Labels */}
          <text
            x="500"
            y="55"
            fontFamily="Cinzel, serif"
            fontSize="15"
            letterSpacing="6"
            fill="#D4AF37"
            fillOpacity="0.5"
            textAnchor="middle"
          >
            NORTH STAND
          </text>
          <text
            x="500"
            y="615"
            fontFamily="Cinzel, serif"
            fontSize="15"
            letterSpacing="6"
            fill="#D4AF37"
            fillOpacity="0.5"
            textAnchor="middle"
          >
            SOUTH STAND
          </text>
          <text
            x="55"
            y="330"
            fontFamily="Cinzel, serif"
            fontSize="14"
            letterSpacing="4"
            fill="#D4AF37"
            fillOpacity="0.5"
            textAnchor="middle"
            transform="rotate(-90 55 330)"
          >
            WEST GRANDSTAND
          </text>
          <text
            x="945"
            y="330"
            fontFamily="Cinzel, serif"
            fontSize="14"
            letterSpacing="4"
            fill="#D4AF37"
            fillOpacity="0.5"
            textAnchor="middle"
            transform="rotate(90 945 330)"
          >
            EAST TERRACE
          </text>

          {/* SVG Echo Threads (Constellation Arcs) */}
          {showConstellations &&
            constellationLinks.map((link, idx) => {
              const pos1 = sanitizeSeatPosition(link.from.seatLocation);
              const pos2 = sanitizeSeatPosition(link.to.seatLocation);
              const x1 = (pos1.x / 100) * 1000;
              const y1 = (pos1.y / 100) * 650;
              const x2 = (pos2.x / 100) * 1000;
              const y2 = (pos2.y / 100) * 650;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 - 40; // Arc curvature

              return (
                <g key={idx}>
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    fill="none"
                    stroke="#F5D77F"
                    strokeWidth="1.2"
                    strokeOpacity="0.35"
                    strokeDasharray="4 6"
                  />
                  <circle cx={midX} cy={midY} r="2" fill="#D4AF37" fillOpacity="0.6" />
                </g>
              );
            })}
        </svg>

        {/* Illuminated Memory Seats */}
        {filteredMemories.map((m) => {
          const isHighlighted = m.id === highlightedMemoryId;
          const isHovered = hoveredMemory?.id === m.id;
          const tributes = marigoldTributes[m.id] || 0;
          const pos = sanitizeSeatPosition(m.seatLocation);

          return (
            <div
              key={m.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              onMouseEnter={() => setHoveredMemory(m)}
              onMouseLeave={() => setHoveredMemory(null)}
              onClick={() => onSelectMemory(m)}
            >
              {/* Pulsing Beacon Halo */}
              <div
                className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isHighlighted || isHovered ? 'scale-150' : 'group-hover:scale-130'
                }`}
              >
                <div
                  className={`absolute w-7 h-7 rounded-full animate-ping opacity-40 ${
                    isHalloween ? 'bg-orange-500' : isDarkroom ? 'bg-amber-500' : 'bg-amber-400'
                  }`}
                />
                <div
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    isHalloween
                      ? 'border-purple-300 bg-gradient-to-tr from-orange-500 to-amber-300 shadow-[0_0_18px_rgba(249,115,22,0.95)]'
                      : isDarkroom
                      ? 'border-amber-200 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.9)]'
                      : 'border-amber-200 bg-amber-400 shadow-[0_0_15px_rgba(245,215,127,1)]'
                  } ${isHighlighted ? 'bg-white ring-4 ring-amber-400/60' : ''}`}
                />

                {/* Marigold Tribute Badge for Samhain Mode */}
                {tributes > 0 && (
                  <span className="absolute -top-3.5 -right-3 text-[11px] filter drop-shadow-[0_0_6px_rgba(249,115,22,0.9)] animate-pulse pointer-events-none">
                    🌼
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Floating Tooltip When Hovering on a Beacon */}
        <AnimatePresence>
          {hoveredMemory && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.95)] max-w-xs backdrop-blur-md text-left space-y-2 pointer-events-auto transition-colors ${
                isHalloween
                  ? 'bg-[#150B24]/95 border border-purple-500/50 shadow-[0_10px_35px_rgba(168,85,247,0.3)]'
                  : isDarkroom
                  ? 'bg-[#18110D]/95 border border-amber-500/40'
                  : 'bg-[#090F20]/95 border border-amber-400/40'
              }`}
              style={{
                left: `${Math.min(82, Math.max(18, sanitizeSeatPosition(hoveredMemory.seatLocation).x))}%`,
                top: `${sanitizeSeatPosition(hoveredMemory.seatLocation).y > 60 ? sanitizeSeatPosition(hoveredMemory.seatLocation).y - 20 : sanitizeSeatPosition(hoveredMemory.seatLocation).y + 6}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={isHalloween ? 'text-purple-300' : 'text-amber-300'}>
                  {hoveredMemory.seatLocation.stand.toUpperCase()}
                </span>
                <span className="text-slate-400">
                  SEC {hoveredMemory.seatLocation.sectorNumber} • SEAT {hoveredMemory.seatLocation.seatNumber}
                </span>
              </div>
              <h4 className="font-cinzel text-sm font-bold text-white tracking-wide">
                {hoveredMemory.title}
              </h4>
              <p className="text-xs font-serif italic text-slate-300 line-clamp-2">
                “{hoveredMemory.story}”
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                <button
                  onClick={() => onSelectMemory(hoveredMemory)}
                  className={`font-semibold transition-colors cursor-pointer ${
                    isHalloween ? 'text-purple-300 hover:text-white' : 'text-amber-400 hover:text-white'
                  }`}
                >
                  Enter Exhibit →
                </button>

                {/* Leave Marigold Tribute Button */}
                <button
                  onClick={(e) => handleAddMarigold(e, hoveredMemory.id)}
                  title="Leave a marigold flower tribute in honor of this memory"
                  className="px-2 py-0.5 rounded-full bg-orange-950/60 border border-orange-500/40 text-orange-200 hover:bg-orange-500/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>🌼</span>
                  <span>{marigoldTributes[hoveredMemory.id] || 0}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Stadium Lore Description Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="text-xs font-cinzel text-amber-300 font-bold">North Stand</div>
          <div className="text-[11px] text-slate-400 font-serif italic">
            Home of quiet devotion, grandfather handshakes, and autumn twilight fixtures.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="text-xs font-cinzel text-amber-300 font-bold">South Stand (Kop)</div>
          <div className="text-[11px] text-slate-400 font-serif italic">
            The beating terrace heart, sodden coats, late equalizers, and roaring refrains.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="text-xs font-cinzel text-amber-300 font-bold">East & West Grandstands</div>
          <div className="text-[11px] text-slate-400 font-serif italic">
            Historic timber tiers, lost ticket stubs, and generations passing through the gates.
          </div>
        </div>
      </div>
    </div>
  );
};
