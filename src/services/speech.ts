class GhostNarratorService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((state: 'idle' | 'speaking' | 'paused') => void) | null = null;
  private audioCtx: AudioContext | null = null;
  private ambientGainNode: GainNode | null = null;
  private ambientRunning = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public registerStateCallback(cb: (state: 'idle' | 'speaking' | 'paused') => void) {
    this.onStateChangeCallback = cb;
  }

  public speak(text: string, title?: string) {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported on this device.');
      return;
    }

    this.stop();

    // Prepare text: read title then story then epitaph
    const formattedNarrative = `${title ? `${title}. ` : ''}${text}`;
    const utterance = new SpeechSynthesisUtterance(formattedNarrative);

    // Pick best available voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('george') ||
          v.name.toLowerCase().includes('oliver') ||
          v.name.toLowerCase().includes('uk') ||
          v.name.toLowerCase().includes('gb') ||
          v.name.toLowerCase().includes('male'))
    ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Atmospheric documentary pacing
    utterance.rate = 0.86;
    utterance.pitch = 0.88;

    utterance.onstart = () => {
      this.onStateChangeCallback?.('speaking');
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.onStateChangeCallback?.('idle');
    };

    utterance.onerror = (e) => {
      console.warn('Narrator error:', e);
      this.currentUtterance = null;
      this.onStateChangeCallback?.('idle');
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.onStateChangeCallback?.('paused');
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.onStateChangeCallback?.('speaking');
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.onStateChangeCallback?.('idle');
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth?.speaking);
  }

  /**
   * Generates a gentle, cinematic night stadium soundscape
   * (distant wind and warm 55Hz sub-bass resonant hum) using Web Audio API
   */
  public toggleAmbientSound(enable?: boolean): boolean {
    if (typeof window === 'undefined') return false;

    const shouldEnable = enable !== undefined ? enable : !this.ambientRunning;

    if (!shouldEnable) {
      if (this.ambientGainNode && this.audioCtx) {
        this.ambientGainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.5);
      }
      this.ambientRunning = false;
      return false;
    }

    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // Master ambient gain
      this.ambientGainNode = this.audioCtx.createGain();
      this.ambientGainNode.gain.setValueAtTime(0.001, now);
      this.ambientGainNode.gain.exponentialRampToValueAtTime(0.07, now + 2);
      this.ambientGainNode.connect(this.audioCtx.destination);

      // Low stadium sub-hum (55Hz pitch foundation)
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);

      // Warm low-pass filter
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);

      osc.connect(filter);
      filter.connect(this.ambientGainNode);
      osc.start();

      // Atmospheric filtered pink noise for stadium night wind
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.035;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const windFilter = this.audioCtx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, now);
      windFilter.Q.setValueAtTime(1.8, now);

      whiteNoise.connect(windFilter);
      windFilter.connect(this.ambientGainNode);
      whiteNoise.start();

      this.ambientRunning = true;
      return true;
    } catch (e) {
      console.warn('Web Audio ambient sound initialization failed:', e);
      this.ambientRunning = false;
      return false;
    }
  }

  public isAmbientActive(): boolean {
    return this.ambientRunning;
  }
}

export const ghostNarrator = new GhostNarratorService();
