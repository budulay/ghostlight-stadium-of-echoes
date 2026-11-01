import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const StadiumBackground: React.FC<{ intensity?: 'subtle' | 'awakened' | 'seance' }> = ({
  intensity = 'subtle',
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate atmospheric dust/light particles
    const generated = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  const isSeance = intensity === 'seance';
  const isAwakened = intensity === 'awakened';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#04060B]">
      {/* 1. Deep Midnight Atmosphere Gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-[#0B152B]/40 via-[#060913] to-[#04060B]" />

      {/* 2. Top Floodlight Beams Left & Right */}
      <motion.div
        animate={{
          opacity: isSeance ? [0.3, 0.7, 0.4] : isAwakened ? 0.55 : 0.28,
          scaleY: isSeance ? [0.95, 1.05, 0.98] : 1,
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-10 w-[700px] h-[850px] origin-top-left pointer-events-none transform -rotate-12"
        style={{
          background: 'radial-gradient(ellipse at 15% 0%, rgba(245, 215, 127, 0.25) 0%, rgba(212, 175, 55, 0.08) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <motion.div
        animate={{
          opacity: isSeance ? [0.3, 0.7, 0.4] : isAwakened ? 0.55 : 0.28,
          scaleY: isSeance ? [0.98, 1.05, 0.95] : 1,
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-20 -right-10 w-[700px] h-[850px] origin-top-right pointer-events-none transform rotate-12"
        style={{
          background: 'radial-gradient(ellipse at 85% 0%, rgba(245, 215, 127, 0.25) 0%, rgba(212, 175, 55, 0.08) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* 3. Center Pitch Aura */}
      <motion.div
        animate={{
          opacity: isAwakened ? 0.35 : isSeance ? 0.45 : 0.15,
        }}
        transition={{ duration: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-[100%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30, 58, 110, 0.2) 0%, rgba(212, 175, 55, 0.05) 45%, transparent 75%)',
          filter: 'blur(45px)',
        }}
      />

      {/* 4. Architectural Stadium Silhouette Wireframe */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[320px] md:h-[420px] opacity-25 text-slate-700/60 transition-opacity duration-1000"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Distant Grandstand tiers */}
        <path
          d="M 0 350 Q 720 280 1440 350 L 1440 400 L 0 400 Z"
          fill="#080E1C"
          stroke="#D4AF37"
          strokeWidth="0.7"
          strokeOpacity="0.3"
        />
        <path
          d="M 0 320 Q 720 250 1440 320"
          stroke="#D4AF37"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          strokeOpacity="0.25"
        />
        <path
          d="M 0 290 Q 720 220 1440 290"
          stroke="#D4AF37"
          strokeWidth="0.5"
          strokeDasharray="2 8"
          strokeOpacity="0.2"
        />

        {/* Floodlight Tower Left */}
        <g stroke="#334155" strokeWidth="1.5" opacity="0.6">
          <line x1="160" y1="90" x2="160" y2="350" />
          <line x1="140" y1="120" x2="180" y2="120" />
          <line x1="145" y1="180" x2="175" y2="180" />
          <line x1="150" y1="240" x2="170" y2="240" />
          <line x1="140" y1="120" x2="175" y2="180" />
          <line x1="180" y1="120" x2="145" y2="180" />
          {/* Floodlight bulbs bank */}
          <circle cx="160" cy="85" r="9" fill="#FFF8DE" opacity="0.8" />
          <circle cx="145" cy="88" r="5" fill="#FFF8DE" opacity="0.7" />
          <circle cx="175" cy="88" r="5" fill="#FFF8DE" opacity="0.7" />
        </g>

        {/* Floodlight Tower Right */}
        <g stroke="#334155" strokeWidth="1.5" opacity="0.6">
          <line x1="1280" y1="90" x2="1280" y2="350" />
          <line x1="1260" y1="120" x2="1300" y2="120" />
          <line x1="1265" y1="180" x2="1295" y2="180" />
          <line x1="1270" y1="240" x2="1290" y2="240" />
          <line x1="1260" y1="120" x2="1295" y2="180" />
          <line x1="1300" y1="120" x2="1265" y2="180" />
          {/* Floodlight bulbs bank */}
          <circle cx="1280" cy="85" r="9" fill="#FFF8DE" opacity="0.8" />
          <circle cx="1265" cy="88" r="5" fill="#FFF8DE" opacity="0.7" />
          <circle cx="1295" cy="88" r="5" fill="#FFF8DE" opacity="0.7" />
        </g>
      </svg>

      {/* 5. Rolling Atmospheric Fog */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-40 animate-fog-slow"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(212, 175, 55, 0.08) 0%, rgba(13, 23, 46, 0.4) 40%, transparent 80%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none opacity-30 animate-fog-fast"
        style={{
          background: 'radial-gradient(ellipse at 40% 100%, rgba(148, 163, 184, 0.06) 0%, rgba(7, 12, 24, 0.3) 50%, transparent 80%)',
          filter: 'blur(25px)',
        }}
      />

      {/* 6. Floating Memory Dust Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: `${p.y}%`, x: `${p.x}%` }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [`${p.y}%`, `${(p.y - 18 + 100) % 100}%`],
            x: [`${p.x}%`, `${(p.x + (p.id % 2 === 0 ? 3 : -3) + 100) % 100}%`],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute rounded-full bg-amber-100/70 pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: '0 0 6px 1px rgba(245, 215, 127, 0.4)',
          }}
        />
      ))}
    </div>
  );
};
