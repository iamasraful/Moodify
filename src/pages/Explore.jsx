import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context.jsx";
import { MOODS, MOOD_FORECAST } from "../constants.js";
import { storageGet } from "../storage.js";
import VibeCheck from "../components/VibeCheck.jsx";

const QUOTES = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { content: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { content: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { content: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { content: "You learn more from failure than from success. Don't let it stop you.", author: "Unknown" },
  { content: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
  { content: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
  { content: "Imagination is more important than knowledge.", author: "Albert Einstein" },
  { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { content: "An unexamined life is not worth living.", author: "Socrates" },
  { content: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { content: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { content: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { content: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { content: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { content: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { content: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { content: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { content: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { content: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { content: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { content: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
  { content: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { content: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
];

export default function Explore() {
  const { mood, setMood, toast } = useApp();
  const m = MOODS[mood];
  const [quote, setQuote]       = useState(null);
  const [joke, setJoke]         = useState(null);
  const [posts, setPosts]       = useState([]);
  const [showVibe, setShowVibe] = useState(false);
  const [loadJ, setLoadJ]       = useState(false);

  useEffect(() => {
    fetchQ(); fetchJ();
    (async () => setPosts(await storageGet("posts", true) || []))();
  }, []);

  const fetchQ = () => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
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
          }}>↻</button>
        </div>
        {quote && <>
          <p style={{
            fontSize:16, fontFamily:"var(--serif)", fontStyle:"italic",
            color:"var(--text)", lineHeight:1.7, marginBottom:10,
          }}>
            <span style={{fontSize:28, color:"rgba(167,139,250,0.3)", lineHeight:0, verticalAlign:"-0.25em", marginRight:3}}>"</span>
            {quote.content}
            <span style={{fontSize:28, color:"rgba(167,139,250,0.3)", lineHeight:0, verticalAlign:"-0.25em", marginLeft:3}}>"</span>
          </p>
          <p style={{textAlign:"right", fontSize:11, color:"rgba(167,139,250,0.65)", fontFamily:"var(--sans)"}}>— {quote.author}</p>
        </>}
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
        {loadJ
          ? <div className="shimmer-box" style={{height:48, borderRadius:10}}/>
          : joke
            ? <>
              <p style={{color:"var(--text)", fontSize:14, fontWeight:500, fontFamily:"var(--sans)", marginBottom:10, lineHeight:1.5}}>{joke.setup}</p>
              <p style={{fontSize:15, color:m.color, fontStyle:"italic", fontFamily:"var(--serif)", lineHeight:1.55}}>{joke.punchline}</p>
            </>
            : <p style={{color:"var(--faint)", fontSize:13, fontFamily:"var(--sans)", textAlign:"center", padding:"8px 0"}}>
                Could not load a joke. Hit ↻ to retry.
              </p>
        }
      </SCard>
    </div>
  );
}
