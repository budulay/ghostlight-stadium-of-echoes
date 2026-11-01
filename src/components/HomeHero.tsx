import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, ShieldCheck, Flame, Compass, Ghost } from 'lucide-react';
import { StoredMemory, MuseumTheme } from '../types/memory';

interface HomeHeroProps {
  onAwakenClick: () => void;
  onExploreArchive: () => void;
  onLaunchSample: (sample: StoredMemory) => void;
  sampleMemory?: StoredMemory;
  totalMemoriesCount: number;
  theme?: MuseumTheme;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onAwakenClick,
  onExploreArchive,
  onLaunchSample,
  sampleMemory,
  totalMemoriesCount,
  theme = 'midnight',
}) => {
  const isHalloween = theme === 'halloween';
  const isDarkroom = theme === 'darkroom';

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-12 text-center overflow-hidden">
      {/* Subtle Top Atmospheric Beam */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[350px] blur-3xl pointer-events-none ${
        isHalloween
          ? 'bg-gradient-to-b from-purple-500/15 via-orange-500/10 to-transparent'
          : isDarkroom
          ? 'bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent'
          : 'bg-gradient-to-b from-amber-400/10 via-amber-500/5 to-transparent'
      }`} />

      {/* Top Banner Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs sm:text-sm tracking-[0.25em] uppercase font-cinzel mb-8 transition-colors ${
          isHalloween
            ? 'border-purple-500/40 bg-purple-950/30 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
            : isDarkroom
            ? 'border-amber-500/40 bg-amber-950/30 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
            : 'border-amber-500/30 bg-amber-950/20 text-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
        }`}
      >
        {isHalloween ? (
          <Ghost className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
        ) : (
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        )}
        {isHalloween ? "All Hallows' Eve • Spectral Sanctuary for Football Lore 🎃" : "An Interactive Digital Sanctuary for Football Lore"}
      </motion.div>

      {/* Main Cinematic Typography */}
      <div className="max-w-4xl mx-auto space-y-6 my-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-cinzel font-extrabold tracking-[0.12em] text-white leading-none uppercase drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
        >
          Some Memories <br />
          <span className="text-gold-gradient drop-shadow-[0_0_35px_rgba(212,175,55,0.4)]">
            Never Leave.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-lg sm:text-2xl font-serif italic text-slate-300 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
        >
          “Every stadium holds a thousand stories. Give one a light.”
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <button
            onClick={onAwakenClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-cinzel text-sm sm:text-base font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-[0_0_35px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(245,215,127,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            Awaken A Memory
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreArchive}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-cinzel text-sm sm:text-base font-bold tracking-[0.2em] uppercase border border-amber-400/30 bg-slate-950/60 backdrop-blur-md text-slate-200 hover:text-amber-200 hover:border-amber-400/70 hover:bg-amber-950/20 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Explore The Archive ({totalMemoriesCount})
          </button>
        </motion.div>

        {/* Privacy & Architecture Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 text-xs font-sans text-slate-400 tracking-wider pt-2"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400/70" />
          <span>Local-first architecture. Memories stored on your device. Powered by local Gemma 3.</span>
        </motion.div>
      </div>

      {/* Featured Sample Memory Highlight Box */}
      {sampleMemory && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className={`w-full max-w-2xl mt-12 mb-4 p-5 rounded-2xl border backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-left flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
            isHalloween
              ? 'border-purple-500/35 bg-gradient-to-r from-[#1A0D2D]/85 via-[#25103E]/75 to-[#1A0D2D]/85 shadow-[0_10px_35px_rgba(168,85,247,0.25)]'
              : isDarkroom
              ? 'border-amber-500/30 bg-gradient-to-r from-[#1C140F]/85 via-[#261A12]/75 to-[#1C140F]/85'
              : 'border-amber-400/25 bg-gradient-to-r from-[#0C1428]/80 via-[#0E1B38]/70 to-[#0C1428]/80'
          }`}
        >
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Official Sample Exhibit
              </span>
              <span className="text-xs text-slate-400 font-mono">OCTOBER 1998</span>
            </div>
            <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide truncate">
              {sampleMemory.title}
            </h4>
            <div className="font-serif italic text-xs sm:text-sm text-amber-200/90 line-clamp-1">
              “{sampleMemory.epitaph}”
            </div>
            <p className="text-xs text-slate-300 font-serif italic line-clamp-2 max-w-md">
              “My grandfather took me to a football match in 1998. I barely remember the game, but I remember the lights, the crowd and holding his hand.”
            </p>
          </div>

          <button
            onClick={() => onLaunchSample(sampleMemory)}
            className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-lg text-xs font-cinzel font-bold tracking-wider uppercase bg-amber-400/20 text-amber-200 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Experience Demo
          </button>
        </motion.div>
      )}

      {/* Decorative Bottom Barometer */}
      <div className="w-full max-w-md pt-4 flex items-center justify-between text-[11px] font-mono tracking-widest text-slate-500 uppercase border-t border-slate-800/60">
        <span>STADIUM SECTOR: RESTRICTED</span>
        <span className="flex items-center gap-1.5 text-amber-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          {totalMemoriesCount} BEACONS LIT
        </span>
        <span>LAT: 53.4631° N</span>
      </div>
    </div>
  );
};
