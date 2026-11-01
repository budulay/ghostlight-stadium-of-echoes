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
  Ticket,
  FileText,
  Calendar,
  Heart,
  Cpu,
  Radio,
  Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoredMemory } from '../types/memory';
import { ghostNarrator } from '../services/speech';
import { downloadMemoryCardImage, exportMemoryAsJSON } from '../services/exportCard';
import { downloadMatchdayTicketImage } from '../services/exportTicket';

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
  const [voiceMode, setVoiceMode] = useState<'tannoy' | 'whisper'>('tannoy');
  const [isExportingCard, setIsExportingCard] = useState(false);
  const [isExportingTicket, setIsExportingTicket] = useState(false);
  const [activeTab, setActiveTab] = useState<'exhibit' | 'ticket'>('exhibit');

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
      ghostNarrator.setVoiceMode(voiceMode);
      ghostNarrator.speak(`${memory.story}. ${memory.epitaph}`, memory.title);
    }
  };

  const handleVoiceModeChange = (mode: 'tannoy' | 'whisper') => {
    setVoiceMode(mode);
    ghostNarrator.setVoiceMode(mode);
    if (mode === 'tannoy') {
      ghostNarrator.playTannoyChime();
    }
  };

  const handleDownloadCard = async () => {
    setIsExportingCard(true);
    try {
      await downloadMemoryCardImage(memory);
    } finally {
      setIsExportingCard(false);
    }
  };

  const handleDownloadTicket = async () => {
    setIsExportingTicket(true);
    try {
      await downloadMatchdayTicketImage(memory);
    } finally {
      setIsExportingTicket(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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

      {/* Artifact View Switcher: Exhibit Plaque vs Vintage Ticket */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab('exhibit')}
          className={`px-5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'exhibit'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Museum Exhibit Plaque
        </button>

        <button
          onClick={() => setActiveTab('ticket')}
          className={`px-5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ticket'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Vintage Matchday Ticket
        </button>
      </div>

      {activeTab === 'exhibit' ? (
        /* 2. Main Exhibit Editorial Card */
        <motion.article
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-amber-400/35 bg-[#090E1D]/90 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden p-6 sm:p-10 md:p-12 space-y-8"
        >
          {/* Top Gold Corner Filigree */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-400/40 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-400/40 rounded-tr-3xl pointer-events-none" />

          {/* Header: Title & Meta badges */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
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
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-[0_15px_45px_rgba(0,0,0,0.8)] bg-black group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <img
                src={memory.artifactImage}
                alt={memory.title}
                className="w-full h-auto max-h-[420px] object-contain mx-auto group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-amber-300/90 tracking-wider">
                <span>ARCHIVAL ARTIFACT</span>
                <span>ORIGINAL SUBMISSION</span>
              </div>
            </motion.div>
          )}

          {/* Cinematic Narrative Text */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              “{memory.story}”
            </p>

            <div className="pt-4">
              <blockquote className="inline-block px-6 py-3 rounded-xl border border-amber-400/30 bg-amber-950/20 backdrop-blur-md font-serif italic text-lg sm:text-xl text-amber-200">
                — “{memory.epitaph}” —
              </blockquote>
            </div>
          </div>

          {/* Ghost Narrator Voice Bar with Tannoy Mode Switcher */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-[#0C152B] via-[#101C38] to-[#0C152B] border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleToggleNarration}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
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
                    : `Audio: ${voiceMode === 'tannoy' ? 'Stadium Tannoy (with chime)' : 'Intimate Whisper'}`}
                </div>
              </div>
            </div>

            {/* Voice Mode Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-mono shrink-0">
              <button
                onClick={() => handleVoiceModeChange('tannoy')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  voiceMode === 'tannoy'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Stadium Tannoy Speaker with two-tone announcement chime"
              >
                <Radio className="w-3 h-3 text-amber-400" />
                Tannoy
              </button>
              <button
                onClick={() => handleVoiceModeChange('whisper')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  voiceMode === 'whisper'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Intimate museum whisper"
              >
                Whisper
              </button>
            </div>
          </div>

          {/* Distinct Grounded Facts vs Unknowns Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-amber-500/15">
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
                disabled={isExportingCard}
                className="px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExportingCard ? 'Generating Card...' : 'Exhibit Card (PNG)'}
              </button>

              <button
                onClick={handleDownloadTicket}
                disabled={isExportingTicket}
                className="px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-amber-500/10 text-amber-200 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Ticket className="w-4 h-4 text-amber-400" />
                {isExportingTicket ? 'Generating Ticket...' : 'Matchday Ticket (PNG)'}
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
      ) : (
        /* 3. Vintage Matchday Ticket Stub Preview */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-amber-400/40 bg-gradient-to-b from-[#0E162B] to-[#070D1A] p-6 sm:p-10 shadow-2xl space-y-6 text-slate-200"
        >
          <div className="flex items-center justify-between border-b border-amber-500/15 pb-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                Perforated Turnstile Ticket
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white tracking-wide mt-1">
                Matchday Admittance Stub
              </h3>
            </div>

            <button
              onClick={handleDownloadTicket}
              disabled={isExportingTicket}
              className="px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExportingTicket ? 'Rendering...' : 'Download Ticket (PNG)'}
            </button>
          </div>

          {/* Interactive Ticket Simulation Preview Container */}
          <div className="relative rounded-2xl border-2 border-amber-400/40 bg-[#090F20] p-6 overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch justify-between gap-6">
            {/* Main ticket left */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                <span>GHOSTLIGHT SANCTUARY ADMITTANCE</span>
                <span>{memory.year ? `CIRCA ${memory.year}` : 'LOST YEAR'}</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {memory.title}
              </h2>
              <div className="font-serif italic text-sm text-amber-200/90">
                “{memory.epitaph}”
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-black/60 border border-amber-400/25 text-center text-xs font-mono">
                <div>
                  <div className="text-slate-400 text-[10px]">STAND</div>
                  <div className="font-bold text-amber-300">{memory.seatLocation.stand.replace(' Stand', '')}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">SECTOR</div>
                  <div className="font-bold text-amber-300">SEC {memory.seatLocation.sectorNumber}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">ROW</div>
                  <div className="font-bold text-amber-300">R-{memory.seatLocation.seatNumber % 20 + 1}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">SEAT</div>
                  <div className="font-bold text-amber-300">#{memory.seatLocation.seatNumber}</div>
                </div>
              </div>
            </div>

            {/* Perforation divider in preview */}
            <div className="hidden md:flex flex-col items-center justify-between w-6 border-l-2 border-dashed border-amber-400/50 my-1 relative">
              <div className="w-6 h-6 rounded-full bg-[#0E162B] -mt-9 border border-amber-400/40" />
              <div className="text-[9px] font-mono text-amber-400/60 uppercase transform rotate-90 my-auto">
                PERFORATION
              </div>
              <div className="w-6 h-6 rounded-full bg-[#070D1A] -mb-9 border border-amber-400/40" />
            </div>

            {/* Turnstile Stub right */}
            <div className="w-full md:w-56 shrink-0 flex flex-col justify-between p-4 rounded-xl bg-black/40 border border-amber-400/20 text-center space-y-3">
              <div className="text-[10px] font-mono text-amber-400 tracking-widest uppercase">
                TURNSTILE STUB
              </div>
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-400/50 flex flex-col items-center justify-center text-[9px] font-mono text-amber-300">
                <span>SEAL</span>
                <span className="font-bold">{memory.year || 'SANCTUARY'}</span>
              </div>
              <div className="text-xs font-cinzel font-bold text-white">
                {memory.seatLocation.stand}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                VALID FOR ETERNITY
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
