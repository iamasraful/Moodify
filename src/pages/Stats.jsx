import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";
import { storageGet } from "../storage.js";
import TimeCapsule from "../components/TimeCapsule.jsx";

export default function Stats() {
  const { mood } = useApp();
  const m = MOODS[mood];
  const [hist, setHist]   = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      setHist(await storageGet("moodHistory") || []);
      setPosts(await storageGet("posts", true) || []);
    })();
  }, []);

  const last7 = useMemo(() =>
    Array.from({ length:7 }, (_,i) => {
      const d = new Date(); d.setDate(d.getDate()-i);
      return d.toDateString();
    }).reverse(), []
  );

  const byDay = last7.map(day => ({
    day: day.split(" ").slice(0,3).join(" "),
    total: hist.filter(h => h.date === day).length,
  }));
  const maxDay = Math.max(1, ...byDay.map(d=>d.total));
  const allM   = hist.reduce((a,h) => { a[h.mood]=(a[h.mood]||0)+1; return a; }, {});
  const topM   = Object.entries(allM).sort((a,b)=>b[1]-a[1])[0];
  const streak = (() => { let s=0; for(let i=byDay.length-1;i>=0;i--){ if(byDay[i].total>0) s++; else break; } return s; })();

  return (
    <div style={{display:"flex", flexDirection:"column", gap:14}}>
      <div>
        <h2 style={{fontFamily:"var(--serif)", fontSize:"clamp(24px,5vw,32px)", fontWeight:400, color:"var(--text)", letterSpacing:"-0.8px", marginBottom:3}}>Analytics</h2>
        <p style={{color:"var(--faint)", fontSize:12, fontFamily:"var(--sans)"}}>Your emotional patterns over time</p>
      </div>

      {/* Hero stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10}}>
        {[
          { label:"Streak", value:`${streak}d`, icon:"✦", color:m.color, glow:m.glow },
          { label:"Top Mood", value:topM ? MOODS[topM[0]]?.emoji||"—" : "—", icon:"◈", color:"#A78BFA", glow:"rgba(167,139,250,0.4)" },
          { label:"Posts", value:posts.length, icon:"◎", color:"#60A5FA", glow:"rgba(96,165,250,0.4)" },
        ].map(s => (
          <div key={s.label} style={{
            borderRadius:20, padding:"16px 12px", textAlign:"center",
            background:"var(--surface)", border:`1px solid ${s.color}14`,
            position:"relative", overflow:"hidden",
          }}>
            <div style={{position:"absolute", inset:0, background:`radial-gradient(circle at 50% 0%, ${s.color}06, transparent)`, pointerEvents:"none"}}/>
            <div style={{fontSize:14, marginBottom:8, color:s.color, filter:`drop-shadow(0 0 6px ${s.glow})`}}>{s.icon}</div>
            <p style={{color:"var(--text)", fontWeight:600, fontSize:22, fontFamily:"var(--serif)", marginBottom:4, letterSpacing:"-0.5px"}}>{s.value}</p>
            <p className="label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card" style={{padding:"20px 22px"}}>
        <p className="label" style={{marginBottom:16}}>7-Day Activity</p>
        <div style={{display:"flex", alignItems:"flex-end", gap:9, height:88, marginBottom:8}}>
          {byDay.map((d,i) => (
            <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, height:"100%", justifyContent:"flex-end"}}>
              <div style={{
                width:"100%", borderRadius:"5px 5px 0 0",
                height:`${Math.max(6, (d.total/maxDay)*76)}px`,
                background: d.total>0 ? `linear-gradient(180deg, ${m.color}, ${m.color}77)` : "var(--surface2)",
                boxShadow: d.total>0 ? `0 0 14px ${m.glow}` : "none",
                transition:"height 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s",
              }}/>
              <p className="label" style={{fontSize:9}}>{d.day.split(" ")[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mood breakdown */}
      <div className="card" style={{padding:"20px 22px"}}>
        <p className="label" style={{marginBottom:14}}>Mood Breakdown</p>
        {Object.keys(allM).length === 0
          ? <p style={{color:"var(--faint)", fontSize:13, fontFamily:"var(--sans)", textAlign:"center", padding:"16px 0"}}>No mood history yet.</p>
          : Object.entries(allM).sort((a,b)=>b[1]-a[1]).map(([k,v]) => {
            const mm = MOODS[k]||MOODS.happy;
            const total = Object.values(allM).reduce((a,b)=>a+b,0);
            const pct = Math.round((v/total)*100);
            return (
              <div key={k} style={{marginBottom:11}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
                  <span style={{display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:600, color:"var(--muted)", fontFamily:"var(--sans)"}}>
                    <span style={{fontSize:13}}>{mm.emoji}</span> {mm.label}
                  </span>
                  <span style={{fontSize:10, color:"var(--faint)", fontFamily:"var(--sans)"}}>{pct}%</span>
                </div>
                <div style={{height:4, borderRadius:2, background:"var(--surface2)", overflow:"hidden"}}>
                  <div style={{
                    height:"100%", borderRadius:2,
                    width:`${pct}%`, background:mm.color,
                    boxShadow:`0 0 8px ${mm.glow}`,
                    transition:"width 0.9s cubic-bezier(0.22,1,0.36,1)",
                  }}/>
                </div>
              </div>
            );
          })
        }
      </div>

      <TimeCapsule/>
    </div>
  );
}
