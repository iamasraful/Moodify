import { useApp } from "../context.jsx";
import { MOODS, NAV } from "../constants.js";

export default function BottomDock({ page, setPage }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  return (
    <nav className="btmdock" style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:90,
      flexDirection:"row",
      padding:"8px 6px 16px",
      background:"var(--bg-frosted-heavy)",
      backdropFilter:"blur(32px) saturate(200%)",
      WebkitBackdropFilter:"blur(32px) saturate(200%)",
      borderTop:"1px solid var(--border)",
      boxShadow:"0 -8px 32px rgba(0,0,0,0.2)",
      transition:"background 0.3s ease, border-color 0.3s ease",
    }}>
      {/* Mood-reactive top accent line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:1,
        background:`linear-gradient(90deg, transparent 0%, ${m.color}50 30%, ${m.color}70 50%, ${m.color}50 70%, transparent 100%)`,
        transition:"background 0.5s ease",
      }}/>

      {NAV.map(n => {
        const active = page === n.id;
        return (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", gap:4,
            padding:"6px 2px", borderRadius:14, border:"none",
            cursor:"pointer",
            background: active
              ? `linear-gradient(160deg, ${m.color}18 0%, ${m.color}06 100%)`
              : "transparent",
            position:"relative", transition:"all 0.22s ease",
          }}>
            {active && (
              <div style={{
                position:"absolute", top:-1, left:"50%",
                transform:"translateX(-50%)",
                width:22, height:2.5, borderRadius:2,
                background:m.color,
                boxShadow:`0 0 10px ${m.color}, 0 0 20px ${m.glow}`,
              }}/>
            )}
            <span style={{
              fontSize:18, lineHeight:1,
              color: active ? m.color : "var(--faint)",
              filter: active ? `drop-shadow(0 0 7px ${m.color})` : "none",
              transition:"all 0.22s",
            }}>{n.icon}</span>
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:"0.05em",
              textTransform:"uppercase", fontFamily:"var(--sans)",
              color: active ? m.color : "var(--faint)",
              transition:"color 0.22s",
            }}>{n.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
