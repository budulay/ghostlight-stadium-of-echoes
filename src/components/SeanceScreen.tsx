import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, RefreshCw, Terminal, Flame, ShieldAlert } from 'lucide-react';
import { AnalyzeResult } from '../services/api';

interface SeanceScreenProps {
  onRetry: () => void;
  onFallbackAwaken: () => void;
  onCancel: () => void;
  errorResult: AnalyzeResult | null;
  modelName: string;
}

const SEANCE_MESSAGES = [
  "Searching the echoes...",
  "Connecting forgotten moments...",
  "A memory is taking shape...",
  "The stadium remembers..."
];

export const SeanceScreen: React.FC<SeanceScreenProps> = ({
  onRetry,
  onFallbackAwaken,
  onCancel,
  errorResult,
  modelName,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [lightPhase, setLightPhase] = useState(1);

  useEffect(() => {
    // Cycle messages every 2.6 seconds
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SEANCE_MESSAGES.length);
      setLightPhase((prev) => (prev < 4 ? prev + 1 : prev));
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030509]/95 backdrop-blur-xl overflow-hidden select-none">
      {/* Dynamic Floodlight Beams Powering Up */}
      <motion.div
        animate={{
          opacity: lightPhase >= 1 ? 0.35 : 0.05,
          scale: lightPhase >= 2 ? 1.05 : 0.95,
        }}
        transition={{ duration: 1.5 }}
        className="absolute -top-32 left-1/4 w-[500px] h-[700px] origin-top bg-gradient-to-b from-amber-300/30 via-amber-500/10 to-transparent blur-3xl pointer-events-none transform -rotate-12"
      />

      <motion.div
        animate={{
          opacity: lightPhase >= 3 ? 0.35 : 0.05,
          scale: lightPhase >= 4 ? 1.05 : 0.95,
        }}
        transition={{ duration: 1.5 }}
        className="absolute -top-32 right-1/4 w-[500px] h-[700px] origin-top bg-gradient-to-b from-amber-300/30 via-amber-500/10 to-transparent blur-3xl pointer-events-none transform rotate-12"
      />

      {/* Central Content */}
      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        {!errorResult ? (
          <>
            {/* The Awakening Animated Stadium Icon */}
            <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
              {/* Outer Pulsing Rings */}
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-amber-400/40 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              />
              <motion.div
                animate={{ scale: [1.2, 1.5, 1.2], opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute inset-0 rounded-full border border-amber-400/20"
              />

              {/* Center Beacon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-[0_0_40px_rgba(245,215,127,0.7)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#070D1C] flex items-center justify-center">
                  <Flame className="w-8 h-8 text-amber-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Stadium Floodlight Activation Bar */}
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="flex justify-between text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                <span>Floodlight Bank {lightPhase}/4</span>
                <span>Powering On</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-amber-500/20 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                  initial={{ width: '20%' }}
                  animate={{ width: `${lightPhase * 25}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Rotating Atmospheric Messages */}
            <div className="h-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif italic text-2xl sm:text-3xl text-amber-100/90 font-light tracking-wide drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
                >
                  “{SEANCE_MESSAGES[messageIndex]}”
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Local AI Execution Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>OLLAMA LOCAL INFERENCE • MODEL: {modelName}</span>
            </div>
          </>
        ) : (
          /* Ollama Connection Failure / Diagnostic Handling */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#131E38] to-[#0A1224] border border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-left space-y-5"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                  Stadium Signal Interrupted
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  The local Ollama AI instance could not be reached at <code className="text-amber-300">http://localhost:11434</code>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="text-[11px] text-amber-400/90 uppercase font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Terminal Setup Instructions:
              </div>
              <div className="text-slate-400">1. Verify Ollama is running:</div>
              <div className="p-2 rounded bg-black/60 text-amber-200 select-all font-mono">
                ollama serve
              </div>
              <div className="text-slate-400">2. Verify model is downloaded:</div>
              <div className="p-2 rounded bg-black/60 text-amber-200 select-all font-mono">
                ollama pull {modelName}
              </div>
            </div>

            <div className="text-xs text-slate-300 font-sans italic border-l-2 border-amber-400/50 pl-3">
              You can also awaken this memory immediately using the local respectful sanctuary engine without waiting for Ollama.
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRetry}
                className="flex-1 py-3 px-4 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-amber-400/20 text-amber-200 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Ollama Connection
              </button>

              <button
                onClick={onFallbackAwaken}
                className="flex-1 py-3 px-4 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Awaken With Local Engine
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel and edit submission
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
