import { useState, useEffect } from "react";
import { useApp } from "../context.jsx";
import { MOODS, AVATARS } from "../constants.js";
import { sanitize } from "../helpers.js";
import { storageGet, storageSet } from "../storage.js";

export default function Profile() {
  const { mood, user, setUser, toast } = useApp();
  const m = MOODS[mood];
  const [posts, setPosts]     = useState([]);
  const [name, setName]       = useState(user?.name || "");
  const [avatar, setAvatar]   = useState(user?.avatar || "🌟");
  const [editing, setEditing] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      const all = await storageGet("posts", true) || [];
      setPosts(all.filter(p => p.author === user?.name));
    })();
  }, [user]);

  const save = async () => {
    const n = sanitize(name);
    if (!n || n.length < 2) { setError("Name must be at least 2 characters"); return; }
    const u = { name: n, avatar };
    setUser(u);
    await storageSet("user", u);
    setEditing(false);
    toast("Profile updated", "✦");
  };

  const totalR = posts.reduce((a,p) => a + Object.values(p.reactions||{}).reduce((x,y)=>x+y,0), 0);

  return (
    <div style={{display:"flex", flexDirection:"column", gap:14}}>
      {/* Hero */}
      <div style={{
        borderRadius:"var(--radius-xl)", padding:"36px 24px 28px",
        textAlign:"center",
        background:`linear-gradient(160deg, ${m.dark} 0%, rgba(255,255,255,0.01) 60%)`,
        border:`1px solid ${m.color}15`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", width:180, height:180, borderRadius:"50%",
          background:`radial-gradient(circle, ${m.color}12, transparent)`,
          top:-70, right:-60, pointerEvents:"none",
          transition:"all 0.4s",
        }}/>
        <div style={{
          width:76, height:76, borderRadius:25, margin:"0 auto 16px",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:40, background:m.dark, border:`2px solid ${m.color}30`,
          boxShadow:`0 0 40px ${m.glow}, 0 16px 40px rgba(0,0,0,0.4)`,
          transition:"all 0.4s",
        }}>{user?.avatar}</div>
        <h2 style={{
          fontFamily:"var(--serif)", fontSize:"clamp(24px,6vw,36px)",
          fontWeight:400, color:"var(--text)", margin:"0 0 6px",
          letterSpacing:"-1px",
        }}>{user?.name}</h2>
        <p style={{
          color:m.color, fontSize:11, fontWeight:700,
          fontFamily:"var(--sans)", letterSpacing:"0.1em",
          textTransform:"uppercase", filter:`drop-shadow(0 0 8px ${m.glow})`,
          transition:"all 0.4s",
        }}>{m.emoji} {m.label}</p>
      </div>

      {/* Stats grid */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
        {[
          {l:"Posts",v:posts.length,i:"◎"},
          {l:"Reactions",v:totalR,i:"✦"},
        ].map(s => (
          <div key={s.l} style={{
            borderRadius:18, padding:"18px", textAlign:"center",
            background:"var(--surface)", border:"1px solid var(--border)",
          }}>
            <div style={{fontSize:16, marginBottom:8, color:"var(--faint)"}}>{s.i}</div>
            <p style={{color:"var(--text)", fontWeight:500, fontSize:24, fontFamily:"var(--serif)", marginBottom:4, letterSpacing:"-0.5px"}}>{s.v}</p>
            <p className="label">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Edit */}
      {editing
        ? (
          <div className="card" style={{padding:"22px 24px"}}>
            <p className="label" style={{marginBottom:16}}>Edit Profile</p>
            <div style={{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:7, marginBottom:18}}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setAvatar(a)} style={{
                  aspectRatio:"1", borderRadius:12, fontSize:18,
                  cursor:"pointer", border:"none",
                  background: avatar===a ? "rgba(139,92,246,0.2)" : "var(--surface2)",
                  outline: avatar===a ? "2px solid rgba(139,92,246,0.7)" : "2px solid transparent",
                  outlineOffset:2, transform: avatar===a?"scale(1.12)":"scale(1)",
                  transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                }}>{a}</button>
              ))}
            </div>
            <input
              className="input-base"
              value={name}
              onChange={e => { setName(e.target.value.slice(0,20)); setError(""); }}
              maxLength={20}
              style={{
                padding:"13px 16px", fontSize:15, fontWeight:500,
                borderRadius:13, marginBottom:12,
                "--accent":`${m.color}60`, "--accent-dim":m.dark,
              }}
            />
            {error && <p style={{color:"#F43F5E", fontSize:12, marginBottom:10, fontFamily:"var(--sans)"}}>{error}</p>}
            <div style={{display:"flex", gap:9}}>
              <button onClick={save} style={{
                flex:1, padding:"12px 0", borderRadius:12, border:"none",
                background:m.color, color:"#000", fontSize:12, fontWeight:700,
                cursor:"pointer", fontFamily:"var(--sans)",
                boxShadow:`0 4px 18px ${m.glow}`,
              }}>Save</button>
              <button className="btn-ghost" onClick={() => { setEditing(false); setError(""); }} style={{
                flex:1, padding:"12px 0", borderRadius:12, fontSize:12,
              }}>Cancel</button>
            </div>
          </div>
        )
        : (
          <button className="btn-ghost" onClick={() => setEditing(true)} style={{
            padding:"13px 0", borderRadius:16, fontSize:12, fontWeight:600,
            letterSpacing:"0.04em",
          }}>Edit Profile</button>
        )
      }
    </div>
  );
}
