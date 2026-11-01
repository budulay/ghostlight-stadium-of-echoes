import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Trash2, Sparkles, Shield, HelpCircle, FileText } from 'lucide-react';
import { MemorySubmission } from '../types/memory';
import { VINTAGE_STADIUM_ARTIFACT } from '../../server/sampleData';

interface CreateMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: MemorySubmission) => void;
  isSubmitting?: boolean;
}

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [memoryText, setMemoryText] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<string>('');
  const [club, setClub] = useState('');
  const [stadium, setStadium] = useState('');
  const [artifactImage, setArtifactImage] = useState<string | undefined>(undefined);
  const [artifactName, setArtifactName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP, SVG).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Image must be under 15MB.');
      return;
    }
    setError(null);
    setArtifactName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setArtifactImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleLoadSample = () => {
    setMemoryText(
      'My grandfather took me to a football match in 1998. I barely remember the game, but I remember the lights, the crowd and holding his hand.'
    );
    setTitle('UNDER THE LIGHTS');
    setYear('1998');
    setClub('');
    setStadium('');
    setArtifactImage(VINTAGE_STADIUM_ARTIFACT);
    setArtifactName('grandfather-matchday-1998.svg');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryText.trim() || memoryText.trim().length < 5) {
      setError('Please describe your football memory (at least 5 characters).');
      return;
    }

    const parsedYear = year ? parseInt(year, 10) : undefined;
    if (year && (isNaN(parsedYear!) || parsedYear! < 1860 || parsedYear! > 2099)) {
      setError('Please enter a valid approximate year (e.g. 1998).');
      return;
    }

    onSubmit({
      memoryText: memoryText.trim(),
      title: title.trim() || undefined,
      year: parsedYear || null,
      club: club.trim() || undefined,
      stadium: stadium.trim() || undefined,
      artifactImage,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#030509]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#0B152B] to-[#060913] border border-amber-400/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto text-slate-200"
        >
          {/* Top Decorative Gold Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

          {/* Modal Header */}
          <div className="p-6 border-b border-amber-500/15 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
                Sanctuary Registration
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
                Awaken a Forgotten Memory
              </h2>
              <p className="text-xs font-serif italic text-slate-300 mt-1">
                Enter your recollection. The stadium’s resident AI will transcribe its enduring echo.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Quick Demo Pre-fill helper */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-200/90 font-sans">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Want to test immediately?</span>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-cinzel font-semibold tracking-wider uppercase text-amber-300 hover:text-white underline decoration-amber-400/50 hover:decoration-amber-300 transition-all cursor-pointer"
              >
                Load 1998 Grandfather Prompt
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                {error}
              </div>
            )}

            {/* Required Memory Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-cinzel tracking-wider uppercase text-slate-200 font-bold">
                Your Football Memory <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Describe what you remember... the roar of the crowd, the cold rain, the floodlights cutting through mist, a song sung on the terraces, or a hand held tightly."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 text-slate-100 placeholder-slate-500 text-sm font-sans resize-none transition-all"
              />
              <div className="text-[11px] text-slate-400 italic">
                Do not worry about missing scores or dates. Describe what it felt like.
              </div>
            </div>

            {/* Optional Title & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-cinzel tracking-wider uppercase text-slate-300">
                  Memory Title <span className="text-slate-500 font-sans text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Under the Lights, The Deluge"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 text-slate-100 placeholder-slate-500 text-sm font-sans transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-cinzel tracking-wider uppercase text-slate-300">
                  Approximate Year <span className="text-slate-500 font-sans text-[10px]">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="1860"
                  max="2099"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 1998, 1989, 2005"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 text-slate-100 placeholder-slate-500 text-sm font-sans transition-all"
                />
              </div>
            </div>

            {/* Optional Club & Stadium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-cinzel tracking-wider uppercase text-slate-300">
                  Club / Team <span className="text-slate-500 font-sans text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="e.g. Everton, Celtic, Boca Juniors"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 text-slate-100 placeholder-slate-500 text-sm font-sans transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-cinzel tracking-wider uppercase text-slate-300">
                  Stadium / Ground <span className="text-slate-500 font-sans text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  placeholder="e.g. Goodison Park, Highbury, San Siro"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 text-slate-100 placeholder-slate-500 text-sm font-sans transition-all"
                />
              </div>
            </div>

            {/* Artifact Upload Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-cinzel tracking-wider uppercase text-slate-300">
                Photograph or Artifact <span className="text-slate-500 font-sans text-[10px]">(Optional)</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />

              {!artifactImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-amber-400 bg-amber-950/30'
                      : 'border-slate-700/80 hover:border-amber-400/50 hover:bg-slate-900/40 bg-slate-950/50'
                  }`}
                >
                  <Upload className="w-7 h-7 mx-auto text-amber-400/70 mb-2" />
                  <div className="text-xs font-cinzel tracking-wider uppercase text-slate-200">
                    Drag and drop a matchday photo, ticket stub, or scarf
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">
                    or click to browse files (PNG, JPG, WebP up to 15MB)
                  </div>
                </div>
              ) : (
                <div className="relative p-3 rounded-xl bg-slate-950 border border-amber-400/40 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-amber-400/30 shrink-0 bg-black flex items-center justify-center">
                    <img
                      src={artifactImage}
                      alt="Artifact preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-medium text-amber-300 truncate">
                      {artifactName || 'Matchday Artifact'}
                    </div>
                    <div className="text-[11px] text-slate-400">Attached to exhibit</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setArtifactImage(undefined);
                      setArtifactName('');
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Privacy Note Required */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-300 font-sans">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 font-medium">Privacy note: </strong>
                Your memories stay on your device. AI processing happens locally.
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-cinzel text-sm sm:text-base font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                Bring This Memory To Life
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
