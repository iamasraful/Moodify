import { useState, useEffect } from "react";
import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";
import { sanitize } from "../helpers.js";
import { storageGet, storageSet } from "../storage.js";

export default function TimeCapsule() {
  const { mood, user, toast } = useApp();
  const m = MOODS[mood];
  const [msg, setMsg]   = useState("");
  const [caps, setCaps] = useState([]);

  useEffect(() => { (async () => setCaps(await storageGet("capsules") || []))(); }, []);

  const seal = async () => {
    const t = sanitize(msg);
    if (!t) return;
    const c = {
      id: Date.now(), text: t, mood,
      author: user?.name,
      unlockAt: Date.now() + 7 * 86400000,
      ts: Date.now(),
    };
    const u = [c, ...caps];
    setCaps(u);
    await storageSet("capsules", u);
    setMsg("");
    toast("Sealed for 7 days", "⏰");
  };

  return (
    <div className="card" style={{padding:"22px 24px"}}>
      <p className="label" style={{marginBottom:10}}>Time Capsule</p>
      <p style={{color:"var(--text)", fontFamily:"var(--serif)", fontSize:17, letterSpacing:"-0.3px", marginBottom:4}}>Write to your future self</p>
      <p style={{color:"var(--faint)", fontSize:12, fontFamily:"var(--sans)", marginBottom:16}}>Opens in 7 days.</p>
      <textarea
        value={msg}
        onChange={e => setMsg(e.target.value.slice(0, 500))}
        placeholder="Dear future me, today I feel…"
        style={{
          width:"100%", minHeight:80, padding:"12px 15px",
          borderRadius:14, background:"var(--surface2)",
          border:"1px solid var(--border)", color:"rgba(255,255,255,0.85)",
          fontSize:14, outline:"none", resize:"none",
          fontFamily:"var(--serif)", boxSizing:"border-box",
          marginBottom:11, lineHeight:1.65,
          transition:"border-color 0.18s",
        }}
        onFocus={e => { e.target.style.borderColor=`${m.color}50`; }}
        onBlur={e => { e.target.style.borderColor="var(--border)"; }}
      />
      <button onClick={seal} disabled={!msg.trim()} style={{
        width:"100%", padding:"11px 0", borderRadius:13, border:"none",
        background: msg.trim() ? m.color : "rgba(255,255,255,0.07)",
        color: msg.trim() ? "#000" : "rgba(255,255,255,0.2)",
        fontSize:12, fontWeight:700, cursor: msg.trim()?"pointer":"not-allowed",
        fontFamily:"var(--sans)", transition:"all 0.2s",
      }}>🔒 Seal Capsule</button>

      {caps.length > 0 && (
        <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:8}}>
          {caps.slice(0,3).map(c => (
            <div key={c.id} style={{
              borderRadius:13, padding:"11px 15px",
              background:"var(--surface2)", border:"1px solid var(--border)",
            }}>
              {Date.now() >= c.unlockAt
                ? <>
                  <p style={{color:"#10B981", fontSize:9, fontWeight:700, fontFamily:"var(--sans)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:5}}>✦ Unlocked</p>
                  <p style={{color:"rgba(255,255,255,0.72)", fontSize:13, fontFamily:"var(--serif)", fontStyle:"italic", lineHeight:1.55}}>{c.text}</p>
                </>
                : <>
                  <p style={{color:m.color, fontSize:9, fontWeight:700, fontFamily:"var(--sans)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:3}}>🔒 Opens {new Date(c.unlockAt).toLocaleDateString()}</p>
                  <p style={{color:"var(--faint)", fontSize:11, fontFamily:"var(--sans)"}}>{MOODS[c.mood]?.emoji} {MOODS[c.mood]?.label} · {c.author}</p>
                </>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
