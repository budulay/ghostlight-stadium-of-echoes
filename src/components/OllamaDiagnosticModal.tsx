import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Terminal, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Shield } from 'lucide-react';
import { HealthStatus } from '../types/memory';

interface OllamaDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthStatus | null;
  onRefreshHealth: () => Promise<void>;
}

export const OllamaDiagnosticModal: React.FC<OllamaDiagnosticModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefreshHealth,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const isConnected = Boolean(health?.ollama?.connected);
  const modelAvailable = Boolean(health?.ollama?.modelAvailable);
  const configuredModel = health?.ollama?.configuredModel || 'gemma3:4b';

  const commands = [
    { label: 'Start Ollama background service', cmd: 'ollama serve' },
    { label: `Download recommended ${configuredModel} model`, cmd: `ollama pull ${configuredModel}` },
    { label: 'List local available models', cmd: 'ollama list' },
  ];

  const handleCopy = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshHealth();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-[#0C152B] to-[#070D1C] border border-amber-400/30 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-amber-500/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  Local AI Architecture Status
                </h3>
                <div className="text-xs text-slate-400 font-sans">
                  Target Endpoint: <code className="text-amber-300">http://localhost:11434</code>
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

          {/* Cloud Demo Notice Banner */}
          {health?.demoMode && (
            <div className="p-3.5 rounded-xl bg-sky-950/50 border border-sky-500/40 text-xs text-sky-200 flex items-start gap-3">
              <span className="text-lg">🌐</span>
              <div className="space-y-1">
                <strong className="text-white block font-sans">Live Cloud Showcase (Render)</strong>
                <p className="text-slate-300 leading-relaxed font-sans">
                  You are exploring the hosted cloud demo. All visual themes, weather effects, Tannoy announcer, and museum archives are active. Memories created here are processed via our deterministic Sanctuary Engine. To run live open-weight inference with <strong>Google Gemma 3 4B</strong> on your device, clone the repo from GitHub and run with Ollama!
                </p>
              </div>
            </div>
          )}

          {/* Connection Status Panel */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs font-mono uppercase font-bold text-slate-200">
                  Ollama Service: {isConnected ? 'Online' : 'Offline / Standby'}
                </span>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                Test Ping
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Configured Model:</span>
                <span className="text-amber-300 font-bold">{configuredModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model Downloaded:</span>
                <span className={modelAvailable ? 'text-emerald-400' : 'text-amber-400'}>
                  {modelAvailable ? 'Yes (Ready)' : 'Not detected in local tags'}
                </span>
              </div>
            </div>
          </div>

          {/* Setup Commands */}
          <div className="space-y-3">
            <div className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Quick Setup Commands
            </div>

            <div className="space-y-2">
              {commands.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-black/60 border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 font-sans">{item.label}</div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-amber-200">
                    <span className="truncate">{item.cmd}</span>
                    <button
                      onClick={() => handleCopy(item.cmd, idx)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition-colors"
                      title="Copy command"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Fallback Note */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-2.5 text-xs text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Local Privacy Guarantee: </strong>
              Ghostlight never uploads your text or images to external cloud APIs. When Ollama is active, inference executes on your own GPU/CPU. When offline, our local deterministic engine ensures the complete museum experience remains fully accessible.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
