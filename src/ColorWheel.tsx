import { useRef, useEffect, useCallback, useState } from "react";
import "./ColorWheel.css";

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export interface ColorWheelValue {
  hue: number;       // 0-360
  lightness: number;  // 0-100
}

interface Props {
  size?: number;
  onChange?: (value: ColorWheelValue) => void;
  onInteract?: (value: ColorWheelValue) => void;
}

export function ColorWheel({ size = 280, onChange, onInteract }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("transparent");
  const isDragging = useRef(false);

  const radius = size / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const hue = (angle + 360) % 360;
          // Center = white (L=100), edge = vivid (L=50)
          const lightness = 100 - (dist / radius) * 50;

          const [r, g, b] = hslToRgb(hue, 100, lightness);
          const idx = (y * size + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [size, radius]);

  const getColorFromPosition = useCallback(
    (clientX: number, clientY: number): ColorWheelValue | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const dx = x - radius;
      const dy = y - radius;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > radius) return null;

      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const hue = (angle + 360) % 360;
      const lightness = 100 - (dist / radius) * 50;

      return { hue, lightness };
    },
    [radius]
  );

  const handlePointer = useCallback(
    (clientX: number, clientY: number, isStart: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const value = getColorFromPosition(clientX, clientY);
      if (!value) return;

      setPointerPos({ x, y });
      const [r, g, b] = hslToRgb(value.hue, 100, value.lightness);
      setCurrentColor(`rgb(${r},${g},${b})`);

      if (isStart) {
        onInteract?.(value);
      }
      onChange?.(value);
    },
    [getColorFromPosition, onChange, onInteract]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      handlePointer(e.clientX, e.clientY, true);
    },
    [handlePointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      handlePointer(e.clientX, e.clientY, false);
    },
    [handlePointer]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="color-wheel-container" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="color-wheel-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      {pointerPos && (
        <div
          className="color-wheel-cursor"
          style={{
            left: pointerPos.x,
            top: pointerPos.y,
            borderColor: currentColor,
          }}
        />
      )}
    </div>
  );
}
