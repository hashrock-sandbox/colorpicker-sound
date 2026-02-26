export interface Operator {
  ratio: number;
  index: number;
  type?: OscillatorType;
  indexDecay?: number;
}

export interface Envelope {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface SubOscillator {
  freq?: number;
  type?: OscillatorType;
  gain?: number;
}

export interface SynthParams {
  carrierFreq: number;
  carrierType?: OscillatorType;
  operators: Operator[];
  envelope: Envelope;
  duration: number;
  sub?: SubOscillator;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
  }

  play(params: SynthParams) {
    this.init();
    const ctx = this.ctx!;
    const masterGain = this.masterGain!;
    const now = ctx.currentTime;
    const { carrierFreq, carrierType, operators, envelope, duration, sub } =
      params;

    const voiceGain = ctx.createGain();
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
    voiceGain.connect(masterGain);

    // Build modulator chain (serial: each modulator modulates the next)
    const carrier = ctx.createOscillator();
    carrier.type = carrierType || "sine";
    carrier.frequency.setValueAtTime(carrierFreq, now);

    const currentTarget = carrier.frequency;

    // Apply modulators in reverse order (last modulator modulates carrier directly)
    for (let i = operators.length - 1; i >= 0; i--) {
      const op = operators[i];
      const modFreq = carrierFreq * op.ratio;
      const modDepth = modFreq * op.index;

      const mod = ctx.createOscillator();
      mod.type = op.type || "sine";
      mod.frequency.setValueAtTime(modFreq, now);

      const modGain = ctx.createGain();
      modGain.gain.setValueAtTime(modDepth, now);

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
    }

    carrier.connect(voiceGain);
    carrier.start(now);
    carrier.stop(now + duration);

    // Optional sub-oscillator
    if (sub) {
      const subOsc = ctx.createOscillator();
      subOsc.type = sub.type || "sine";
      subOsc.frequency.setValueAtTime(sub.freq || carrierFreq / 2, now);

      const subGain = ctx.createGain();
      const subGainVal = sub.gain || 0.2;
      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(subGainVal, now + envelope.attack);
      subGain.gain.linearRampToValueAtTime(
        subGainVal * envelope.sustain,
        now + envelope.attack + envelope.decay
      );
      subGain.gain.setValueAtTime(
        subGainVal * envelope.sustain,
        now + duration - envelope.release
      );
      subGain.gain.linearRampToValueAtTime(0, now + duration);

      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(now);
      subOsc.stop(now + duration);
    }

    // Cleanup
    setTimeout(() => {
      voiceGain.disconnect();
    }, (duration + 0.5) * 1000);
  }

  stopAll() {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(
      0,
      this.ctx.currentTime + 0.1
    );
    setTimeout(() => {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      }
    }, 150);
  }
}
