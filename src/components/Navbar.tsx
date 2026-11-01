import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, MapPin, Plus, Cpu, Info, CloudRain, CloudFog } from 'lucide-react';
import { HealthStatus } from '../types/memory';
import { ghostNarrator } from '../services/speech';

interface NavbarProps {
  currentView: 'home' | 'stadium' | 'museum' | 'create';
  onNavigate: (view: 'home' | 'stadium' | 'museum' | 'create') => void;
  memoryCount: number;
  health: HealthStatus | null;
  weather: 'fog' | 'rain';
  onToggleWeather: () => void;
  onOpenOllamaModal: () => void;
  onOpenAboutModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  memoryCount,
  health,
  weather,
  onToggleWeather,
  onOpenOllamaModal,
  onOpenAboutModal,
}) => {
  const [ambientActive, setAmbientActive] = React.useState(false);

  const toggleSound = () => {
    const newState = ghostNarrator.toggleAmbientSound();
    setAmbientActive(newState);
  };

  const isOllamaConnected = Boolean(health?.ollama?.connected && health?.ollama?.modelAvailable);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/15 bg-[#04060B]/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-transparent flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover:border-amber-400 transition-colors">
            <span className="font-serif text-xl font-bold text-amber-200">G</span>
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-amber-400" />
          </div>
          <div>
            <div className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.2em] text-white flex items-center gap-2">
              GHOSTLIGHT
              <span className="text-[10px] tracking-normal px-2 py-0.5 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-300 font-sans font-medium uppercase hidden sm:inline-block">
                Museum
              </span>
            </div>
            <div className="text-[11px] font-sans tracking-widest text-slate-400 uppercase font-light">
              Stadium of Echoes
            </div>
          </div>
        </button>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase font-medium transition-all ${
              currentView === 'home'
                ? 'text-amber-300 bg-amber-500/10 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            The Entrance
          </button>

          <button
            onClick={() => onNavigate('stadium')}
            className={`px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'stadium'
                ? 'text-amber-300 bg-amber-500/10 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Living Stadium
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
              {memoryCount}
            </span>
          </button>

          <button
            onClick={() => onNavigate('museum')}
            className={`px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'museum'
                ? 'text-amber-300 bg-amber-500/10 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Archive
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Weather Toggle (Midnight Fog vs Downpour Derby) */}
          <button
            onClick={onToggleWeather}
            title={weather === 'rain' ? 'Switch to Midnight Mist (Current: Torrential Rain)' : 'Switch to Torrential Rain Derby (Current: Midnight Mist)'}
            className={`p-2 rounded-lg border transition-all text-xs font-mono flex items-center gap-1.5 ${
              weather === 'rain'
                ? 'bg-blue-950/50 border-blue-400/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {weather === 'rain' ? <CloudRain className="w-4 h-4 animate-pulse text-blue-400" /> : <CloudFog className="w-4 h-4 text-amber-300/80" />}
            <span className="hidden lg:inline text-[10px] uppercase">
              {weather === 'rain' ? 'Rain Derby' : 'Mist'}
            </span>
          </button>

          {/* Local AI Model Status Pill */}
          <button
            onClick={onOpenOllamaModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans border transition-all ${
              isOllamaConnected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:border-amber-400'
            }`}
            title="Local AI Model & System Diagnostics"
          >
            <Cpu className="w-3 h-3" />
            <span className="hidden sm:inline">
              {isOllamaConnected ? 'Gemma 3 : 4B' : 'Local AI Ready'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isOllamaConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={ambientActive ? 'Mute Stadium Ambience' : 'Play Stadium Ambience'}
            title={ambientActive ? 'Atmospheric soundscape active (Mute)' : 'Enable atmospheric night stadium hum'}
            className={`p-2 rounded-lg border transition-all ${
              ambientActive
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {ambientActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* About / Info */}
          <button
            onClick={onOpenAboutModal}
            title="About Ghostlight Museum"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Awaken Memory CTA Button */}
          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase font-cinzel bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Awaken</span> Memory
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden border-t border-amber-500/10 px-4 py-2 bg-[#060914] justify-around text-xs">
        <button
          onClick={() => onNavigate('home')}
          className={`py-1 px-2 rounded ${currentView === 'home' ? 'text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Entrance
        </button>
        <button
          onClick={() => onNavigate('stadium')}
          className={`py-1 px-2 rounded ${currentView === 'stadium' ? 'text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Living Stadium ({memoryCount})
        </button>
        <button
          onClick={() => onNavigate('museum')}
          className={`py-1 px-2 rounded ${currentView === 'museum' ? 'text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Archive
        </button>
      </div>
    </header>
  );
};
