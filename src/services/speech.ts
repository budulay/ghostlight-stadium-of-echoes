class GhostNarratorService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((state: 'idle' | 'speaking' | 'paused') => void) | null = null;
  private audioCtx: AudioContext | null = null;
  private ambientGainNode: GainNode | null = null;
  private rainGainNode: GainNode | null = null;
  private ambientRunning = false;
  private currentWeather: 'fog' | 'rain' = 'fog';
  private voiceMode: 'whisper' | 'tannoy' = 'tannoy';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public registerStateCallback(cb: (state: 'idle' | 'speaking' | 'paused') => void) {
    this.onStateChangeCallback = cb;
  }

  public setVoiceMode(mode: 'whisper' | 'tannoy') {
    this.voiceMode = mode;
  }

  public getVoiceMode(): 'whisper' | 'tannoy' {
    return this.voiceMode;
  }

  /**
   * Plays the iconic vintage stadium Tannoy announcement chime
   * (Two-tone resonant bell: 587Hz -> 440Hz)
   */
  public playTannoyChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (!this.audioCtx) {
          const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
          this.audioCtx = new AudioCtxClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;
        const master = this.audioCtx.createGain();
        master.gain.setValueAtTime(0.12, now);
        master.connect(this.audioCtx.destination);

        // First bell tone (D5 ~ 587Hz)
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc1.connect(gain1);
        gain1.connect(master);
        osc1.start(now);
        osc1.stop(now + 0.5);

        // Second bell tone (A4 ~ 440Hz)
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440.0, now + 0.28);
        gain2.gain.setValueAtTime(0.001, now);
        gain2.gain.setValueAtTime(0.35, now + 0.28);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        osc2.connect(gain2);
        gain2.connect(master);
        osc2.start(now + 0.28);
        osc2.stop(now + 0.9);

        setTimeout(() => resolve(), 700);
      } catch (e) {
        resolve();
      }
    });
  }

  public async speak(text: string, title?: string) {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported on this device.');
      return;
    }

    this.stop();

    // If Tannoy mode is active, play announcement chime first
    if (this.voiceMode === 'tannoy') {
      await this.playTannoyChime();
    }

    // Format narration
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

    if (this.voiceMode === 'tannoy') {
      // Tannoy speaker profile: slightly faster, measured announcement pitch
      utterance.rate = 0.89;
      utterance.pitch = 0.96;
    } else {
      // Intimate museum whisper profile: slow, deep, reverent
      utterance.rate = 0.83;
      utterance.pitch = 0.86;
    }

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
   * Toggles atmospheric background soundscape (Fog wind or Torrential Rain)
   */
  public toggleAmbientSound(enable?: boolean, weather?: 'fog' | 'rain'): boolean {
    if (typeof window === 'undefined') return false;

    if (weather) {
      this.currentWeather = weather;
    }

    const shouldEnable = enable !== undefined ? enable : !this.ambientRunning;

    if (!shouldEnable) {
      if (this.ambientGainNode && this.audioCtx) {
        this.ambientGainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.5);
      }
      if (this.rainGainNode && this.audioCtx) {
        this.rainGainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.5);
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
      if (!this.ambientGainNode) {
        this.ambientGainNode = this.audioCtx.createGain();
        this.ambientGainNode.connect(this.audioCtx.destination);
      }
      this.ambientGainNode.gain.setValueAtTime(0.001, now);
      this.ambientGainNode.gain.exponentialRampToValueAtTime(0.08, now + 1.5);

      // Low stadium sub-hum (55Hz pitch foundation)
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);

      osc.connect(filter);
      filter.connect(this.ambientGainNode);
      osc.start();

      // Atmospheric noise buffer (used for wind or rain)
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

      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = this.audioCtx.createBiquadFilter();
      if (this.currentWeather === 'rain') {
        // Rain profile: wider high-shelf hiss representing torrential terrace rain
        windFilter.type = 'highpass';
        windFilter.frequency.setValueAtTime(800, now);
      } else {
        // Fog wind profile: warm bandpass breath
        windFilter.type = 'bandpass';
        windFilter.frequency.setValueAtTime(320, now);
        windFilter.Q.setValueAtTime(1.8, now);
      }

      noiseSource.connect(windFilter);
      windFilter.connect(this.ambientGainNode);
      noiseSource.start();

      this.ambientRunning = true;
      return true;
    } catch (e) {
      console.warn('Web Audio ambient sound initialization failed:', e);
      this.ambientRunning = false;
      return false;
    }
  }

  public setWeather(weather: 'fog' | 'rain') {
    this.currentWeather = weather;
    if (this.ambientRunning) {
      this.toggleAmbientSound(false);
      setTimeout(() => this.toggleAmbientSound(true, weather), 200);
    }
  }

  public getWeather(): 'fog' | 'rain' {
    return this.currentWeather;
  }

  public isAmbientActive(): boolean {
    return this.ambientRunning;
  }
}

export const ghostNarrator = new GhostNarratorService();
