import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Download,
  Share2,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Sparkles,
  Bookmark,
  ArrowRight,
  RotateCcw,
  Tag,
  Calendar,
  Heart,
  Cpu,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoredMemory } from '../types/memory';
import { ghostNarrator } from '../services/speech';
import { downloadMemoryCardImage, exportMemoryAsJSON } from '../services/exportCard';

interface MemoryRevealProps {
  memory: StoredMemory;
  isNewAwakening?: boolean;
  onSaveToMuseum?: () => void;
  onViewInStadium?: () => void;
  onAwakenAnother?: () => void;
  processedBy?: string;
  modelName?: string;
}

export const MemoryReveal: React.FC<MemoryRevealProps> = ({
  memory,
  isNewAwakening = false,
  onSaveToMuseum,
  onViewInStadium,
  onAwakenAnother,
  processedBy,
  modelName,
}) => {
  const [narratorState, setNarratorState] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [savedLocally, setSavedLocally] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Subtle golden ember burst on initial awakening
    if (isNewAwakening) {
      try {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5D77F', '#D4AF37', '#FFF', '#94A3B8'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        // ignore
      }
    }

    // Register narrator listener
    ghostNarrator.registerStateCallback((state) => {
      setNarratorState(state);
    });

    return () => {
      ghostNarrator.stop();
    };
  }, [isNewAwakening]);

  const handleToggleNarration = () => {
    if (narratorState === 'speaking') {
      ghostNarrator.pause();
    } else if (narratorState === 'paused') {
      ghostNarrator.resume();
    } else {
      ghostNarrator.speak(`${memory.story}. ${memory.epitaph}`, memory.title);
    }
  };

  const handleDownloadCard = async () => {
    setIsExporting(true);
    try {
      await downloadMemoryCardImage(memory);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    onSaveToMuseum?.();
    setSavedLocally(true);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Gradual Stand Illumination Notice Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-950/30 via-[#0B152B]/80 to-amber-950/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
              Sanctuary Location Lit
            </div>
            <div className="text-sm font-cinzel font-bold text-white">
              {memory.seatLocation.stand} • Sector {memory.seatLocation.sectorNumber} • Seat {memory.seatLocation.seatNumber}
            </div>
          </div>
        </div>

        {/* AI Engine Transparency Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {processedBy === 'ollama_gemma3'
              ? `PROCESSED LOCALLY VIA ${modelName || 'GEMMA 3 4B'}`
              : 'LOCAL SANCTUARY SYNTHESIS (NO HALLUCINATIONS)'}
          </span>
        </div>
      </motion.div>

      {/* 2. Main Exhibit Editorial Card */}
      <motion.article
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative rounded-3xl border border-amber-400/35 bg-[#090E1D]/90 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden p-6 sm:p-10 md:p-12 space-y-8"
      >
        {/* Top Gold Corner Filigree */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-400/40 rounded-tl-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-400/40 rounded-tr-3xl pointer-events-none" />

        {/* Header: Title & Meta badges */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Year & Emotion Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {memory.year && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono font-medium">
                <Calendar className="w-3.5 h-3.5" />
                CIRCA {memory.year}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-serif italic text-sm">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              {memory.emotion}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-sans text-xs">
              Theme: {memory.theme}
            </span>
          </div>

          {/* Large Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-black tracking-wide text-white uppercase drop-shadow-[0_4px_25px_rgba(212,175,55,0.35)]">
            {memory.title}
          </h1>

          <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>

        {/* Artifact Showcase (If present) */}
        {memory.artifactImage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-[0_15px_45px_rgba(0,0,0,0.8)] bg-black group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <img
              src={memory.artifactImage}
              alt={memory.title}
              className="w-full h-auto max-h-[420px] object-contain mx-auto group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-amber-300/90 tracking-wider">
              <span>ARCHIVAL ARTIFACT #1998</span>
              <span>ORIGINAL SUBMISSION</span>
            </div>
          </motion.div>
        )}

        {/* Cinematic Narrative Text */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            “{memory.story}”
          </p>

          {/* Closing Inscription (Epitaph) */}
          <div className="pt-4">
            <blockquote className="inline-block px-6 py-3 rounded-xl border border-amber-400/30 bg-amber-950/20 backdrop-blur-md font-serif italic text-lg sm:text-xl text-amber-200">
              — “{memory.epitaph}” —
            </blockquote>
          </div>
        </div>

        {/* Ghost Narrator Voice Bar */}
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-[#0C152B] via-[#101C38] to-[#0C152B] border border-amber-500/25 flex items-center justify-between gap-4 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleNarration}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              title={narratorState === 'speaking' ? 'Pause Ghost Narrator' : 'Listen to Ghost Narrator'}
            >
              {narratorState === 'speaking' ? (
                <VolumeX className="w-6 h-6 animate-pulse" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
            <div>
              <div className="text-xs font-cinzel font-bold text-white tracking-wider flex items-center gap-2">
                Ghost Narrator
                {narratorState === 'speaking' && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 h-3 bg-amber-400 animate-bounce" />
                    <span className="w-1 h-2 bg-amber-300 animate-bounce delay-100" />
                    <span className="w-1 h-3 bg-amber-400 animate-bounce delay-200" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                {narratorState === 'speaking'
                  ? 'Reciting exhibit narrative...'
                  : narratorState === 'paused'
                  ? 'Narration paused.'
                  : 'Play spoken narration (Browser SpeechSynthesis)'}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-amber-400/70 border border-amber-400/20 px-2.5 py-1 rounded-full hidden sm:inline-block">
            ElevenLabs Ready
          </div>
        </div>

        {/* Distinct Grounded Facts vs Unknowns Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-amber-500/15">
          {/* Known Facts (Grounded) */}
          <div className="p-5 rounded-2xl bg-[#060A14]/70 border border-amber-400/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel text-xs font-bold tracking-wider uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Grounded Recollections (Confirmed Facts)
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans">
              {memory.known_facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unknowns (Lost to Time) */}
          <div className="p-5 rounded-2xl bg-[#060A14]/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-cinzel text-xs font-bold tracking-wider uppercase">
              <HelpCircle className="w-4 h-4 text-amber-400/60" />
              Lost to the Winds (Missing Details)
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-sans">
              {memory.unknowns.map((unk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-600 font-bold">?</span>
                  <span>{unk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          {memory.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-sans"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Controls Bar */}
        <div className="pt-6 border-t border-amber-500/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadCard}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generating Card...' : 'Download Archival Card (PNG)'}
            </button>

            <button
              onClick={() => exportMemoryAsJSON(memory)}
              className="px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Export JSON
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onViewInStadium && (
              <button
                onClick={onViewInStadium}
                className="px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-slate-800/80 hover:bg-slate-700 text-amber-200 border border-amber-400/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                View in Living Stadium
              </button>
            )}

            {onAwakenAnother && (
              <button
                onClick={onAwakenAnother}
                className="px-5 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                Awaken Another
              </button>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
};
