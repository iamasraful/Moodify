import { useState, useEffect, useRef } from "react";
import { useApp } from "../context.jsx";
import { MOODS, MEME_SUBS } from "../constants.js";
import { storageGet, storageSet } from "../storage.js";

export default function Memes() {
  const { mood, toast } = useApp();
  const m = MOODS[mood];
  const [meme, setMeme]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [sub, setSub]         = useState("");
  const [saved, setSaved]     = useState([]);
  const abortRef = useRef(null);

  useEffect(() => {
    (async () => setSaved(await storageGet("savedMemes") || []))();
    fetchMeme(MEME_SUBS[mood]);
    return () => abortRef.current?.abort();
  }, [mood]);

  const fetchMeme = async (subreddit) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true); setMeme(null);
    try {
      const r = await fetch(`https://meme-api.com/gimme/${subreddit||MEME_SUBS[mood]}`, {
        signal: abortRef.current.signal,
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (d.url && !d.nsfw) setMeme(d);
      else throw new Error();
    } catch (e) {
      if (e.name !== "AbortError") toast("Couldn't load meme", "◬");
    }
    setLoading(false);
  };

  const saveMeme = async () => {
    if (!meme) return;
    const u = [meme, ...saved].slice(0, 20);
    setSaved(u);
    await storageSet("savedMemes", u);
    toast("Saved!", "◈");
  };

  const SUBS = ["memes","dankmemes","wholesomememes","me_irl","animememes","ProgrammerHumor"];

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{
          fontFamily:"var(--serif)", fontSize:"clamp(24px,5vw,32px)",
          fontWeight:400, color:"var(--text)", letterSpacing:"-0.8px", marginBottom:3,
        }}>Meme Generator</h2>
        <p style={{color:"var(--faint)", fontSize:12, fontFamily:"var(--sans)"}}>
          Curated chaos for your current vibe
        </p>
      </div>

      {/* Sub pills */}
      <div style={{display:"flex", gap:6, overflowX:"auto", marginBottom:16, paddingBottom:2}}>
        {SUBS.map(s => (
          <button key={s} onClick={() => { setSub(s); fetchMeme(s); }} style={{
            padding:"6px 13px", borderRadius:30, flexShrink:0,
            border:`1px solid ${sub===s ? `${m.color}40` : "var(--border)"}`,
            background: sub===s ? m.dark : "transparent",
            color: sub===s ? m.color : "var(--muted)",
            fontSize:11, fontWeight:600, cursor:"pointer",
            fontFamily:"var(--sans)", transition:"all 0.18s",
          }}>r/{s}</button>
        ))}
      </div>

      {/* Meme display */}
      <div className="card" style={{
        overflow:"hidden", marginBottom:14,
        minHeight:280, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center",
      }}>
        {loading && (
          <div style={{
            fontSize:36, animation:"spin 1.2s linear infinite",
            filter:`drop-shadow(0 0 16px ${m.color})`,
          }}>✦</div>
        )}
        {!loading && meme && (
          <>
            <img
              src={meme.url} alt={meme.title}
              loading="lazy"
              style={{width:"100%", objectFit:"contain", maxHeight:460, display:"block"}}
              onError={() => fetchMeme(sub || MEME_SUBS[mood])}
            />
            <div style={{padding:"13px 18px", width:"100%", borderTop:"1px solid var(--border)"}}>
              <p style={{color:"rgba(255,255,255,0.75)", fontWeight:500, fontSize:13, marginBottom:3, fontFamily:"var(--sans)", lineHeight:1.4}}>{meme.title}</p>
              <p style={{color:"var(--faint)", fontSize:10, fontFamily:"var(--sans)", letterSpacing:"0.03em"}}>r/{meme.subreddit} · {(meme.ups||0).toLocaleString()} upvotes</p>
            </div>
          </>
        )}
        {!loading && !meme && (
          <div style={{textAlign:"center", padding:24}}>
            <p style={{color:"var(--faint)", fontSize:13, fontFamily:"var(--sans)"}}>Failed to load meme.</p>
            <button className="btn-ghost" onClick={() => fetchMeme(sub||MEME_SUBS[mood])} style={{
              marginTop:10, padding:"8px 16px", borderRadius:10, fontSize:12,
            }}>Try again</button>
          </div>
        )}
      </div>

      <div style={{display:"flex", gap:9, marginBottom:28}}>
        <button onClick={() => fetchMeme(sub||MEME_SUBS[mood])} style={{
          flex:1, padding:"13px 0", borderRadius:16, border:"none",
          background:`linear-gradient(135deg, ${m.color}, ${m.color}bb)`,
          color:"#000", fontSize:13, fontWeight:700, cursor:"pointer",
          fontFamily:"var(--sans)", boxShadow:`0 4px 20px ${m.glow}`,
          transition:"opacity 0.18s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity="1"}
        >↻ Next</button>
        <button className="btn-ghost" onClick={saveMeme} style={{padding:"13px 18px", borderRadius:16, fontSize:13}}>Save</button>
        <button className="btn-ghost" onClick={() => { navigator.clipboard?.writeText(meme?.url||""); toast("Copied","⊕"); }} style={{padding:"13px 18px", borderRadius:16, fontSize:13}}>Copy</button>
      </div>

      {saved.length > 0 && (
        <>
          <p className="label" style={{marginBottom:12}}>Saved</p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9}}>
            {saved.slice(0,6).map((s, i) => (
              <div key={i} onClick={() => setMeme(s)} style={{
                aspectRatio:"1", borderRadius:16, overflow:"hidden",
                cursor:"pointer", border:"1px solid var(--border)",
                transition:"all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.borderColor="var(--border2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.borderColor="var(--border)"; }}
              >
                <img src={s.url} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}} loading="lazy"/>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
