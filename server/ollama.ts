import { AnalyzedMemory, HealthStatus } from '../src/types/memory.js';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const GEMMA_MODEL = process.env.GEMMA_MODEL || 'gemma3:4b';
const REQUEST_TIMEOUT_MS = 60000; // 60 seconds for local LLM inference

export async function checkOllamaHealth(): Promise<HealthStatus['ollama']> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        connected: false,
        endpoint: OLLAMA_HOST,
        configuredModel: GEMMA_MODEL,
        modelAvailable: false,
        availableModels: [],
        error: `Ollama returned HTTP status ${res.status}: ${res.statusText}`,
      };
    }

    const data = (await res.json()) as { models?: Array<{ name: string; model: string }> };
    const models = (data.models || []).map((m) => m.name);
    const modelAvailable = models.some(
      (m) => m.toLowerCase().includes(GEMMA_MODEL.toLowerCase()) || GEMMA_MODEL.toLowerCase().includes(m.toLowerCase())
    );

    return {
      connected: true,
      endpoint: OLLAMA_HOST,
      configuredModel: GEMMA_MODEL,
      modelAvailable,
      availableModels: models,
      error: !modelAvailable
        ? `Model "${GEMMA_MODEL}" is not yet downloaded. Run: ollama pull ${GEMMA_MODEL}`
        : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      endpoint: OLLAMA_HOST,
      configuredModel: GEMMA_MODEL,
      modelAvailable: false,
      availableModels: [],
      error: `Could not connect to Ollama at ${OLLAMA_HOST}. (${message}). Run: ollama serve`,
    };
  }
}

const SYSTEM_PROMPT = `You are GHOSTLIGHT, the silent keeper of the Stadium of Echoes—an interactive museum where football memories live forever.
Your task is to transform a user's submitted football memory into a structured, cinematic museum exhibit.

STRICT EDITORIAL & ETHICAL RULES:
1. NEVER invent historical facts, match scores, clubs, stadiums, dates, or identities not supplied by the user.
2. Separate user-grounded facts from interpretive, atmospheric prose.
3. Explicitly identify what information is missing or lost to time in "unknowns".
4. Do NOT pretend to speak as or reproduce the voice of deceased people. Focus reverently on the narrator's emotional bond, sensory fragments, and the echoes of the stadium.
5. Write with profound cinematic elegance, respectful nostalgia, and poetic gravity (like an exhibit plaque in a midnight art museum).

You MUST output ONLY a valid JSON object matching this exact schema:
{
  "title": "A short, evocative, poetic exhibit title (uppercase or title case)",
  "year": 1998, // or null if unknown or not stated
  "theme": "The core thematic soul of the memory (e.g. 'Generational Reverence', 'The Communion of Rain', 'Unbroken Vigil')",
  "emotion": "Primary emotional frequency (e.g. 'Awe & Yearning', 'Melancholy Ecstasy')",
  "story": "A beautifully written, 3 to 5 sentence cinematic narrative of the memory. Honor the atmosphere—floodlights, cold mist, roaring stands, hands held, silence, and echoes. Grounded purely in what the user provided without fabricating players or outcomes.",
  "epitaph": "A poignant closing inscription (1 sentence, e.g. 'Some matches end. Some memories never do.')",
  "tags": ["Array", "of", "4-6", "thematic", "keywords"],
  "known_facts": ["List of distinct factual details explicitly confirmed in the user submission"],
  "unknowns": ["List of missing or unrecorded details lost to time (e.g. specific opponent, final score, exact ground, etc.)"]
}`;

