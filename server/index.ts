import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkOllamaHealth, analyzeMemoryWithOllama, synthesizeFallbackNarrative } from './ollama.js';
import { SAMPLE_MEMORIES } from './sampleData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Health Check Endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  const ollamaHealth = await checkOllamaHealth();
  const elevenlabsConfigured = Boolean(process.env.ELEVENLABS_API_KEY);

  res.json({
    status: ollamaHealth.connected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    ollama: ollamaHealth,
    elevenlabs: {
      configured: elevenlabsConfigured,
    },
  });
});

// Curated Sample Memories Endpoint
app.get('/api/sample-memories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: SAMPLE_MEMORIES,
  });
});

// Analyze Memory Endpoint
app.post('/api/analyze-memory', async (req: Request, res: Response): Promise<void> => {
  try {
    const { memoryText, title, year, club, stadium, allowFallback } = req.body;

    if (!memoryText || typeof memoryText !== 'string' || memoryText.trim().length < 5) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid football memory description (at least 5 characters).',
      });
      return;
    }

    const payload = {
      memoryText: memoryText.trim(),
      title: title ? String(title).trim() : undefined,
      year: year ? parseInt(String(year), 10) : null,
      club: club ? String(club).trim() : undefined,
      stadium: stadium ? String(stadium).trim() : undefined,
    };

    // Try Ollama first
    const health = await checkOllamaHealth();

    if (health.connected && health.modelAvailable) {
      try {
        console.log(`[Ghostlight] Invoking Ollama with model "${health.configuredModel}"...`);
        const result = await analyzeMemoryWithOllama(payload);
        res.json({
          success: true,
          processedBy: 'ollama_gemma3',
          model: health.configuredModel,
          data: result,
        });
        return;
      } catch (ollamaErr: any) {
        console.error('[Ghostlight] Ollama inference error:', ollamaErr.message);

        if (allowFallback) {
          console.log('[Ghostlight] Falling back to local deterministic narrative engine...');
          const fallbackResult = synthesizeFallbackNarrative(payload);
          res.json({
            success: true,
            processedBy: 'offline_fallback',
            model: 'deterministic_engine',
            notice: `Ollama encountered an error (${ollamaErr.message}). Formatted respectfully with local engine without inventing facts.`,
            data: fallbackResult,
          });
          return;
        }

        res.status(502).json({
          success: false,
          error: `Ollama analysis failed: ${ollamaErr.message}`,
          setupInstructions: 'Verify that Ollama has enough VRAM/RAM or try with fallback.',
          canUseFallback: true,
        });
        return;
      }
    }

    // If Ollama is not connected or model is missing
    if (allowFallback) {
      console.log('[Ghostlight] Ollama offline or model unavailable. Using local fallback engine.');
      const fallbackResult = synthesizeFallbackNarrative(payload);
      res.json({
        success: true,
        processedBy: 'offline_fallback',
        model: 'deterministic_engine',
        notice: health.error || 'Ollama is offline. Memory analyzed with local respectful engine.',
        data: fallbackResult,
      });
      return;
    }

    // Return detailed diagnostic error explaining why Ollama is offline and how to fix it
    res.status(503).json({
      success: false,
      error: health.error || 'Ollama is not running or model is not downloaded.',
      configuredModel: health.configuredModel,
      endpoint: health.endpoint,
      availableModels: health.availableModels,
      setupInstructions: [
        '1. Ensure Ollama is installed: curl -fsSL https://ollama.com/install.sh | sh',
        '2. Start the service: ollama serve',
        `3. Download the model: ollama pull ${health.configuredModel}`,
        '4. Reload this page or click "Retry Ollama Connection".'
      ],
      canUseFallback: true,
    });
  } catch (err: any) {
    console.error('[Ghostlight] Unexpected error in /api/analyze-memory:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while processing memory.',
    });
  }
});

// Ghost Narrator (Optional ElevenLabs Proxy)
app.post('/api/narrate', async (req: Request, res: Response): Promise<void> => {
  const { text } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    res.json({
      useBrowserSpeech: true,
      message: 'Browser SpeechSynthesis is the default zero-dependency voice engine. To use neural ElevenLabs voices, set ELEVENLABS_API_KEY in server/.env.',
    });
    return;
  }

  try {
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
    const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
        },
      }),
    });

    if (!elevenRes.ok) {
      throw new Error(`ElevenLabs returned ${elevenRes.status}`);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    const arrayBuffer = await elevenRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    res.status(500).json({
      useBrowserSpeech: true,
      error: `ElevenLabs TTS failed: ${err.message}. Falling back to browser speech synthesis.`,
    });
  }
});

// Serve frontend static build if available
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req: Request, res: Response, next: any) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  GHOSTLIGHT: STADIUM OF ECHOES`);
  console.log(`  Backend running on http://localhost:${PORT}`);
  console.log(`  Configured Gemma Model: ${process.env.GEMMA_MODEL || 'gemma3:4b'}`);
  console.log(`  Ollama Target: ${process.env.OLLAMA_HOST || 'http://localhost:11434'}`);
  console.log(`======================================================\n`);
});
