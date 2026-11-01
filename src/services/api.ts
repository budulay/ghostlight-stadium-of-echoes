import { HealthStatus, StoredMemory, AnalyzedMemory } from '../types/memory';

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: 'degraded',
      ollama: {
        connected: false,
        endpoint: 'http://localhost:11434',
        configuredModel: 'gemma3:4b',
        modelAvailable: false,
        availableModels: [],
        error: `Backend unreachable: ${err.message || 'Connection refused'}`,
      },
    };
  }
}

export async function fetchServerSampleMemories(): Promise<StoredMemory[]> {
  try {
    const res = await fetch('/api/sample-memories');
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    return [];
  }
}

export interface AnalyzeResult {
  success: boolean;
  processedBy?: string;
  model?: string;
  notice?: string;
  data?: AnalyzedMemory;
  error?: string;
  setupInstructions?: string | string[];
  canUseFallback?: boolean;
}

export async function submitMemoryForAnalysis(
  payload: {
    memoryText: string;
    title?: string;
    year?: number | null;
    club?: string;
    stadium?: string;
  },
  allowFallback = false
): Promise<AnalyzeResult> {
  try {
    const res = await fetch('/api/analyze-memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        allowFallback,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: `Network failure connecting to local Ghostlight server: ${err.message}`,
      canUseFallback: true,
    };
  }
}
