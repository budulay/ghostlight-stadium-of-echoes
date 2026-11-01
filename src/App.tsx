import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { StadiumBackground } from './components/StadiumBackground';
import { HomeHero } from './components/HomeHero';
import { CreateMemoryModal } from './components/CreateMemoryModal';
import { SeanceScreen } from './components/SeanceScreen';
import { MemoryReveal } from './components/MemoryReveal';
import { LivingStadium } from './components/LivingStadium';
import { MuseumArchive } from './components/MuseumArchive';
import { OllamaDiagnosticModal } from './components/OllamaDiagnosticModal';
import { AboutModal } from './components/AboutModal';
import {
  HealthStatus,
  StoredMemory,
  MemorySubmission
} from './types/memory';
import {
  fetchHealth,
  fetchServerSampleMemories,
  submitMemoryForAnalysis,
  AnalyzeResult
} from './services/api';
import {
  getAllStoredMemories,
  saveMemoryToDB,
  deleteMemoryFromDB,
  seedSampleMemoriesIfEmpty
} from './services/db';
import { allocateStadiumSeat } from './services/seatAllocator';
import { ghostNarrator } from './services/speech';
import { SAMPLE_MEMORIES } from '../server/sampleData';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'stadium' | 'museum' | 'reveal'>('home');
  const [memories, setMemories] = useState<StoredMemory[]>([]);
  const [activeRevealMemory, setActiveRevealMemory] = useState<StoredMemory | null>(null);
  const [isNewAwakening, setIsNewAwakening] = useState(false);
  const [lastProcessedBy, setLastProcessedBy] = useState<string>('ollama_gemma3');
  const [weather, setWeather] = useState<'fog' | 'rain'>('fog');

  // Modals & Overlays
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Seance Awakening State
  const [isSeanceActive, setIsSeanceActive] = useState(false);
  const [seanceError, setSeanceError] = useState<AnalyzeResult | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<MemorySubmission | null>(null);

  // System Health
  const [health, setHealth] = useState<HealthStatus | null>(null);

  // Initialize DB and Health
  useEffect(() => {
    async function init() {
      const h = await fetchHealth();
      setHealth(h);

      let samples = await fetchServerSampleMemories();
      if (!samples || samples.length === 0) {
        samples = SAMPLE_MEMORIES;
      }

      const stored = await seedSampleMemoriesIfEmpty(samples);
      setMemories(stored);
    }

    init();
  }, []);

  const refreshHealth = async () => {
    const h = await fetchHealth();
    setHealth(h);
  };

  const handleToggleWeather = () => {
    const newWeather = weather === 'fog' ? 'rain' : 'fog';
    setWeather(newWeather);
    ghostNarrator.setWeather(newWeather);
  };

  // Launch AI Seance Workflow
  const handleStartSeance = async (submission: MemorySubmission, allowFallback = false) => {
    setCurrentSubmission(submission);
    setIsCreateOpen(false);
    setIsSeanceActive(true);
    setSeanceError(null);

    const result = await submitMemoryForAnalysis(
      {
        memoryText: submission.memoryText,
        title: submission.title,
        year: submission.year,
        club: submission.club,
        stadium: submission.stadium,
      },
      allowFallback
    );

    if (result.success && result.data) {
      const seat = allocateStadiumSeat(memories.length);
      const newMemory: StoredMemory = {
        ...result.data,
        id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
        originalInput: {
          rawText: submission.memoryText,
          suggestedTitle: submission.title,
          suggestedYear: submission.year,
          club: submission.club,
          stadium: submission.stadium,
        },
        artifactImage: submission.artifactImage,
        seatLocation: seat,
        isDemo: false,
      };

      await saveMemoryToDB(newMemory);
      setMemories((prev) => [newMemory, ...prev]);

      setLastProcessedBy(result.processedBy || 'ollama_gemma3');
      setActiveRevealMemory(newMemory);
      setIsNewAwakening(true);
      setIsSeanceActive(false);
      setCurrentView('reveal');
    } else {
      setSeanceError(result);
    }
  };

  const handleLaunchSample = (sample: StoredMemory) => {
    setActiveRevealMemory(sample);
    setIsNewAwakening(false);
    setLastProcessedBy('sample_archive');
    setCurrentView('reveal');
  };

  const handleOpenMemoryFromList = (memory: StoredMemory) => {
    setActiveRevealMemory(memory);
    setIsNewAwakening(false);
    setLastProcessedBy(memory.isDemo ? 'sample_archive' : 'local_record');
    setCurrentView('reveal');
  };

  const handleDeleteMemory = async (id: string) => {
    await deleteMemoryFromDB(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (activeRevealMemory?.id === id) {
      setActiveRevealMemory(null);
      setCurrentView('museum');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060B] text-slate-100 flex flex-col font-sans selection:bg-amber-400/30 selection:text-amber-100">
      {/* Dynamic Cinematic Background with Lights, Mist & Weather */}
      <StadiumBackground
        intensity={
          isSeanceActive ? 'seance' : currentView === 'reveal' ? 'awakened' : 'subtle'
        }
        weather={weather}
      />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'create') {
            setIsCreateOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        memoryCount={memories.length}
        health={health}
        weather={weather}
        onToggleWeather={handleToggleWeather}
        onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HomeHero
                onAwakenClick={() => setIsCreateOpen(true)}
                onExploreArchive={() => setCurrentView('museum')}
                onLaunchSample={handleLaunchSample}
                sampleMemory={memories[0]}
                totalMemoriesCount={memories.length}
              />
            </motion.div>
          )}

          {currentView === 'stadium' && (
            <motion.div
              key="stadium"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <LivingStadium
                memories={memories}
                onSelectMemory={handleOpenMemoryFromList}
                onAwakenClick={() => setIsCreateOpen(true)}
                highlightedMemoryId={activeRevealMemory?.id}
              />
            </motion.div>
          )}

          {currentView === 'museum' && (
            <motion.div
              key="museum"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <MuseumArchive
                memories={memories}
                onOpenMemory={handleOpenMemoryFromList}
                onDeleteMemory={handleDeleteMemory}
                onAwakenClick={() => setIsCreateOpen(true)}
                onCapsuleImported={(updatedList) => setMemories(updatedList)}
              />
            </motion.div>
          )}

          {currentView === 'reveal' && activeRevealMemory && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6 }}
            >
              <MemoryReveal
                memory={activeRevealMemory}
                isNewAwakening={isNewAwakening}
                onViewInStadium={() => setCurrentView('stadium')}
                onAwakenAnother={() => setIsCreateOpen(true)}
                processedBy={lastProcessedBy}
                modelName={health?.ollama?.configuredModel || 'gemma3:4b'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-500/10 py-6 text-center text-xs font-serif italic text-slate-500 bg-[#04060B]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            GHOSTLIGHT: STADIUM OF ECHOES • “Where memories never die.”
          </div>
          <div className="text-[11px] font-sans text-slate-400 not-italic">
            Local-first digital art installation • Gemma 3 Powered
          </div>
        </div>
      </footer>

      {/* Creation Modal */}
      <CreateMemoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(sub) => handleStartSeance(sub, false)}
      />

      {/* AI Seance Awakening Screen */}
      {isSeanceActive && (
        <SeanceScreen
          modelName={health?.ollama?.configuredModel || 'gemma3:4b'}
          errorResult={seanceError}
          onRetry={() => currentSubmission && handleStartSeance(currentSubmission, false)}
          onFallbackAwaken={() => currentSubmission && handleStartSeance(currentSubmission, true)}
          onCancel={() => {
            setIsSeanceActive(false);
            setSeanceError(null);
            setIsCreateOpen(true);
          }}
        />
      )}

      {/* Diagnostic & Setup Modal */}
      <OllamaDiagnosticModal
        isOpen={isOllamaModalOpen}
        onClose={() => setIsOllamaModalOpen(false)}
        health={health}
        onRefreshHealth={refreshHealth}
      />

      {/* About Sanctuary Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
