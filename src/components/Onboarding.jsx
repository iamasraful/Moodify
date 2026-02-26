import { useState } from "react";
import { storageSet } from "../storage.js";
import { sanitize } from "../helpers.js";
import { AVATARS } from "../constants.js";

export default function Onboarding({ onDone }) {
  const [name, setName]       = useState("");
  const [avatar, setAvatar]   = useState("🌟");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const go = async () => {
    const n = sanitize(name);
    if (!n) { setError("Pick a name first"); return; }
    if (n.length < 2) { setError("At least 2 characters"); return; }
    setLoading(true);
    const u = { name: n, avatar };
    await storageSet("user", u);
    onDone(u);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000, overflow:"hidden",
      background:"#080812",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      {/* Background orbs */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{
          position:"absolute", width:"60vw", height:"60vw",
          maxWidth:500, maxHeight:500, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          top:"-15%", left:"-10%",
          animation:"orbPulse 14s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", width:"50vw", height:"50vw",
          maxWidth:440, maxHeight:440, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
          bottom:"-10%", right:"-5%",
          animation:"orbPulse 18s ease-in-out infinite reverse",
        }}/>
      </div>

      <div style={{
        width:"100%", maxWidth:420, position:"relative", zIndex:1,
        animation:"scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Logo */}
        <div style={{textAlign:"center", marginBottom:36}}>
          <div style={{
            fontSize:52, marginBottom:12,
            animation:"float 3.5s ease-in-out infinite",
            display:"inline-block",
            filter:"drop-shadow(0 0 24px rgba(139,92,246,0.5))",
          }}>🎭</div>
          <h1 style={{
            fontFamily:"var(--serif)", fontSize:"clamp(40px,9vw,56px)",
            fontWeight:400, color:"#fff", margin:0,
            letterSpacing:"-1.5px", lineHeight:1,
          }}>Moodify</h1>
          <p style={{
            color:"var(--faint)", marginTop:10, fontSize:13,
            fontFamily:"var(--sans)", letterSpacing:"0.06em",
          }}>your emotional universe</p>
        </div>

        {/* Card */}
        <div className="card" style={{padding:28, marginBottom:12}}>
          <p className="label" style={{marginBottom:14}}>Choose your avatar</p>
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(48px, 1fr))",
            gap:10, marginBottom:24, rowGap:15,justifyItems: "center",
          }}>
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)} style={{
                aspectRatio:"1", borderRadius:12, fontSize:19,
                cursor:"pointer", border:"none",
                background: avatar===a ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                outline: avatar===a ? "2px solid rgba(139,92,246,0.7)" : "2px solid transparent",
                outlineOffset:2,
                transform: avatar===a ? "scale(1.15)" : "scale(1)",
                transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: avatar===a ? "0 0 16px rgba(139,92,246,0.35)" : "none",
              }}>{a}</button>
            ))}
          </div>

          <p className="label" style={{marginBottom:10}}>Your name</p>
          <input
            className="input-base"
            value={name}
            onChange={e => { setName(e.target.value.slice(0,20)); setError(""); }}
            onKeyDown={e => e.key === "Enter" && go()}
            placeholder="e.g. CosmicSoul"
            maxLength={20}
            style={{
              padding:"14px 18px", fontSize:16, fontWeight:500,
              textAlign:"center", borderRadius:14,
              "--accent":"rgba(139,92,246,0.6)",
              "--accent-dim":"rgba(139,92,246,0.08)",
            }}
          />
          {error && (
            <p style={{color:"#F43F5E", fontSize:12, marginTop:8, textAlign:"center", fontFamily:"var(--sans)"}}>
              {error}
            </p>
          )}
        </div>

        <button
          onClick={go}
          disabled={loading || !name.trim()}
          style={{
            width:"100%", padding:"16px 0", borderRadius:18,
            border:"none", cursor: name.trim() && !loading ? "pointer" : "not-allowed",
            background: name.trim()
              ? "linear-gradient(135deg, #7C3AED, #EC4899)"
              : "rgba(255,255,255,0.07)",
            color: name.trim() ? "#fff" : "rgba(255,255,255,0.25)",
            fontSize:15, fontWeight:600, fontFamily:"var(--sans)",
            letterSpacing:"0.03em",
            boxShadow: name.trim() ? "0 8px 32px rgba(124,58,237,0.4)" : "none",
            transition:"all 0.25s",
          }}
        >
          {loading ? "Entering…" : "Enter the Universe →"}
        </button>
      </div>
    </div>
  );
}
