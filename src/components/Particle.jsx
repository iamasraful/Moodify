import { useEffect } from "react";

export default function Particle({ x, y, emoji, color, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position:"fixed", left:x-12, top:y-10, zIndex:9999,
      fontSize:20, pointerEvents:"none",
      animation:"particleRise 1.1s ease-out forwards",
      filter:`drop-shadow(0 0 8px ${color})`,
    }}>{emoji}</div>
  );
}
