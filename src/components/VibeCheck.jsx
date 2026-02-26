import { useState } from "react";
import { useApp } from "../context.jsx";
import { MOODS, VIBE_Q } from "../constants.js";

export default function VibeCheck({ onResult, onClose }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState({});

  const pick = mv => {
    const v = { ...votes, [mv]: (votes[mv]||0) + 1 };
    setVotes(v);
    if (step < VIBE_Q.length - 1) {
      setStep(step + 1);
    } else {
      const result = Object.entries(v).sort((a,b)=>b[1]-a[1])[0][0];
      onResult(result);
    }
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:800,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:16, background:"rgba(0,0,0,0.75)",
      backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
    }}>
      <div className="card" style={{
        maxWidth:420, width:"100%", padding:28,
        boxShadow:"0 32px 80px rgba(0,0,0,0.7)",
        animation:"scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22}}>
          <div>
            <p className="label" style={{marginBottom:4}}>
              {step + 1} / {VIBE_Q.length}
            </p>
            <h3 style={{
              fontFamily:"var(--serif)", fontSize:20, color:"var(--text)",
              fontWeight:400, letterSpacing:"-0.3px",
            }}>Vibe Check</h3>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{
            width:32, height:32, display:"flex",
            alignItems:"center", justifyContent:"center",
            fontSize:15, borderRadius:10,
          }}>×</button>
        </div>

        {/* Progress */}
        <div style={{display:"flex", gap:5, marginBottom:22}}>
          {VIBE_Q.map((_, i) => (
            <div key={i} style={{
              flex:1, height:2.5, borderRadius:2,
              background: i <= step ? m.color : "var(--border)",
              transition:"background 0.3s",
              boxShadow: i <= step ? `0 0 6px ${m.glow}` : "none",
            }}/>
          ))}
        </div>

        <p style={{
          color:"var(--text)", fontSize:17, fontFamily:"var(--serif)",
          fontWeight:400, marginBottom:18, lineHeight:1.4,
          letterSpacing:"-0.2px",
        }}>{VIBE_Q[step].q}</p>

        <div style={{display:"flex", flexDirection:"column", gap:8}}>
          {VIBE_Q[step].opts.map((o, i) => (
            <button key={i} onClick={() => pick(o.m)} style={{
              padding:"13px 16px", borderRadius:13, textAlign:"left",
              border:"1px solid var(--border)",
              background:"var(--surface)", color:"var(--muted)",
              fontSize:14, fontWeight:400, cursor:"pointer",
              fontFamily:"var(--sans)", transition:"all 0.18s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = m.dark;
              e.currentTarget.style.borderColor = `${m.color}50`;
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.paddingLeft = "20px";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.paddingLeft = "16px";
            }}
            >{o.t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
