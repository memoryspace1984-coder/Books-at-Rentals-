/**
 * Self-contained Web Audio API synthesizer for cute musical chimes
 * and gentle lo-fi study chords (no external audio files needed).
 */

class LoFiSoundEngine {
  private ctx: AudioContext | null = null;
  private isAmbientPlaying: boolean = false;
  private ambientInterval: number | null = null;
  private masterGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays a cute ascending musical harp/celeste chime when rental completes
   */
  public playPaymentChime() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Soft pentatonic chord: C5, E5, G5, B5, C6 (warm dreamlike scale)
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        // Warm sine wave with subtle triangle warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        // Envelope
        const startTime = now + idx * 0.09;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // Audio playback might be prevented by strict browser policies
    }
  }

  /**
   * Plays a subtle click / tap sound for buttons
   */
  public playTap() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  /**
   * Ambient Lo-Fi chord progression with gentle tape warmth
   */
  public toggleAmbient(): boolean {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return false;

      if (this.isAmbientPlaying) {
        this.stopAmbient();
        return false;
      }

      this.isAmbientPlaying = true;

      // Chord progressions in F major 7 / C major 9
      const chords = [
        [349.23, 440.0, 523.25, 659.25], // Fmaj7
        [329.63, 392.0, 493.88, 587.33], // Em7
        [293.66, 349.23, 440.0, 523.25], // Dm7
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
      ];

      let chordIndex = 0;

      const playChord = () => {
        if (!this.isAmbientPlaying || !this.ctx || !this.masterGain) return;
        const currentChord = chords[chordIndex % chords.length];
        const now = this.ctx.currentTime;

        currentChord.forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'sine';
          // Detune slightly for lush analog chorus effect
          osc.frequency.setValueAtTime(freq + (i % 2 === 0 ? 0.7 : -0.7), now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.045, now + 0.6);
          gain.gain.linearRampToValueAtTime(0.001, now + 3.2);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(now);
          osc.stop(now + 3.3);
        });

        chordIndex++;
      };

      playChord();
      this.ambientInterval = window.setInterval(playChord, 3400);

      return true;
    } catch {
      return false;
    }
  }

  public stopAmbient() {
    this.isAmbientPlaying = false;
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const soundEngine = new LoFiSoundEngine();
