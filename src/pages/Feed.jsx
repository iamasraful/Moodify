import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";
import { sanitize } from "../helpers.js";
import { storageGet, storageSet } from "../storage.js";
import Particle from "../components/Particle.jsx";
import PostCard from "../components/PostCard.jsx";
import OnlineStrip from "../components/OnlineStrip.jsx";
import AnalysisModal from "../components/AnalysisModal.jsx";

export default function Feed() {
  const { mood, user, toast } = useApp();
  const m = MOODS[mood];
  const [posts, setPosts]         = useState([]);
  const [pending, setPending]     = useState([]);
  const [text, setText]           = useState("");
  const [filter, setFilter]       = useState("all");
  const [analysis, setAnalysis]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [online, setOnline]       = useState(1);
  const [particles, setParticles] = useState([]);
  const pollRef = useRef(null);

  useEffect(() => {
    (async () => {
      const s = await storageGet("posts", true);
      setPosts(Array.isArray(s) ? s : []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    pollRef.current = setInterval(async () => {
      const fresh = await storageGet("posts", true);
      if (!Array.isArray(fresh)) return;
      setPosts(prev => {
        if (fresh.length > prev.length) {
          const ids = new Set(prev.map(p => p.id));
          const ns = fresh.filter(p => !ids.has(p.id) && p.author !== user?.name);
          if (ns.length) setPending(pp => [...ns, ...pp]);
          return fresh;
        }
        return fresh.length === prev.length ? fresh : prev;
      });
      const cutoff = Date.now() - 600000;
      const active = new Set(fresh.filter(p => p.ts > cutoff).map(p => p.author));
      if (user) active.add(user.name);
      setOnline(Math.max(1, active.size));
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [user]);

  const publish = async () => {
    const t = sanitize(text);
    if (!t || t.length < 1) return;
    const post = {
      id: Date.now(),
      author: user.name,
      avatar: user.avatar,
      text: t,
      mood,
      ts: Date.now(),
      reactions: {},
      replies: [],
    };
    const updated = [post, ...posts];
    setPosts(updated);
    await storageSet("posts", updated, true);
    setText("");
    toast("Posted!", "✦");
    const hist = (await storageGet("moodHistory")) || [];
    await storageSet("moodHistory", [...hist, { mood, date: new Date().toDateString() }].slice(-100));
  };

  const onReact = useCallback(async (id, emoji) => {
    setPosts(prev => {
      const updated = prev.map(p =>
        p.id === id
          ? { ...p, reactions: { ...p.reactions, [emoji]: (p.reactions[emoji]||0)+1 } }
          : p
      );
      storageSet("posts", updated, true);
      return updated;
    });
  }, []);

  const onReply = useCallback(async (id, txt) => {
    setPosts(prev => {
      const updated = prev.map(p =>
        p.id === id
          ? { ...p, replies: [...(p.replies||[]), { author:user.name, avatar:user.avatar, text:txt }] }
          : p
      );
      storageSet("posts", updated, true);
      return updated;
    });
    toast("Replied!", "◎");
  }, [user]);

  const onShare = (post) => {
    navigator.clipboard?.writeText(`"${post.text}" — ${post.author} on Moodify`).catch(() => {});
    toast("Copied!", "⊕");
  };

  const addParticle = (x, y, emoji, color) => {
    const id = Date.now() + Math.random();
    setParticles(p => [...p, { id, x, y, emoji, color }]);
  };

  const shown = useMemo(() => {
    if (filter === "mine") return posts.filter(p => p.mood === mood);
    if (filter === "me")   return posts.filter(p => p.author === user?.name);
    return posts;
  }, [posts, filter, mood, user]);

  return (
    <div>
      {particles.map(p => (
        <Particle
          key={p.id} x={p.x} y={p.y} emoji={p.emoji} color={p.color}
          onDone={() => setParticles(ps => ps.filter(x => x.id !== p.id))}
        />
      ))}

      {/* Header row */}
      <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20}}>
        <div>
          <h2 style={{
            fontFamily:"var(--serif)", fontSize:"clamp(24px,5vw,32px)",
            fontWeight:400, color:"var(--text)", letterSpacing:"-0.8px",
            marginBottom:3,
          }}>Mood Feed</h2>
          <p style={{color:"var(--faint)", fontSize:12, fontFamily:"var(--sans)"}}>
            What's the world feeling?
          </p>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"5px 12px", borderRadius:30,
          background:"rgba(16,185,129,0.08)",
          border:"1px solid rgba(16,185,129,0.2)",
          flexShrink:0,
        }}>
          <div style={{
            width:6, height:6, borderRadius:"50%",
            background:"#10B981",
            boxShadow:"0 0 8px rgba(16,185,129,0.8)",
            animation:"pulse 2s ease-in-out infinite",
          }}/>
          <span style={{color:"#10B981", fontSize:11, fontWeight:700, fontFamily:"var(--sans)"}}>{online} online</span>
        </div>
      </div>

      {!loading && <OnlineStrip posts={posts} />}

      {/* Pending banner */}
      {pending.length > 0 && (
        <button onClick={() => setPending([])} style={{
          width:"100%", padding:"12px 0", borderRadius:16,
          border:`1px solid ${m.color}30`,
          background: m.dark,
          color: m.color, fontSize:13, fontWeight:600,
          cursor:"pointer", marginBottom:14,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          fontFamily:"var(--sans)", letterSpacing:"0.02em",
          animation:"slideDown 0.4s ease",
          boxShadow:`0 4px 24px ${m.glow}`,
        }}>
          <span style={{animation:"float 1.5s ease-in-out infinite", display:"inline-block"}}>↑</span>
          {pending.length} new {pending.length === 1 ? "post" : "posts"} — tap to load
        </button>
      )}

      {/* Composer */}
      <div className="card" style={{
        padding:"20px 20px 16px", marginBottom:18,
        border:`1px solid ${m.color}20`,
        boxShadow:`0 0 48px ${m.dark}, inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition:"box-shadow 0.4s, border-color 0.4s",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg, transparent, ${m.color}40, transparent)`,
        }}/>
        <div style={{display:"flex", gap:13, marginBottom:13}}>
          <div style={{
            width:42, height:42, borderRadius:14, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:21, background: m.dark,
            border:`1.5px solid ${m.color}40`,
            boxShadow:`0 0 18px ${m.glow}`,
            transition:"all 0.4s",
          }}>{user?.avatar}</div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0,500))}
            onKeyDown={e => { if (e.key==="Enter" && e.metaKey) publish(); }}
            placeholder={`Feeling ${m.label.toLowerCase()}… what's on your mind?`}
            maxLength={500}
            style={{
              flex:1, background:"transparent", border:"none",
              color:"rgba(255,255,255,0.85)", fontSize:15,
              fontFamily:"var(--serif)", resize:"none",
              outline:"none", minHeight:72, lineHeight:1.7,
              paddingTop:6,
            }}
          />
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <span style={{color:"var(--faint)", fontSize:10, fontFamily:"var(--sans)"}}>{text.length}/500</span>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <span style={{
              fontSize:11, color:m.color, fontWeight:700,
              fontFamily:"var(--sans)", letterSpacing:"0.07em",
              textTransform:"uppercase",
              filter:`drop-shadow(0 0 5px ${m.glow})`,
            }}>{m.emoji} {m.label}</span>
            <button
              onClick={publish}
              disabled={!text.trim()}
              style={{
                padding:"9px 20px", borderRadius:12, border:"none",
                background: text.trim() ? m.color : "rgba(255,255,255,0.07)",
                color: text.trim() ? "#000" : "rgba(255,255,255,0.2)",
                fontSize:12, fontWeight:700, cursor: text.trim() ? "pointer" : "not-allowed",
                fontFamily:"var(--sans)", letterSpacing:"0.03em",
                boxShadow: text.trim() ? `0 4px 20px ${m.glow}` : "none",
                transition:"all 0.2s",
              }}
              onMouseEnter={e => { if(text.trim()) e.currentTarget.style.opacity="0.85"; }}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >Post</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:"flex", gap:7, marginBottom:18}}>
        {[["all","Everyone"],["mine", `${m.emoji} ${m.label}`],["me","My Posts"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            padding:"7px 15px", borderRadius:30,
            border:`1px solid ${filter===id ? `${m.color}40` : "var(--border)"}`,
            background: filter===id ? m.dark : "transparent",
            color: filter===id ? m.color : "var(--muted)",
            fontSize:11, fontWeight:700, cursor:"pointer",
            fontFamily:"var(--sans)", letterSpacing:"0.05em",
            textTransform:"uppercase", transition:"all 0.2s",
            boxShadow: filter===id ? `0 0 14px ${m.dark}` : "none",
          }}>{label}</button>
        ))}
      </div>

      {/* Posts */}
      {loading
        ? [1,2,3].map(i => (
          <div key={i} className="shimmer-box" style={{
            height:140, borderRadius:"var(--radius-lg)",
            marginBottom:12,
            animationDelay:`${i * 0.15}s`,
          }}/>
        ))
        : shown.length === 0
          ? (
            <div style={{textAlign:"center", padding:"60px 0"}}>
              <div style={{fontSize:52, marginBottom:16, opacity:0.5}}>🌌</div>
              <p style={{
                color:"var(--muted)", fontFamily:"var(--serif)",
                fontSize:18, fontWeight:400, letterSpacing:"-0.3px",
              }}>Nothing here yet.</p>
              <p style={{color:"var(--faint)", fontSize:12, marginTop:6, fontFamily:"var(--sans)"}}>
                Be the first to share your mood.
              </p>
            </div>
          )
          : shown.map((p, i) => (
            <div key={p.id} style={{animation:`fadeUp 0.4s ease ${Math.min(i,6) * 0.06}s both`}}>
              <PostCard
                post={p}
                onReact={onReact} onReply={onReply}
                onShare={onShare} onAnalyze={setAnalysis}
                onParticle={addParticle}
              />
            </div>
          ))
      }

      {analysis && <AnalysisModal post={analysis} onClose={() => setAnalysis(null)} />}
    </div>
  );
}
