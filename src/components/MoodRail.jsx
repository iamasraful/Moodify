import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function MoodRail() {
  const { mood, setMood } = useApp();
  return (
    <div style={{
      display:"flex", gap:45, overflowX:"auto",
      padding:3, WebkitOverflowScrolling:"touch", borderRadius:18,
    }}>
      {Object.entries(MOODS).map(([key, m]) => (
        <button
          key={key}
          onClick={() => setMood(key)}
          style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:4, padding:"8px 11px", borderRadius:15, flexShrink:0, margin:2,
            border: mood===key ? `1.5px solid ${m.color}55` : "1.5px solid transparent",
            background: mood===key ? m.dark : "transparent",
            cursor:"pointer",
            transform: mood===key ? "scale(1.06)" : "scale(1)",
            boxShadow: mood===key ? `0 4px 18px ${m.glow}` : "none",
            transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <span style={{
            fontSize:18, lineHeight:1,
            filter: mood===key ? `drop-shadow(0 0 6px ${m.color})` : "none",
            transition:"filter 0.22s",
          }}>{m.emoji}</span>
          <span style={{
            fontSize:9, fontWeight:700, letterSpacing:"0.07em",
            textTransform:"uppercase", fontFamily:"var(--sans)",
            color: mood===key ? m.color : "var(--faint)",
            transition:"color 0.22s",
          }}>{m.label}</span>
        </button>
      ))}
    </div>
  );
}
