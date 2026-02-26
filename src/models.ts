import type { SynthParams } from "./audio-engine";

export type ModelKey = "messiaen" | "kandinsky";

export interface SynesthesiaModel {
  name: string;
  description: string;
  mapColor: (hue: number, lightness: number) => SynthParams;
}

/** Linear interpolation */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Lookup with interpolation on anchor points keyed by hue (0-360) */
function lerpAnchors(anchors: { hue: number; value: number }[], hue: number): number {
  const sorted = [...anchors].sort((a, b) => a.hue - b.hue);
  // Wrap around
  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    const next = sorted[(i + 1) % sorted.length];
    const currHue = curr.hue;
    let nextHue = next.hue;
    if (nextHue <= currHue) nextHue += 360;

    let h = hue;
    if (h < currHue && i === sorted.length - 1) h += 360;

    if (h >= currHue && h < nextHue) {
      const t = (h - currHue) / (nextHue - currHue);
      return lerp(curr.value, next.value, t);
    }
  }
  return sorted[0].value;
}

/**
 * Model A: Messiaen
 * 重層・発光・和声由来
 * - Integer ratio FM → harmonic, layered, "stained glass"
 * - Hue controls carrier frequency and harmonic color
 * - Lightness controls layer density and sustain
 */
function messiaenMap(hue: number, lightness: number): SynthParams {
  // Carrier frequency: warm curve across hue
  const carrierFreq = lerpAnchors(
    [
      { hue: 0, value: 220 },    // Red: A3
      { hue: 30, value: 277 },   // Orange: C#4
      { hue: 60, value: 440 },   // Yellow: A4 (bright peak)
      { hue: 120, value: 330 },  // Green: E4
      { hue: 240, value: 196 },  // Blue: G3 (deep)
      { hue: 270, value: 262 },  // Purple: C4
      { hue: 330, value: 220 },  // Back toward red
    ],
    hue
  );

  // Lightness factor: 50 (edge, vivid) to 100 (center, white)
  // t=0 at edge (L=50), t=1 at center (L=100)
  const lt = (lightness - 50) / 50;

  // Brighter → more operators active, higher index
  const baseIndex = lerp(4.5, 1.5, lt);
  const secondIndex = lerp(3.0, 1.0, lt);
  const thirdIndex = lerp(1.5, 0.3, lt);

  // Ratio selection varies by hue region
  const ratio2 = hue > 180 ? 3 : 2;
  const ratio3 = hue > 180 ? 5 : 4;

  return {
    carrierFreq,
    carrierType: "sine",
    operators: [
      { ratio: 2, index: baseIndex, type: "sine", indexDecay: lerp(0.3, 0.6, lt) },
      { ratio: ratio2, index: secondIndex, type: "sine", indexDecay: lerp(0.4, 0.7, lt) },
      { ratio: ratio3, index: thirdIndex, type: "sine", indexDecay: lerp(0.5, 0.8, lt) },
    ],
    envelope: {
      attack: lerp(0.03, 0.15, lt),
      decay: lerp(0.2, 0.4, lt),
      sustain: lerp(0.7, 0.4, lt),
      release: lerp(0.6, 1.2, lt),
    },
    duration: lerp(2.0, 3.5, lt),
    sub: {
      freq: carrierFreq / 2,
      type: "sine",
      gain: lerp(0.2, 0.08, lt),
    },
  };
}

/**
 * Model B: Kandinsky
 * 方向性・鋭さ・空間
 * - Bold inharmonic ratios → piercing, geometric
 * - Hue controls direction (high freq vs low freq)
 * - Lightness controls sharpness / attack
 */
function kandinskyMap(hue: number, lightness: number): SynthParams {
  // Carrier: wide range, yellow=high, blue=low
  const carrierFreq = lerpAnchors(
    [
      { hue: 0, value: 330 },    // Red
      { hue: 30, value: 392 },   // Orange
      { hue: 60, value: 880 },   // Yellow: piercing high
      { hue: 120, value: 262 },  // Green
      { hue: 240, value: 82 },   // Blue: deep low
      { hue: 270, value: 311 },  // Purple
      { hue: 330, value: 330 },  // Back to red
    ],
    hue
  );

  const lt = (lightness - 50) / 50;

  // Carrier type: shifts by hue
  let carrierType: OscillatorType;
  if (hue < 90 || hue > 300) {
    carrierType = "sawtooth"; // Warm/hot colors: aggressive
  } else if (hue < 180) {
    carrierType = "triangle"; // Green region: softer
  } else {
    carrierType = "sine"; // Cool colors: pure
  }

  // Inharmonic ratios for bold geometric feel
  const ratio1 = hue > 240 && hue < 300 ? 1.414 : lerp(1.5, 3.0, hue / 360);
  const ratio2 = lerp(3.01, 7.01, hue / 360);

  const baseIndex = lerp(8.0, 2.0, lt);
  const secondIndex = lerp(5.0, 1.0, lt);

  return {
    carrierFreq,
    carrierType,
    operators: [
      { ratio: ratio1, index: baseIndex, type: "sine", indexDecay: lerp(0.15, 0.5, lt) },
      { ratio: ratio2, index: secondIndex, type: "sine", indexDecay: lerp(0.2, 0.6, lt) },
    ],
    envelope: {
      attack: lerp(0.005, 0.2, lt),
      decay: lerp(0.08, 0.5, lt),
      sustain: lerp(0.3, 0.7, lt),
      release: lerp(0.2, 1.5, lt),
    },
    duration: lerp(1.0, 4.0, lt),
  };
}

export const MODELS: Record<ModelKey, SynesthesiaModel> = {
  messiaen: {
    name: "Messiaen",
    description: "重層・発光・和声由来",
    mapColor: messiaenMap,
  },
  kandinsky: {
    name: "Kandinsky",
    description: "方向性・鋭さ・空間",
    mapColor: kandinskyMap,
  },
};
