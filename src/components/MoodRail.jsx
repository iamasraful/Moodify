import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function MoodRail() {
  const { mood, setMood } = useApp();
  return (
    <div style={{
      display:"flex", gap:20, overflowX:"auto",
      padding:"4px 3px", WebkitOverflowScrolling:"touch",
    }}>
      {Object.entries(MOODS).map(([key, m]) => {
        const active = mood === key;
        return (
          <button
            key={key}
            onClick={() => setMood(key)}
            style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              gap:5, padding:"8px 16px", borderRadius:50, flexShrink:0,
              border: active ? `1px solid ${m.color}45` : "1px solid transparent",
              background: active
                ? `linear-gradient(160deg, ${m.color}18 0%, ${m.color}08 100%)`
                : "transparent",
              cursor:"pointer",
              transform: active ? "scale(1.05)" : "scale(1)",
              // boxShadow: active
              //   ? `0 4px 20px ${m.glow}, inset 0 1px 0 ${m.color}20`
              //   : "none",
              transition:"all 0.24s cubic-bezier(0.34,1.56,0.64,1)",
              position:"relative",
            }}
          >
            <span style={{
              fontSize:19, lineHeight:1,
              filter: active ? `drop-shadow(0 0 7px ${m.color})` : "none",
              transition:"filter 0.24s",
            }}>{m.emoji}</span>
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:"0.07em",
              textTransform:"uppercase", fontFamily:"var(--sans)",
              color: active ? m.color : "var(--faint)",
              transition:"color 0.24s",
            }}>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
