import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Trash2,
  Share2,
  Download,
  Calendar,
  Sparkles,
  MapPin,
  Heart,
  Eye,
  Ticket,
  Upload,
  Archive,
  CheckCircle2
} from 'lucide-react';
import { StoredMemory, MuseumTheme } from '../types/memory';
import { downloadMemoryCardImage, exportMemoryAsJSON } from '../services/exportCard';
import { downloadMatchdayTicketImage } from '../services/exportTicket';
import { exportTimeCapsule, importTimeCapsule } from '../services/capsule';

interface MuseumArchiveProps {
  memories: StoredMemory[];
  onOpenMemory: (memory: StoredMemory) => void;
  onDeleteMemory: (id: string) => void;
  onAwakenClick: () => void;
  onCapsuleImported: (updatedList: StoredMemory[]) => void;
  theme?: MuseumTheme;
}

export const MuseumArchive: React.FC<MuseumArchiveProps> = ({
  memories,
  onOpenMemory,
  onDeleteMemory,
  onAwakenClick,
  onCapsuleImported,
  theme = 'midnight',
}) => {
  const isDarkroom = theme === 'darkroom';
  const isHalloween = theme === 'halloween';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [memoryToDelete, setMemoryToDelete] = useState<StoredMemory | null>(null);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.story.toLowerCase().includes(q) ||
      m.theme.toLowerCase().includes(q) ||
      m.emotion.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q)) ||
      (m.originalInput.club && m.originalInput.club.toLowerCase().includes(q));

    let matchesDecade = true;
    if (selectedDecade !== 'all') {
      if (selectedDecade === 'unknown') {
        matchesDecade = !m.year;
      } else {
        const decadeStart = parseInt(selectedDecade, 10);
        matchesDecade = Boolean(m.year && m.year >= decadeStart && m.year < decadeStart + 10);
      }
    }

    return matchesSearch && matchesDecade;
  });

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await importTimeCapsule(file);
    if (res.success) {
      onCapsuleImported(res.totalMemories);
      setImportNotification(`Successfully restored ${res.importedCount} memories into your stadium archive!`);
      setTimeout(() => setImportNotification(null), 4000);
    } else {
      setImportNotification(res.error || 'Failed to import capsule.');
      setTimeout(() => setImportNotification(null), 4000);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Archive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/15 pb-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
            Permanent Sanctuary Archive
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide mt-1">
            The Museum of Echoes
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-slate-300 mt-1 max-w-xl">
            A curated register of moments rescued from oblivion. Saved locally in your browser’s IndexedDB.
          </p>
        </div>

        {/* Capsule Tools & Awaken CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File Input for Capsule Import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.ghostlight.json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import a .ghostlight.json archive file"
            className="px-3.5 py-2.5 rounded-xl font-cinzel text-xs font-semibold tracking-wider uppercase border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            Import Capsule
          </button>

          <button
            onClick={() => exportTimeCapsule(memories)}
            title="Export all memories as a .ghostlight.json capsule backup"
            className="px-3.5 py-2.5 rounded-xl font-cinzel text-xs font-semibold tracking-wider uppercase border border-amber-400/30 bg-amber-950/20 text-amber-200 hover:bg-amber-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            Export Capsule
          </button>

          <button
            onClick={onAwakenClick}
            className="px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Awaken Memory
          </button>
        </div>
      </div>

      {/* Import Notification Banner */}
      {importNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{importNotification}</span>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, club, theme, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-amber-400/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-sans focus:outline-none transition-colors"
          />
        </div>

        {/* Decade Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Eras' },
            { id: '1970', label: '1970s' },
            { id: '1980', label: '1980s' },
            { id: '1990', label: '1990s' },
            { id: '2000', label: '2000s' },
            { id: '2010', label: '2010s+' },
            { id: 'unknown', label: 'Unrecorded' },
          ].map((decade) => (
            <button
              key={decade.id}
              onClick={() => setSelectedDecade(decade.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                selectedDecade === decade.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-medium'
                  : 'text-slate-400 bg-slate-900/60 border border-slate-800 hover:text-white'
              }`}
            >
              {decade.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exhibits Grid */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((m) => (
            <motion.article
              key={m.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${
                isHalloween
                  ? 'border-purple-600/30 bg-gradient-to-b from-[#180C28] to-[#0E0618] hover:border-purple-400/60 hover:shadow-[0_15px_40px_rgba(168,85,247,0.25)]'
                  : isDarkroom
                  ? 'border-amber-600/25 bg-gradient-to-b from-[#1E1712] to-[#120E0A] hover:border-amber-500/50 hover:shadow-[0_15px_40px_rgba(245,158,11,0.18)]'
                  : 'border-amber-500/20 bg-gradient-to-b from-[#090F21] to-[#050811] hover:border-amber-400/50 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)]'
              }`}
            >
              <div>
                {/* Thumbnail Header */}
                <div
                  onClick={() => onOpenMemory(m)}
                  className="relative aspect-[16/9] w-full overflow-hidden bg-black cursor-pointer"
                >
                  {m.artifactImage ? (
                    <img
                      src={m.artifactImage}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center p-4 border-b ${
                      isHalloween
                        ? 'bg-gradient-to-b from-[#221038] to-[#11071E] text-purple-400/40 border-purple-600/20'
                        : isDarkroom
                        ? 'bg-gradient-to-b from-[#211913] to-[#130E0A] text-amber-500/40 border-amber-600/15'
                        : 'bg-gradient-to-b from-[#0C152B] to-[#060A14] text-amber-400/40 border-amber-500/10'
                    }`}>
                      <Sparkles className="w-8 h-8 mb-2" />
                      <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                        Atmospheric Memory
                      </span>
                    </div>
                  )}

                  {/* Year Tag Overlay */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono ${
                    isHalloween
                      ? 'bg-purple-950/80 border-purple-400/40 text-purple-300'
                      : 'bg-slate-950/80 border-amber-400/30 text-amber-300'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>{m.year ? `CIRCA ${m.year}` : 'LOST YEAR'}</span>
                  </div>

                  {/* Seat Location Overlay */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300">
                    {m.seatLocation.stand} • #{m.seatLocation.seatNumber}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`text-[11px] font-serif italic truncate ${
                      isHalloween ? 'text-purple-300/90' : 'text-amber-300/90'
                    }`}>
                      {m.theme}
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenMemory(m)}
                    className="font-cinzel text-lg font-bold text-white tracking-wide group-hover:text-amber-200 transition-colors cursor-pointer line-clamp-1"
                  >
                    {m.title}
                  </h3>

                  <p className="text-xs font-serif italic text-slate-300 line-clamp-3 leading-relaxed">
                    “{m.story}”
                  </p>

                  <div className={`text-[11px] font-serif italic border-l pl-2 line-clamp-1 ${
                    isHalloween
                      ? 'text-orange-400/80 border-purple-400/40'
                      : 'text-amber-400/80 border-amber-400/30'
                  }`}>
                    “{m.epitaph}”
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className={`px-5 py-3.5 border-t flex items-center justify-between gap-2 text-xs ${
                isHalloween
                  ? 'border-purple-900/40 bg-[#0E0618]/90'
                  : isDarkroom
                  ? 'border-amber-900/30 bg-[#0E0A08]/80'
                  : 'border-slate-800/80 bg-slate-950/60'
              }`}>
                <button
                  onClick={() => onOpenMemory(m)}
                  className={`font-cinzel font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isHalloween ? 'text-purple-300 hover:text-white' : 'text-amber-300 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Enter Exhibit
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => downloadMatchdayTicketImage(m, theme)}
                    title="Download Matchday Ticket (PNG)"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => downloadMemoryCardImage(m, theme)}
                    title="Download Archival Card (PNG)"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => exportMemoryAsJSON(m)}
                    title="Export JSON"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setMemoryToDelete(m)}
                    title="Delete Memory from Archive"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 space-y-4 max-w-lg mx-auto">
          <Sparkles className="w-10 h-10 mx-auto text-amber-400/40" />
          <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
            No Echoes Found
          </h3>
          <p className="text-xs font-serif italic text-slate-400">
            {searchQuery
              ? 'No preserved memories match your filter criteria. Try searching for other terms.'
              : 'The sanctuary archive is awaiting its first awakened memory.'}
          </p>
          <button
            onClick={onAwakenClick}
            className="px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 transition-all cursor-pointer"
          >
            Awaken A Memory Now
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {memoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMemoryToDelete(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0A1224] border border-amber-400/30 rounded-2xl p-6 shadow-2xl text-slate-200 space-y-4"
            >
              <h3 className="font-cinzel text-lg font-bold text-white">
                Extinguish This Beacon?
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Are you sure you wish to extinguish <strong className="text-white">“{memoryToDelete.title}”</strong>? Its light will leave the stadium and be deleted from your device’s local IndexedDB database.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setMemoryToDelete(null)}
                  className="px-4 py-2 rounded-lg text-xs font-sans text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteMemory(memoryToDelete.id);
                    setMemoryToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider bg-red-950 border border-red-500/40 text-red-200 hover:bg-red-900 transition-colors"
                >
                  Extinguish Memory
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
