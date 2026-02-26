import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function Music() {
  const { mood, toast } = useApp();
  const m = MOODS[mood];
  const [songs, setSongs]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [playing, setPlaying]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState(false);
  const audioRef = useRef(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const r = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(m.genre)}&media=music&limit=20&entity=song`
      );
      if (!r.ok) throw new Error();
      const d = await r.json();
      const filtered = (d.results || []).filter(s => s.previewUrl);
      if (!filtered.length) throw new Error();
      setSongs(filtered);
    } catch {
      setError(true);
      toast("Could not load music", "◬");
    }
    setLoading(false);
  }, [mood]);

  useEffect(() => { fetchSongs(); }, [mood]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [playing]);

  const play = song => {
    if (playing?.trackId === song.trackId) {
      audioRef.current?.pause();
      setPlaying(null); setProgress(0);
    } else {
      if (audioRef.current) {
        audioRef.current.src = song.previewUrl;
        audioRef.current.play().catch(() => toast("Playback blocked", "◬"));
      }
      setPlaying(song); setProgress(0);
    }
  };

  return (
    <div style={{paddingBottom: playing ? 80 : 0}}>
      <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20}}>
        <div>
          <h2 style={{
            fontFamily:"var(--serif)", fontSize:"clamp(24px,5vw,32px)",
            fontWeight:400, color:"var(--text)", letterSpacing:"-0.8px", marginBottom:3,
          }}>Mood Music</h2>
          <p style={{color:"var(--faint)", fontSize:12, fontFamily:"var(--sans)"}}>30-second previews</p>
        </div>
        <button onClick={fetchSongs} style={{
          padding:"8px 16px", borderRadius:30, flexShrink:0,
          border:`1px solid ${m.color}40`,
          background: m.dark, color: m.color,
          fontSize:11, fontWeight:700, cursor:"pointer",
          fontFamily:"var(--sans)", transition:"all 0.18s",
          boxShadow:`0 0 14px ${m.dark}`,
        }}>↻ Shuffle</button>
      </div>

      {/* Playlist header */}
      <div className="card" style={{
        padding:"16px 20px", marginBottom:18,
        background:`linear-gradient(135deg, ${m.dark}, rgba(255,255,255,0.02))`,
        border:`1px solid ${m.color}15`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:-20, right:-20,
          width:90, height:90, borderRadius:"50%",
          background:`radial-gradient(circle, ${m.color}25, transparent)`,
          pointerEvents:"none",
        }}/>
        <p className="label" style={{marginBottom:5}}>Now playing from</p>
        <p style={{
          color:"var(--text)", fontWeight:600, fontSize:15,
          fontFamily:"var(--sans)", marginBottom:2,
        }}>{m.emoji} {m.label} Universe</p>
        <p style={{color:m.color, fontSize:11, fontFamily:"var(--sans)"}}>{m.genre}</p>
      </div>

      <audio
        ref={audioRef}
        onEnded={() => { setPlaying(null); setProgress(0); }}
      />

      {loading
        ? [1,2,3,4].map(i => (
          <div key={i} className="shimmer-box" style={{
            height:74, borderRadius:"var(--radius-lg)", marginBottom:10,
            animationDelay:`${i*0.12}s`,
          }}/>
        ))
        : error
          ? (
            <div style={{textAlign:"center", padding:"40px 0"}}>
              <p style={{color:"var(--muted)", fontFamily:"var(--sans)", fontSize:14}}>Failed to load music.</p>
              <button className="btn-ghost" onClick={fetchSongs} style={{marginTop:12, padding:"8px 16px", borderRadius:10, fontSize:12}}>Retry</button>
            </div>
          )
          : (
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {songs.map((s, i) => {
                const ip = playing?.trackId === s.trackId;
                return (
                  <div key={s.trackId} onClick={() => play(s)} style={{
                    display:"flex", alignItems:"center", gap:13,
                    padding:"12px 14px", borderRadius:18, cursor:"pointer",
                    background: ip ? m.dark : "var(--surface)",
                    border: ip ? `1px solid ${m.color}30` : "1px solid var(--border)",
                    boxShadow: ip ? `0 4px 24px ${m.glow}` : "none",
                    transition:"all 0.2s",
                    animation:`fadeUp 0.4s ease ${i*0.04}s both`,
                  }}
                  onMouseEnter={e => { if(!ip) { e.currentTarget.style.background="var(--surface2)"; e.currentTarget.style.transform="translateX(3px)"; }}}
                  onMouseLeave={e => { if(!ip) { e.currentTarget.style.background="var(--surface)"; e.currentTarget.style.transform="translateX(0)"; }}}
                  >
                    <div style={{position:"relative", flexShrink:0}}>
                      <img src={s.artworkUrl100} alt="" style={{width:50, height:50, borderRadius:13, display:"block"}} loading="lazy"/>
                      {ip && (
                        <div style={{
                          position:"absolute", inset:0, borderRadius:13,
                          background:"rgba(0,0,0,0.45)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:17,
                        }}>⏸</div>
                      )}
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                      <p style={{
                        color: ip ? m.color : "rgba(255,255,255,0.85)",
                        fontWeight:600, fontSize:13, fontFamily:"var(--sans)",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                        marginBottom:3, transition:"color 0.2s",
                      }}>{s.trackName}</p>
                      <p style={{color:"var(--faint)", fontSize:11, fontFamily:"var(--sans)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{s.artistName}</p>
                    </div>
                    <div style={{
                      width:30, height:30, borderRadius:10, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, background: ip ? `${m.color}20` : "var(--surface2)",
                      color: ip ? m.color : "var(--faint)",
                      transition:"all 0.2s",
                    }}>{ip ? "♫" : "▶"}</div>
                  </div>
                );
              })}
            </div>
          )
      }

      {/* Now playing bar */}
      {playing && (
        <div className="npbar" style={{
          position:"fixed", left:0, right:0, zIndex:80,
          padding:"11px 18px",
          background:"rgba(8,8,18,0.97)",
          backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)",
          borderTop:`1.5px solid ${m.color}30`,
          boxShadow:`0 -6px 32px rgba(0,0,0,0.6)`,
        }}>
          <div style={{display:"flex", alignItems:"center", gap:13, maxWidth:860, margin:"0 auto"}}>
            <div style={{position:"relative", flexShrink:0}}>
              <img src={playing.artworkUrl100} alt="" style={{width:40, height:40, borderRadius:11, display:"block"}}/>
              <div style={{position:"absolute", inset:0, borderRadius:11, boxShadow:`0 0 16px ${m.glow}`}}/>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <p style={{
                color:"rgba(255,255,255,0.88)", fontWeight:600, fontSize:12,
                fontFamily:"var(--sans)", overflow:"hidden",
                textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:5,
              }}>{playing.trackName}</p>
              <div style={{height:3, borderRadius:2, background:"var(--surface2)", overflow:"hidden", cursor:"pointer"}}>
                <div style={{
                  height:"100%", width:`${progress}%`,
                  background:`linear-gradient(90deg, ${m.color}, ${m.color}aa)`,
                  borderRadius:2, transition:"width 0.5s linear",
                  boxShadow:`0 0 8px ${m.glow}`,
                }}/>
              </div>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:8, flexShrink:0}}>
              <div style={{display:"flex", alignItems:"center", gap:4}}>
                <div style={{
                  width:5, height:5, borderRadius:"50%",
                  background:m.color, boxShadow:`0 0 8px ${m.glow}`,
                  animation:"pulse 1s infinite",
                }}/>
                <span style={{color:m.color, fontSize:9, fontWeight:700, fontFamily:"var(--sans)", letterSpacing:"0.1em"}}>LIVE</span>
              </div>
              <button className="btn-ghost" onClick={() => { audioRef.current?.pause(); setPlaying(null); setProgress(0); }} style={{
                width:30, height:30, borderRadius:9, fontSize:12,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>⏹</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
