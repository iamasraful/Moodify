import { useApp } from "../context.jsx";
import { MOODS, NAV } from "../constants.js";

export default function Sidebar({ page, setPage }) {
  const { mood, user } = useApp();
  const m = MOODS[mood];
  return (
    <aside className="sidebar" style={{
      width:210, flexShrink:0, flexDirection:"column",
      padding:"20px 10px",
      overflowY:"auto",
      borderRight:"1px solid var(--border)",
    }}>
      {/* User pill */}
      <div style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"10px 12px", borderRadius:16, marginBottom:28,
        background:"var(--surface)",
        border:`1px solid ${m.color}25`,
        boxShadow:`0 0 24px ${m.dark}`,
        transition:"all 0.4s ease",
      }}>
        <div style={{
          width:36, height:36, borderRadius:11, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:19, background: m.dark,
          border:`1.5px solid ${m.color}40`,
          transition:"all 0.4s ease",
        }}>{user?.avatar}</div>
        <div style={{minWidth:0}}>
          <p style={{
            color:"var(--text)", fontWeight:600, fontSize:13,
            fontFamily:"var(--sans)", overflow:"hidden",
            textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:1,
          }}>{user?.name}</p>
          <p style={{
            fontSize:10, fontWeight:700, color:m.color,
            fontFamily:"var(--sans)", letterSpacing:"0.06em",
            transition:"color 0.4s",
          }}>{m.emoji} {m.label}</p>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex", flexDirection:"column", gap:2}}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display:"flex", alignItems:"center", gap:11,
              padding:"10px 13px", borderRadius:14,
              border:"none", cursor:"pointer", textAlign:"left",
              background: active ? m.dark : "transparent",
              borderLeft: active ? `2.5px solid ${m.color}` : "2.5px solid transparent",
              transition:"all 0.18s",
            }}
            onMouseEnter={e => { if(!active) e.currentTarget.style.background="var(--surface)"; }}
            onMouseLeave={e => { if(!active) e.currentTarget.style.background="transparent"; }}
            >
              <span style={{
                display:"inline-block",
                fontSize:16, width:18, textAlign:"center",
                color: active ? m.color : "var(--faint)",
                filter: active ? `drop-shadow(0 0 5px ${m.color})` : "none",
                transition:"all 0.18s",
              }}>{n.icon}</span>
              <span style={{
                fontSize:13, fontWeight: active ? 600 : 400,
                color: active ? m.color : "var(--muted)",
                fontFamily:"var(--sans)", transition:"all 0.18s",
              }}>{n.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom mood display */}
      <div style={{
        marginTop:"auto", padding:"14px 13px", borderRadius:16,
        background: m.dark, border:`1px solid ${m.color}20`,
        transition:"all 0.4s ease",
      }}>
        <p className="label" style={{marginBottom:6}}>Feeling</p>
        <p style={{
          color:m.color, fontFamily:"var(--serif)", fontSize:20,
          fontWeight:400, transition:"color 0.4s",
        }}>{m.label}</p>
      </div>
    </aside>
  );
}