export async function analyzeMemoryWithOllama(input: {
  memoryText: string;
  title?: string;
  year?: number | null;
  club?: string;
  stadium?: string;
}): Promise<AnalyzedMemory> {
  const userPromptContent = `Transform this football memory for the Stadium of Echoes exhibit:

USER SUBMISSION:
"""
${input.memoryText.trim()}
"""
${input.title ? `User Suggested Title: ${input.title}` : ''}
${input.year ? `User Stated Year: ${input.year}` : ''}
${input.club ? `User Stated Club: ${input.club}` : ''}
${input.stadium ? `User Stated Stadium: ${input.stadium}` : ''}

Remember: Return strictly valid JSON adhering to the specified schema. Do not invent any match score, player, or unmentioned factual claim.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GEMMA_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPromptContent },
        ],
        format: 'json',
        stream: false,
        options: {
          temperature: 0.65,
          top_p: 0.9,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as { message?: { content: string } };
    const content = data.message?.content?.trim();

    if (!content) {
      throw new Error('Ollama returned an empty response.');
    }

    // Parse the JSON output
    const parsed = cleanAndParseJSON(content);
    return validateAndNormalizeResponse(parsed, input);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Extracts and parses JSON safely even if wrapped in markdown codeblocks
 */
function cleanAndParseJSON(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Find the outermost json braces if any stray text exists
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * Validates and ensures fields match the AnalyzedMemory contract
 */
function validateAndNormalizeResponse(
  data: any,
  input: { memoryText: string; title?: string; year?: number | null; club?: string; stadium?: string }
): AnalyzedMemory {
  const title = (data.title && typeof data.title === 'string' && data.title.trim()) ||
    input.title ||
    'THE UNTITLED ECHO';

  let year: number | null = null;
  if (typeof data.year === 'number' && !isNaN(data.year) && data.year > 1850 && data.year < 2100) {
    year = data.year;
  } else if (input.year) {
    year = Number(input.year);
  }

  const theme = (data.theme && typeof data.theme === 'string') || 'Echoes in the Turnstile';
  const emotion = (data.emotion && typeof data.emotion === 'string') || 'Solemn Reverence & Nostalgia';
  const story = (data.story && typeof data.story === 'string' && data.story.trim()) || input.memoryText;
  const epitaph = (data.epitaph && typeof data.epitaph === 'string' && data.epitaph.trim()) ||
    'Some matches end. Some memories never do.';

  const tags = Array.isArray(data.tags) && data.tags.length > 0
    ? data.tags.filter((t: any) => typeof t === 'string' && t.trim()).slice(0, 8)
    : ['Stadium Echo', 'Night Match', 'Memory'];

  const known_facts = Array.isArray(data.known_facts) && data.known_facts.length > 0
    ? data.known_facts.filter((f: any) => typeof f === 'string')
    : [
        ...(input.club ? [`Associated club: ${input.club}`] : []),
        ...(input.stadium ? [`Stadium: ${input.stadium}`] : []),
        ...(year ? [`Approximate year: ${year}`] : []),
        'First-hand attendee recollection'
      ];

  const unknowns = Array.isArray(data.unknowns) && data.unknowns.length > 0
    ? data.unknowns.filter((u: any) => typeof u === 'string')
    : [
        'Precise match date',
        'Final official scoreline',
        'Complete attendance register'
      ];

  return {
    title: title.toUpperCase(),
    year,
    theme,
    emotion,
    story,
    epitaph,
    tags,
    known_facts,
    unknowns,
  };
}

/**
 * Intelligent deterministic memory synthesis engine used as guaranteed offline fallback
 * if Ollama is not yet downloaded or running. Follows the EXACT strict AI rules:
 * - Separates knowns from unknowns
 * - Never invents facts or scores
 * - Generates poetic exhibit prose
 */
export function synthesizeFallbackNarrative(input: {
  memoryText: string;
  title?: string;
  year?: number | null;
  club?: string;
  stadium?: string;
}): AnalyzedMemory {
  const text = input.memoryText.trim();
  
  // Extract year if present in text or input
  let detectedYear: number | null = input.year ? Number(input.year) : null;
  if (!detectedYear) {
    const yearMatch = text.match(/\b(19\d{2}|20[0-2]\d)\b/);
    if (yearMatch) {
      detectedYear = parseInt(yearMatch[1], 10);
    }
  }

  // Determine emotional theme from vocabulary cues
  const lower = text.toLowerCase();
  let theme = "Eternal Echoes of the Pitch";
  let emotion = "Quiet Wonder & Reverence";
  let epitaph = "Some matches end. Some memories never do.";

  if (lower.includes("grandfather") || lower.includes("father") || lower.includes("dad") || lower.includes("hand") || lower.includes("uncle")) {
    theme = "Generational Heritage & Guiding Hands";
    emotion = "Deep Nostalgia & Sacred Bond";
    epitaph = "Long after turnstiles close, the guiding hand endures.";
  } else if (lower.includes("rain") || lower.includes("cold") || lower.includes("wet") || lower.includes("mud")) {
    theme = "Communion Through Tempest & Roar";
    emotion = "Defiant Exhilaration & Brotherhood";
    epitaph = "The sky poured, but the brotherhood held fast.";
  } else if (lower.includes("lost") || lower.includes("heartbreak") || lower.includes("cry") || lower.includes("tears") || lower.includes("sad")) {
    theme = "Noble Grief of the Faithful";
    emotion = "Poignant Longing & Devotion";
    epitaph = "Defeat fades. The devotion remains untouchable.";
  } else if (lower.includes("won") || lower.includes("champion") || lower.includes("cup") || lower.includes("goal") || lower.includes("limbs")) {
    theme = "The Instant of Collective Rapture";
    emotion = "Unfiltered Ecstasy & Timelessness";
    epitaph = "A single second that reverberates for eternity.";
  }

  // Synthesize respectful, poetic narrative preserving all facts without inventing any
  let title = input.title?.trim() || "";
  if (!title) {
    if (lower.includes("light") || lower.includes("floodlight")) {
      title = "WHERE FLOODLIGHTS BURN";
    } else if (lower.includes("rain") || lower.includes("derby")) {
      title = "WHISPERS IN THE DOWNPOUR";
    } else if (lower.includes("first") || lower.includes("child")) {
      title = "THE FIRST GATE";
    } else {
      title = "CATHEDRAL OF THE UNFORGOTTEN";
    }
  }

  const known_facts: string[] = [];
  if (detectedYear) known_facts.push(`Recalled timeframe: approximately ${detectedYear}`);
  if (input.club) known_facts.push(`Associated club: ${input.club}`);
  if (input.stadium) known_facts.push(`Ground location: ${input.stadium}`);
  
  if (lower.includes("grandfather")) known_facts.push("Accompanied by grandfather");
  else if (lower.includes("father") || lower.includes("dad")) known_facts.push("Accompanied by father");
  else if (lower.includes("friend")) known_facts.push("Attended in the company of friends");

  if (lower.includes("lights") || lower.includes("night")) known_facts.push("Night fixture under floodlights");
  if (lower.includes("terrace") || lower.includes("stand")) known_facts.push("Watched from the stadium stands/terraces");
  if (known_facts.length === 0) known_facts.push("Personal eyewitness memory of match atmosphere");

  const unknowns: string[] = [];
  if (!input.club) unknowns.push("Participating football clubs unknown or unspecified");
  if (!input.stadium) unknowns.push("Exact stadium and host city unrecorded");
  if (!detectedYear) unknowns.push("Precise year and fixture date lost to memory");
  unknowns.push("Final match scoreline and goalscorer register omitted");
  unknowns.push("Specific tactical events absorbed by atmospheric recall");

  const tags: string[] = ["Echo", "Stadium", "Atmosphere"];
  if (detectedYear) tags.push(`${detectedYear}`);
  if (input.club) tags.push(input.club);
  if (lower.includes("floodlight") || lower.includes("light")) tags.push("Floodlights");
  if (lower.includes("terrace")) tags.push("Terraces");

  const story = `Across the distance of passing years, the physical details may soften, but the heartbeat of that night remains pristine. ${
    detectedYear ? `In approximately ${detectedYear}, ` : 'On that unforgettable evening, '
  }the stadium stood not merely as concrete and steel, but as a living cathedral illuminated against the midnight sky. ${
    text.length > 200 ? text.slice(0, 190) + '...' : text
  } When the match subsided and the stands grew still, this moment carved its permanent light into the stands.`;

  return {
    title: title.toUpperCase(),
    year: detectedYear,
    theme,
    emotion,
    story,
    epitaph,
    tags,
    known_facts,
    unknowns,
  };
}
