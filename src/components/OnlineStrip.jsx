import { MOODS } from "../constants.js";

export default function OnlineStrip({ posts }) {
  const seen = new Set();
  const recent = posts
    .filter(p => { if (seen.has(p.author)) return false; seen.add(p.author); return true; })
    .slice(0, 14);
  if (!recent.length) return null;

  return (
    <div style={{marginBottom:20}}>
      <p className="label" style={{marginBottom:12}}>Active now</p>
      <div style={{display:"flex", gap:12, overflowX:"auto", WebkitOverflowScrolling:"touch"}}>
        {recent.map((p, i) => {
          const pm = MOODS[p.mood] || MOODS.happy;
          return (
            <div key={p.author} style={{
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:6, flexShrink:0,
              animation:`fadeUp 0.4s ease ${i * 0.05}s both`,
            }}>
              <div style={{position:"relative"}}>
                <div style={{
                  width:46, height:46, borderRadius:15,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, background: pm.dark,
                  border:`1.5px solid ${pm.color}40`,
                  boxShadow:`0 4px 16px ${pm.glow}`,
                }}>{p.avatar}</div>
                <div style={{
                  position:"absolute", bottom:-3, right:-3,
                  width:16, height:16, borderRadius:6,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:8, background: pm.color,
                  border:"2px solid #080812",
                  boxShadow:`0 2px 8px ${pm.glow}`,
                }}>{pm.emoji}</div>
              </div>
              <p style={{
                color:"var(--faint)", fontSize:9, fontWeight:600,
                fontFamily:"var(--sans)", maxWidth:50,
                textAlign:"center", overflow:"hidden",
                textOverflow:"ellipsis", whiteSpace:"nowrap",
              }}>{p.author}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
