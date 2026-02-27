import { useCallback, useEffect, useRef, useState } from "react";
import { AudioEngine } from "./audio-engine";
import { MODELS, type ModelKey } from "./models";
import { ColorWheel, type ColorWheelValue } from "./ColorWheel";
import { AboutPage } from "./AboutPage";
import "./App.css";

function hslToString(hue: number, lightness: number): string {
  return `hsl(${Math.round(hue)}, 100%, ${Math.round(lightness)}%)`;
}

export function App() {
  const engineRef = useRef<AudioEngine | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [currentModel, setCurrentModel] = useState<ModelKey>("messiaen");
  const [pickedColor, setPickedColor] = useState<ColorWheelValue | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wheelSize, setWheelSize] = useState(280);
  const [showAbout, setShowAbout] = useState(false);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new AudioEngine();
    }
    engineRef.current.init();
    return engineRef.current;
  }, []);

  const handleInteract = useCallback(
    (value: ColorWheelValue) => {
      const engine = getEngine();
      const model = MODELS[currentModel];
      const params = model.mapColor(value.hue, value.lightness);
      engine.play(params);
    },
    [currentModel, getEngine]
  );

  const handleChange = useCallback((value: ColorWheelValue) => {
    setPickedColor(value);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await fullscreenRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  // Sync fullscreen state with browser
  useEffect(() => {
    const onFullscreenChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Resize wheel in fullscreen to fill viewport
  useEffect(() => {
    if (!isFullscreen) {
      setWheelSize(280);
      return;
    }
    const updateSize = () => {
      const s = Math.min(window.innerWidth, window.innerHeight);
      setWheelSize(s);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isFullscreen]);

  if (showAbout) {
    return <AboutPage onBack={() => setShowAbout(false)} />;
  }

  return (
    <div
      ref={fullscreenRef}
      className={`app${isFullscreen ? " fullscreen" : ""}`}
    >
      {!isFullscreen && (
        <header>
          <div className="model-switcher">
            {(["messiaen", "kandinsky"] as const).map((key) => (
              <button
                key={key}
                className={`model-btn${currentModel === key ? " active" : ""}`}
                onClick={() => setCurrentModel(key)}
              >
                {MODELS[key].name}
              </button>
            ))}
          </div>
        </header>
      )}

      <main>
        <ColorWheel
          size={wheelSize}
          onChange={handleChange}
          onInteract={handleInteract}
        />
      </main>

      {/* Fullscreen overlay controls */}
      {isFullscreen && (
        <div className="fs-overlay">
          <div className="fs-model-switcher">
            {(["messiaen", "kandinsky"] as const).map((key) => (
              <button
                key={key}
                className={`fs-model-btn${currentModel === key ? " active" : ""}`}
                onClick={() => setCurrentModel(key)}
              >
                {MODELS[key].name}
              </button>
            ))}
          </div>
          <button className="fs-exit-btn" onClick={toggleFullscreen}>
            Exit
          </button>
        </div>
      )}

      {!isFullscreen && (
        <footer>
          <div className="status">
            {pickedColor ? (
              <>
                <span
                  className="color-swatch"
                  style={{
                    background: hslToString(
                      pickedColor.hue,
                      pickedColor.lightness
                    ),
                  }}
                />
                <span className="current-color">
                  H:{Math.round(pickedColor.hue)}° L:
                  {Math.round(pickedColor.lightness)}%
                </span>
              </>
            ) : (
              <span className="current-color">{"\u2014"}</span>
            )}
            <span className="current-model">{MODELS[currentModel].name}</span>
            <button className="fullscreen-btn" onClick={toggleFullscreen}>
              Fullscreen
            </button>
            <button
              className="about-link-btn"
              onClick={() => setShowAbout(true)}
            >
              About
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
