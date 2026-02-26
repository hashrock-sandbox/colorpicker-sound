/**
 * FM Synthesis Engine using Web Audio API
 */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.activeVoices = [];
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
  }

  /**
   * Play a sound defined by FM synthesis parameters.
   * @param {object} params - FM synthesis parameters
   * @param {number} params.carrierFreq - Carrier frequency in Hz
   * @param {number} params.carrierType - Carrier oscillator type
   * @param {number[]} params.operators - Array of modulator definitions
   *   Each: { ratio, index, type }
   * @param {object} params.envelope - { attack, decay, sustain, release }
   * @param {number} params.duration - Total note duration in seconds
   * @param {object} [params.sub] - Optional sub-oscillator { freq, type, gain }
   */
  play(params) {
    this.init();
    const now = this.ctx.currentTime;
    const { carrierFreq, carrierType, operators, envelope, duration, sub } = params;

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0, now);
    voiceGain.gain.linearRampToValueAtTime(1, now + envelope.attack);
    voiceGain.gain.linearRampToValueAtTime(
      envelope.sustain,
      now + envelope.attack + envelope.decay
    );
    voiceGain.gain.setValueAtTime(
      envelope.sustain,
      now + duration - envelope.release
    );
    voiceGain.gain.linearRampToValueAtTime(0, now + duration);
    voiceGain.connect(this.masterGain);

    // Build modulator chain (serial: each modulator modulates the next)
    let carrier = this.ctx.createOscillator();
    carrier.type = carrierType || 'sine';
    carrier.frequency.setValueAtTime(carrierFreq, now);

    let currentTarget = carrier.frequency;

    // Apply modulators in reverse order (last modulator modulates carrier directly)
    const modulators = [];
    for (let i = operators.length - 1; i >= 0; i--) {
      const op = operators[i];
      const modFreq = carrierFreq * op.ratio;
      const modDepth = modFreq * op.index;

      const mod = this.ctx.createOscillator();
      mod.type = op.type || 'sine';
      mod.frequency.setValueAtTime(modFreq, now);

      const modGain = this.ctx.createGain();
      modGain.gain.setValueAtTime(modDepth, now);

      // Index envelope: slight decay for natural feel
      if (op.indexDecay) {
        modGain.gain.exponentialRampToValueAtTime(
          modDepth * op.indexDecay,
          now + duration * 0.7
        );
      }

      mod.connect(modGain);
      modGain.connect(currentTarget);

      mod.start(now);
      mod.stop(now + duration);
      modulators.push(mod);
    }

    carrier.connect(voiceGain);
    carrier.start(now);
    carrier.stop(now + duration);

    // Optional sub-oscillator
    if (sub) {
      const subOsc = this.ctx.createOscillator();
      subOsc.type = sub.type || 'sine';
      subOsc.frequency.setValueAtTime(sub.freq || carrierFreq / 2, now);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(sub.gain || 0.2, now);

      // Apply same envelope shape
      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(sub.gain || 0.2, now + envelope.attack);
      subGain.gain.linearRampToValueAtTime(
        (sub.gain || 0.2) * envelope.sustain,
        now + envelope.attack + envelope.decay
      );
      subGain.gain.setValueAtTime(
        (sub.gain || 0.2) * envelope.sustain,
        now + duration - envelope.release
      );
      subGain.gain.linearRampToValueAtTime(0, now + duration);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start(now);
      subOsc.stop(now + duration);
    }

    // Cleanup
    setTimeout(() => {
      voiceGain.disconnect();
    }, (duration + 0.5) * 1000);
  }

  /**
   * Stop all active voices
   */
  stopAll() {
    if (!this.ctx) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    setTimeout(() => {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      }
    }, 150);
  }
}
