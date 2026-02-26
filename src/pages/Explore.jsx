import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context.jsx";
import { MOODS, MOOD_FORECAST } from "../constants.js";
import { storageGet } from "../storage.js";
import VibeCheck from "../components/VibeCheck.jsx";

export default function Explore() {
  const { mood, setMood, toast } = useApp();
  const m = MOODS[mood];
  const [quote, setQuote]       = useState(null);
  const [joke, setJoke]         = useState(null);
  const [posts, setPosts]       = useState([]);
  const [showVibe, setShowVibe] = useState(false);
  const [loadQ, setLoadQ]       = useState(false);
  const [loadJ, setLoadJ]       = useState(false);

  useEffect(() => {
    fetchQ(); fetchJ();
    (async () => setPosts(await storageGet("posts", true) || []))();
  }, []);

  const fetchQ = async () => {
    setLoadQ(true);
    try {
      const r = await fetch("https://api.quotable.io/random");
      if (r.ok) setQuote(await r.json());
    } catch {}
    setLoadQ(false);
  };

  const fetchJ = async () => {
    setLoadJ(true);
    try {
      const r = await fetch("https://official-joke-api.appspot.com/random_joke");
      if (r.ok) setJoke(await r.json());
    } catch {}
    setLoadJ(false);
  };

  const moodCounts = useMemo(() =>
    posts.reduce((a, p) => { a[p.mood]=(a[p.mood]||0)+1; return a; }, {}), [posts]
  );
  const trending = Object.entries(moodCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const moodOfDay = trending[0]?.[0] || "happy";

  const SCard = ({ children, accent }) => (
    <div className="card" style={{
      padding:"20px 22px",
      border:`1px solid ${accent ? `${accent}12` : "var(--border)"}`,
      boxShadow: accent ? `inset 0 1px 0 ${accent}08` : "none",
    }}>{children}</div>
  );

  const SLabel = ({ t }) => <p className="label" style={{marginBottom:12}}>{t}</p>;

  return (
    <div style={{display:"flex", flexDirection:"column", gap:14}}>
      <div>
        <h2 style={{fontFamily:"var(--serif)", fontSize:"clamp(24px,5vw,32px)", fontWeight:400, color:"var(--text)", letterSpacing:"-0.8px", marginBottom:3}}>Explore</h2>
        <p style={{color:"var(--faint)", fontSize:12, fontFamily:"var(--sans)"}}>Discover what the universe is feeling</p>
      </div>

      {/* Vibe check CTA */}
      <div onClick={() => setShowVibe(true)} style={{
        borderRadius:"var(--radius-lg)", padding:"22px 24px",
        background:`linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.07))`,
        border:"1px solid rgba(124,58,237,0.2)", cursor:"pointer",
        transition:"all 0.22s",
        position:"relative", overflow:"hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(124,58,237,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
      >
        <SLabel t="Interactive"/>
        <p style={{fontFamily:"var(--serif)", fontSize:19, color:"var(--text)", letterSpacing:"-0.4px", marginBottom:4}}>Take a Vibe Check</p>
        <p style={{color:"var(--muted)", fontSize:13, fontFamily:"var(--sans)"}}>3 questions → your true mood detected →</p>
      </div>

      {showVibe && (
        <VibeCheck
          onResult={r => { setMood(r); setShowVibe(false); toast(`${MOODS[r].label} detected!`, MOODS[r].emoji); }}
          onClose={() => setShowVibe(false)}
        />
      )}

      {/* Forecast */}
      <SCard accent={m.color}>
        <SLabel t="Emotional Forecast"/>
        <div style={{display:"flex", gap:14, alignItems:"flex-start"}}>
          <div style={{
            width:46, height:46, borderRadius:15, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:22, background:m.dark, border:`1px solid ${m.color}25`,
            filter:`drop-shadow(0 0 10px ${m.glow})`,
          }}>{m.emoji}</div>
          <div>
            <p style={{color:"var(--text)", fontWeight:600, fontSize:14, fontFamily:"var(--sans)", marginBottom:5}}>{m.label} Weather</p>
            <p style={{color:"var(--muted)", fontSize:14, fontFamily:"var(--serif)", fontStyle:"italic", lineHeight:1.65}}>{MOOD_FORECAST[mood]}</p>
          </div>
        </div>
      </SCard>

      {/* Trending */}
      <SCard>
        <SLabel t="Community Pulse"/>
        {trending.length
          ? <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {trending.map(([k, cnt]) => {
              const mm = MOODS[k]||MOODS.happy;
              const max = trending[0][1];
              return (
                <div key={k} style={{display:"flex", alignItems:"center", gap:12}}>
                  <span style={{fontSize:15, width:20, textAlign:"center"}}>{mm.emoji}</span>
                  <span style={{color:"var(--muted)", fontSize:11, fontWeight:600, width:60, fontFamily:"var(--sans)"}}>{mm.label}</span>
                  <div style={{flex:1, height:4, borderRadius:2, background:"var(--surface2)", overflow:"hidden"}}>
                    <div style={{
                      height:"100%", borderRadius:2,
                      width:`${Math.round((cnt/max)*100)}%`,
                      background:mm.color, boxShadow:`0 0 6px ${mm.glow}`,
                      transition:"width 0.8s ease",
                    }}/>
                  </div>
                  <span style={{color:"var(--faint)", fontSize:10, fontFamily:"var(--sans)", width:16, textAlign:"right"}}>{cnt}</span>
                </div>
              );
            })}
            <p style={{color:"var(--faint)", fontSize:10, marginTop:2, fontFamily:"var(--sans)"}}>
              Mood of the day: <span style={{color:MOODS[moodOfDay]?.color}}>{MOODS[moodOfDay]?.emoji} {MOODS[moodOfDay]?.label}</span>
            </p>
          </div>
          : <p style={{color:"var(--faint)", fontSize:13, fontFamily:"var(--sans)"}}>No community data yet.</p>
        }
      </SCard>

      {/* Quote */}
      <SCard accent="#A78BFA">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <SLabel t="Inspiration"/>
          <button className="btn-ghost" onClick={fetchQ} style={{
            width:28, height:28, borderRadius:9, marginBottom:12,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:700,
          }}>{loadQ ? "·" : "↻"}</button>
        </div>
        {quote
          ? <>
            <p style={{
              fontSize:16, fontFamily:"var(--serif)", fontStyle:"italic",
              color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:10,
            }}>
              <span style={{fontSize:28, color:"rgba(167,139,250,0.3)", lineHeight:0, verticalAlign:"-0.25em", marginRight:3}}>"</span>
              {quote.content}
              <span style={{fontSize:28, color:"rgba(167,139,250,0.3)", lineHeight:0, verticalAlign:"-0.25em", marginLeft:3}}>"</span>
            </p>
            <p style={{textAlign:"right", fontSize:11, color:"rgba(167,139,250,0.65)", fontFamily:"var(--sans)"}}>— {quote.author}</p>
          </>
          : <div className="shimmer-box" style={{height:56, borderRadius:10}}/>
        }
      </SCard>

      {/* Joke */}
      <SCard>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <SLabel t="Mood Booster"/>
          <button className="btn-ghost" onClick={fetchJ} style={{
            width:28, height:28, borderRadius:9, marginBottom:12,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:700,
          }}>{loadJ ? "·" : "↻"}</button>
        </div>
        {joke
          ? <>
            <p style={{color:"rgba(255,255,255,0.75)", fontSize:14, fontWeight:500, fontFamily:"var(--sans)", marginBottom:10, lineHeight:1.5}}>{joke.setup}</p>
            <p style={{fontSize:15, color:m.color, fontStyle:"italic", fontFamily:"var(--serif)", lineHeight:1.55}}>{joke.punchline}</p>
          </>
          : <div className="shimmer-box" style={{height:48, borderRadius:10}}/>
        }
      </SCard>
    </div>
  );
}
