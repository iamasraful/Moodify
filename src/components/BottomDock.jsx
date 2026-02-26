import { useApp } from "../context.jsx";
import { MOODS, NAV } from "../constants.js";

export default function BottomDock({ page, setPage }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  return (
    <nav className="btmdock" style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:90,
      flexDirection:"row",
      padding:"8px 4px 14px",
      background:"rgba(8,8,18,0.94)",
      backdropFilter:"blur(28px) saturate(180%)",
      WebkitBackdropFilter:"blur(28px) saturate(180%)",
      borderTop:"1px solid var(--border)",
    }}>
      {NAV.map(n => {
        const active = page === n.id;
        return (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", gap:3,
            padding:"5px 2px", borderRadius:12, border:"none",
            cursor:"pointer", background:"transparent",
            position:"relative", transition:"all 0.18s",
          }}>
            {active && (
              <div style={{
                position:"absolute", top:-2, left:"50%",
                transform:"translateX(-50%)",
                width:18, height:2.5, borderRadius:2,
                background:m.color,
                boxShadow:`0 0 8px ${m.glow}`,
              }}/>
            )}
            <span style={{
              fontSize:17, lineHeight:1,
              color: active ? m.color : "rgba(255,255,255,0.2)",
              filter: active ? `drop-shadow(0 0 6px ${m.color})` : "none",
              transition:"all 0.18s",
            }}>{n.icon}</span>
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:"0.05em",
              textTransform:"uppercase", fontFamily:"var(--sans)",
              color: active ? m.color : "rgba(255,255,255,0.18)",
              transition:"color 0.18s",
            }}>{n.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
