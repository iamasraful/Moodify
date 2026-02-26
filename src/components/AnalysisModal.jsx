import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function AnalysisModal({ post, onClose }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  if (!post) return null;

  const text = post.text.toLowerCase();
  const KEYWORDS = {
    happy:  ["happy","joy","love","great","awesome","amazing","excited","yay","blessed","grateful","wonderful","smile","laugh"],
    sad:    ["sad","cry","miss","lonely","hurt","pain","broken","tears","alone","grief","depressed","empty","lost"],
    angry:  ["angry","hate","furious","mad","annoyed","rage","awful","terrible","worst","ugh","disgusting","fed up"],
    chill:  ["chill","relax","calm","peaceful","mellow","cool","fine","easy","zen","quiet","slow","easy"],
    hyped:  ["fire","hype","epic","crazy","insane","wild","lit","omg","incredible","pumped","let's go","yesss"],
  };

  const scores = Object.fromEntries(
    Object.entries(KEYWORDS).map(([k, words]) => [
      k, words.filter(w => text.includes(w)).length
    ])
  );
  const total = Math.max(1, Object.values(scores).reduce((a,b)=>a+b,0));
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const [topKey] = sorted[0];
  const tm = MOODS[topKey] || MOODS.chill;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:800,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:16, background:"rgba(0,0,0,0.78)",
      backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
    }}>
      <div className="card" style={{
        maxWidth:400, width:"100%", padding:26,
        boxShadow:"0 32px 80px rgba(0,0,0,0.7)",
        animation:"scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
          <h3 style={{
            fontFamily:"var(--serif)", fontSize:19, color:"var(--text)",
            fontWeight:400, letterSpacing:"-0.3px",
          }}>Sentiment Analysis</h3>
          <button className="btn-ghost" onClick={onClose} style={{
            width:32, height:32, display:"flex",
            alignItems:"center", justifyContent:"center",
            fontSize:15, borderRadius:10,
          }}>×</button>
        </div>

        <div style={{
          borderRadius:12, padding:"11px 14px", marginBottom:18,
          background:"var(--surface)", border:"1px solid var(--border)",
        }}>
          <p style={{
            color:"var(--muted)", fontSize:12,
            fontFamily:"var(--serif)", fontStyle:"italic", lineHeight:1.6,
          }}>
            "{post.text.slice(0, 100)}{post.text.length > 100 ? "…" : ""}"
          </p>
        </div>

        <div style={{marginBottom:18, display:"flex", flexDirection:"column", gap:10}}>
          {sorted.map(([k, v]) => {
            const pct = Math.round((v/total)*100);
            const mm = MOODS[k] || MOODS.chill;
            return (
              <div key={k}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
                  <span style={{
                    display:"flex", alignItems:"center", gap:7,
                    fontSize:12, fontWeight:600, fontFamily:"var(--sans)",
                    color: k===topKey ? mm.color : "var(--muted)",
                  }}>
                    {mm.emoji} {mm.label}
                  </span>
                  <span style={{fontSize:11, color:"var(--faint)", fontFamily:"var(--sans)"}}>{pct}%</span>
                </div>
                <div style={{height:4, borderRadius:2, background:"var(--surface2)", overflow:"hidden"}}>
                  <div style={{
                    height:"100%", borderRadius:2,
                    width:`${pct}%`,
                    background: mm.color,
                    boxShadow:`0 0 8px ${mm.glow}`,
                    transition:"width 0.9s cubic-bezier(0.22,1,0.36,1)",
                  }}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          borderRadius:14, padding:"14px 18px", textAlign:"center",
          background: tm.dark, border:`1px solid ${tm.color}25`,
        }}>
          <span style={{fontSize:24, filter:`drop-shadow(0 0 10px ${tm.glow})`}}>{tm.emoji}</span>
          <p style={{
            color:"var(--text)", fontWeight:600, fontSize:14,
            fontFamily:"var(--sans)", marginTop:6,
          }}>
            Dominant vibe: <span style={{color:tm.color}}>{tm.label}</span>
          </p>
          <p style={{color:"var(--faint)", fontSize:11, marginTop:3, fontFamily:"var(--sans)"}}>
            {scores[topKey] > 0
              ? `${scores[topKey]} signal${scores[topKey]>1?"s":""} detected`
              : "Emotionally ambiguous"}
          </p>
        </div>
      </div>
    </div>
  );
}
