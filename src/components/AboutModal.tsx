import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Shield, Sparkles, HeartHandshake, Eye } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#030509]/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-[#0C152B] to-[#070D1C] border border-amber-400/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-200 space-y-6"
        >
          <div className="flex items-start justify-between border-b border-amber-500/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  GHOSTLIGHT
                </h3>
                <div className="text-xs font-serif italic text-amber-300">
                  “Where memories never die.”
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            <p className="font-serif italic text-base sm:text-lg text-amber-100">
              Entering an abandoned football stadium at midnight, listening to the roar of thousands who once stood where you stand.
            </p>

            <p>
              <strong>Ghostlight: Stadium of Echoes</strong> is an interactive digital sanctuary where forgotten football recollections are preserved and resurrected. Guided by locally running open-weight intelligence (Google Gemma 3 4B), each personal memory is turned into a structured, cinematic museum exhibit.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider">
                Ethical Preservation Principles
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Hallucinations:</strong> We never fabricate match results, player goals, or scores that were not provided.</span>
                </li>
                <li className="flex items-start gap-2">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Reverence & Respect:</strong> We do not attempt to impersonate or synthesize the voices of departed loved ones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Radical Transparency:</strong> Grounded user facts and unrecorded details are catalogued in distinct columns.</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-slate-400">
              Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, Express, Ollama, and local IndexedDB.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
