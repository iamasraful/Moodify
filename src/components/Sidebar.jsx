import { useApp } from "../context.jsx";
import { MOODS, NAV } from "../constants.js";

export default function Sidebar({ page, setPage }) {
  const { mood, user } = useApp();
  const m = MOODS[mood];
  return (
    <aside className="sidebar" style={{
      width:214, flexShrink:0, flexDirection:"column",
      padding:"20px 12px",
      overflowY:"auto",
      borderRight:"1px solid var(--border)",
    }}>
      {/* User pill */}
      <div style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"11px 13px", borderRadius:18, marginBottom:28,
        background:`linear-gradient(145deg, ${m.color}12 0%, var(--surface) 100%)`,
        border:`1px solid ${m.color}30`,
        boxShadow:`0 0 28px ${m.dark}, inset 0 1px 0 ${m.color}15`,
        transition:"all 0.45s ease",
        position:"relative", overflow:"hidden",
      }}>
        {/* Inner shimmer line */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg, transparent, ${m.color}50, transparent)`,
          transition:"background 0.45s",
        }}/>
        <div style={{
          width:38, height:38, borderRadius:12, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:19, background: m.dark,
          border:`1.5px solid ${m.color}40`,
          boxShadow:`0 0 16px ${m.glow}`,
          transition:"all 0.45s ease",
        }}>{user?.avatar}</div>
        <div style={{minWidth:0}}>
          <p style={{
            color:"var(--text)", fontWeight:600, fontSize:13,
            fontFamily:"var(--sans)", overflow:"hidden",
            textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2,
          }}>{user?.name}</p>
          <p style={{
            fontSize:10, fontWeight:700, color:m.color,
            fontFamily:"var(--sans)", letterSpacing:"0.07em",
            transition:"color 0.45s",
          }}>{m.emoji} {m.label}</p>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex", flexDirection:"column", gap:3}}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display:"flex", alignItems:"center", gap:11,
              padding:"10px 13px", borderRadius:14,
              border: active ? `1px solid ${m.color}22` : "1px solid transparent",
              cursor:"pointer", textAlign:"left",
              background: active
                ? `linear-gradient(125deg, ${m.color}16 0%, ${m.color}06 100%)`
                : "transparent",
              boxShadow: active ? `0 4px 18px ${m.dark}, inset 0 1px 0 ${m.color}15` : "none",
              transition:"all 0.2s ease",
              position:"relative",
            }}
            onMouseEnter={e => { if(!active) e.currentTarget.style.background="var(--surface)"; }}
            onMouseLeave={e => { if(!active) e.currentTarget.style.background="transparent"; }}
            >
              {active && (
                <div style={{
                  position:"absolute", left:0, top:"50%", transform:"translateY(-50%)",
                  width:3, height:"60%", borderRadius:"0 2px 2px 0",
                  background:m.color,
                  boxShadow:`0 0 10px ${m.color}`,
                }}/>
              )}
              <span style={{
                display:"inline-block",
                fontSize:16, width:18, textAlign:"center",
                color: active ? m.color : "var(--faint)",
                filter: active ? `drop-shadow(0 0 6px ${m.color})` : "none",
                transition:"all 0.2s",
              }}>{n.icon}</span>
              <span style={{
                fontSize:13, fontWeight: active ? 600 : 400,
                color: active ? m.color : "var(--muted)",
                fontFamily:"var(--sans)", transition:"all 0.2s",
              }}>{n.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom mood display */}
      <div style={{
        marginTop:"auto", padding:"15px 14px", borderRadius:18,
        background:`linear-gradient(145deg, ${m.color}14 0%, var(--surface) 100%)`,
        border:`1px solid ${m.color}22`,
        boxShadow:`inset 0 1px 0 ${m.color}18`,
        transition:"all 0.45s ease",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg, transparent, ${m.color}45, transparent)`,
          transition:"background 0.45s",
        }}/>
        <p className="label" style={{marginBottom:6}}>Currently feeling</p>
        <p style={{
          color:m.color, fontFamily:"var(--serif)", fontSize:21,
          fontWeight:400, transition:"color 0.45s",
          filter:`drop-shadow(0 0 10px ${m.glow})`,
        }}>{m.label}</p>
      </div>
    </aside>
  );
}
