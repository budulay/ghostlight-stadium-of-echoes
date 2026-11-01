export interface AnalyzedMemory {
  title: string;
  year: number | null;
  theme: string;
  emotion: string;
  story: string;
  epitaph: string;
  tags: string[];
  known_facts: string[];
  unknowns: string[];
}

export interface StadiumSeatLocation {
  stand: 'North Stand' | 'South Stand' | 'East Stand' | 'West Stand';
  tier: 'Upper Tier' | 'Lower Tier' | 'Terrace';
  sectorNumber: number;
  seatNumber: number;
  x: number; // percentage 0-100 on interactive stadium canvas
  y: number; // percentage 0-100 on interactive stadium canvas
}

export interface StoredMemory extends AnalyzedMemory {
  id: string;
  createdAt: number;
  originalInput: {
    rawText: string;
    suggestedTitle?: string;
    suggestedYear?: number | null;
    club?: string;
    stadium?: string;
  };
  artifactImage?: string; // base64 or data URL
  seatLocation: StadiumSeatLocation;
  isDemo?: boolean;
}

export interface HealthStatus {
  status: 'ok' | 'degraded';
  ollama: {
    connected: boolean;
    endpoint: string;
    configuredModel: string;
    modelAvailable: boolean;
    availableModels: string[];
    error?: string;
  };
  elevenlabs?: {
    configured: boolean;
  };
}

export interface MemorySubmission {
  memoryText: string;
  title?: string;
  year?: number | null;
  club?: string;
  stadium?: string;
  artifactImage?: string;
}

export type MuseumTheme = 'midnight' | 'darkroom' | 'halloween';
