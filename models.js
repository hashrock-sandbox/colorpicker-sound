/**
 * Synesthesia Models
 *
 * Each model defines how colors map to FM synthesis parameters.
 * The same color produces entirely different sounds depending on the model's "personality".
 */

const MODELS = {

  /**
   * Model A: Messiaen
   * 性格：重層・発光・和声由来
   * - 3-op FM or 2-op + sub
   * - High index, integer ratios → stable, harmonic, "religious" tones
   * - Colors feel like layered stained glass
   * - Morph: layers accumulate/diminish, never muddy
   */
  messiaen: {
    name: 'Messiaen',
    description: '重層・発光・和声由来',
    colors: {
      red: {
        carrierFreq: 220,
        carrierType: 'sine',
        operators: [
          { ratio: 2, index: 3.5, type: 'sine', indexDecay: 0.4 },
          { ratio: 4, index: 2.0, type: 'sine', indexDecay: 0.6 },
          { ratio: 6, index: 1.0, type: 'sine', indexDecay: 0.5 }
        ],
        envelope: { attack: 0.08, decay: 0.3, sustain: 0.6, release: 0.8 },
        duration: 2.5,
        sub: { freq: 110, type: 'sine', gain: 0.15 }
      },
      orange: {
        carrierFreq: 277.18, // C#4
        carrierType: 'sine',
        operators: [
          { ratio: 2, index: 4.0, type: 'sine', indexDecay: 0.5 },
          { ratio: 3, index: 2.5, type: 'sine', indexDecay: 0.6 }
        ],
        envelope: { attack: 0.06, decay: 0.25, sustain: 0.65, release: 0.7 },
        duration: 2.2,
        sub: { freq: 138.59, type: 'sine', gain: 0.18 }
      },
      yellow: {
        // 強いミクスチャ、光の塊
        carrierFreq: 440,
        carrierType: 'sine',
        operators: [
          { ratio: 1, index: 5.0, type: 'sine', indexDecay: 0.3 },
          { ratio: 3, index: 3.0, type: 'sine', indexDecay: 0.4 },
          { ratio: 5, index: 1.5, type: 'sine', indexDecay: 0.5 }
        ],
        envelope: { attack: 0.03, decay: 0.2, sustain: 0.7, release: 0.6 },
        duration: 2.0,
        sub: { freq: 220, type: 'sine', gain: 0.2 }
      },
      green: {
        carrierFreq: 329.63, // E4
        carrierType: 'sine',
        operators: [
          { ratio: 2, index: 2.5, type: 'sine', indexDecay: 0.6 },
          { ratio: 4, index: 1.5, type: 'sine', indexDecay: 0.7 }
        ],
        envelope: { attack: 0.1, decay: 0.35, sustain: 0.55, release: 0.9 },
        duration: 2.8,
        sub: { freq: 164.81, type: 'sine', gain: 0.12 }
      },
      blue: {
        // 重なった半透明レイヤ
        carrierFreq: 196, // G3
        carrierType: 'sine',
        operators: [
          { ratio: 2, index: 4.5, type: 'sine', indexDecay: 0.7 },
          { ratio: 3, index: 3.0, type: 'sine', indexDecay: 0.8 },
          { ratio: 5, index: 1.2, type: 'sine', indexDecay: 0.9 }
        ],
        envelope: { attack: 0.15, decay: 0.4, sustain: 0.5, release: 1.2 },
        duration: 3.5,
        sub: { freq: 98, type: 'sine', gain: 0.2 }
      },
      purple: {
        carrierFreq: 261.63, // C4
        carrierType: 'sine',
        operators: [
          { ratio: 2, index: 3.8, type: 'sine', indexDecay: 0.5 },
          { ratio: 4, index: 2.2, type: 'sine', indexDecay: 0.6 },
          { ratio: 7, index: 0.8, type: 'sine', indexDecay: 0.8 }
        ],
        envelope: { attack: 0.12, decay: 0.35, sustain: 0.55, release: 1.0 },
        duration: 3.0,
        sub: { freq: 130.81, type: 'sine', gain: 0.15 }
      },
      white: {
        carrierFreq: 523.25, // C5
        carrierType: 'sine',
        operators: [
          { ratio: 1, index: 2.0, type: 'sine', indexDecay: 0.3 },
          { ratio: 2, index: 1.5, type: 'sine', indexDecay: 0.4 },
          { ratio: 3, index: 1.0, type: 'sine', indexDecay: 0.5 }
        ],
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 1.0 },
        duration: 2.5,
        sub: { freq: 261.63, type: 'sine', gain: 0.1 }
      }
    }
  },

  /**
   * Model B: Kandinsky
   * 性格：方向性・鋭さ・空間
   * - 2-op FM
   * - Bold ratio shifts → inharmonic, piercing or deep
   * - Yellow = high carrier, sharp attack; Blue = low, sustained
   * - Morph: always has forward/backward vector
   * - Purple transition → momentary instability
   */
  kandinsky: {
    name: 'Kandinsky',
    description: '方向性・鋭さ・空間',
    colors: {
      red: {
        carrierFreq: 330,
        carrierType: 'sawtooth',
        operators: [
          { ratio: 1.5, index: 6.0, type: 'sine', indexDecay: 0.2 },
          { ratio: 3.01, index: 3.0, type: 'sine', indexDecay: 0.3 }
        ],
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.4, release: 0.3 },
        duration: 1.5
      },
      orange: {
        carrierFreq: 392,
        carrierType: 'triangle',
        operators: [
          { ratio: 2.5, index: 5.0, type: 'sine', indexDecay: 0.25 },
          { ratio: 4.01, index: 2.5, type: 'sine', indexDecay: 0.3 }
        ],
        envelope: { attack: 0.015, decay: 0.12, sustain: 0.45, release: 0.35 },
        duration: 1.4
      },
      yellow: {
        // 高キャリア・鋭いアタック — piercing, bright, forward
        carrierFreq: 880,
        carrierType: 'sawtooth',
        operators: [
          { ratio: 3.0, index: 8.0, type: 'sine', indexDecay: 0.15 },
          { ratio: 7.01, index: 4.0, type: 'sine', indexDecay: 0.2 }
        ],
        envelope: { attack: 0.005, decay: 0.08, sustain: 0.3, release: 0.2 },
        duration: 1.0
      },
      green: {
        carrierFreq: 262,
        carrierType: 'triangle',
        operators: [
          { ratio: 2.0, index: 3.5, type: 'sine', indexDecay: 0.4 },
          { ratio: 5.0, index: 1.5, type: 'sine', indexDecay: 0.5 }
        ],
        envelope: { attack: 0.03, decay: 0.2, sustain: 0.5, release: 0.5 },
        duration: 1.8
      },
      blue: {
        // 低く沈む持続音 — deep, sinking, sustained
        carrierFreq: 82.41, // E2
        carrierType: 'sine',
        operators: [
          { ratio: 1.0, index: 2.0, type: 'sine', indexDecay: 0.8 },
          { ratio: 2.0, index: 1.5, type: 'sine', indexDecay: 0.9 }
        ],
        envelope: { attack: 0.2, decay: 0.5, sustain: 0.7, release: 1.5 },
        duration: 4.0
      },
      purple: {
        // 一瞬不安定化 — unstable, glitchy transition
        carrierFreq: 311.13,
        carrierType: 'sawtooth',
        operators: [
          { ratio: 1.414, index: 7.0, type: 'sine', indexDecay: 0.15 },
          { ratio: 5.1, index: 5.0, type: 'sine', indexDecay: 0.2 }
        ],
        envelope: { attack: 0.008, decay: 0.1, sustain: 0.35, release: 0.4 },
        duration: 1.6
      },
      white: {
        carrierFreq: 523.25,
        carrierType: 'triangle',
        operators: [
          { ratio: 1.0, index: 1.5, type: 'sine', indexDecay: 0.5 },
          { ratio: 2.0, index: 1.0, type: 'sine', indexDecay: 0.6 }
        ],
        envelope: { attack: 0.02, decay: 0.15, sustain: 0.5, release: 0.4 },
        duration: 1.5
      }
    }
  }
};
