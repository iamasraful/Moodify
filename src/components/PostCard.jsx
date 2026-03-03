import { useState } from "react";
import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";
import { ago, sanitize } from "../helpers.js";

export default function PostCard({ post, onReact, onReply, onShare, onAnalyze, onParticle }) {
  const { user, mood } = useApp();
  const m = MOODS[mood];
  const pm = MOODS[post.mood] || MOODS.happy;
  const [open, setOpen]       = useState(false);
  const [reply, setReply]     = useState("");
  const [hovered, setHovered] = useState(false);

  const handleReact = (e, emoji) => {
    const r = e.currentTarget.getBoundingClientRect();
    onParticle(r.left + r.width/2, r.top, emoji, pm.color);
    onReact(post.id, emoji);
  };

  const send = () => {
    const t = sanitize(reply);
    if (!t) return;
    onReply(post.id, t);
    setReply("");
  };

  return (
    <article
      style={{
        borderRadius:"var(--radius-lg)", padding:"18px 20px", marginBottom:12,
        background: hovered
          ? `linear-gradient(145deg, ${pm.color}0e 0%, var(--surface) 100%)`
          : "var(--surface)",
        border:`1px solid ${hovered ? `${pm.color}28` : "var(--border)"}`,
        transition:"all 0.28s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 52px ${pm.glow}, 0 0 0 1px ${pm.color}12, inset 0 1px 0 ${pm.color}15`
          : "inset 0 1px 0 var(--inset-shine)",
        position:"relative", overflow:"hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:1,
        background:`linear-gradient(90deg, transparent, ${pm.color}55, transparent)`,
        opacity: hovered ? 1 : 0.3, transition:"opacity 0.28s",
      }}/>

      {/* Header */}
      <div style={{display:"flex", alignItems:"center", gap:11, marginBottom:13}}>
        <div style={{
          width:42, height:42, borderRadius:14, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:21, background: pm.dark,
          border:`1.5px solid ${pm.color}35`,
          boxShadow: hovered ? `0 0 22px ${pm.glow}` : `0 0 10px ${pm.dark}`,
          transition:"box-shadow 0.28s",
        }}>{post.avatar}</div>
        <div style={{flex:1, minWidth:0}}>
          <p style={{
            color:"var(--text)", fontWeight:600, fontSize:14,
            fontFamily:"var(--sans)", marginBottom:2,
          }}>{post.author}</p>
          <p style={{color:"var(--faint)", fontSize:11, fontFamily:"var(--sans)"}}>{ago(post.ts)}</p>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:5,
          padding:"4px 10px", borderRadius:30,
          background: pm.dark,
          border:`1px solid ${pm.color}22`,
          boxShadow: hovered ? `0 0 14px ${pm.glow}` : "none",
          flexShrink:0, transition:"box-shadow 0.28s",
        }}>
          <span style={{fontSize:12}}>{pm.emoji}</span>
          <span style={{
            fontSize:10, fontWeight:700, color:pm.color,
            fontFamily:"var(--sans)", letterSpacing:"0.06em", textTransform:"uppercase",
          }}>{pm.label}</span>
        </div>
      </div>

      {/* Body */}
      <p style={{
        color:"var(--text)", fontSize:15,
        lineHeight:1.75, fontFamily:"var(--serif)",
        marginBottom:15, letterSpacing:"0.01em",
      }}>{post.text}</p>

      {/* Actions */}
      <div style={{display:"flex", gap:5, flexWrap:"wrap", alignItems:"center"}}>
        {["😂","❤️","🔥","😢","😮"].map(e => (
          <button key={e} onClick={ev => handleReact(ev, e)} style={{
            display:"flex", alignItems:"center", gap:4,
            padding:"5px 10px", borderRadius:30,
            border:"1px solid var(--border)",
            background:"var(--surface)", cursor:"pointer",
            transition:"all 0.15s",
          }}
          onMouseEnter={ev => {
            ev.currentTarget.style.background = "var(--surface2)";
            ev.currentTarget.style.borderColor = "var(--border2)";
            ev.currentTarget.style.transform = "scale(1.12)";
          }}
          onMouseLeave={ev => {
            ev.currentTarget.style.background = "var(--surface)";
            ev.currentTarget.style.borderColor = "var(--border)";
            ev.currentTarget.style.transform = "scale(1)";
          }}
          >
            <span style={{fontSize:13}}>{e}</span>
            <span style={{fontSize:11, color:"var(--faint)", fontFamily:"var(--sans)", fontWeight:600}}>
              {post.reactions?.[e] || 0}
            </span>
          </button>
        ))}
        <div style={{flex:1}}/>
        <button className="btn-ghost" onClick={() => setOpen(!open)} style={{
          padding:"5px 11px", borderRadius:30, fontSize:11, fontWeight:600,
        }}>
          ◎ {post.replies?.length || 0}
        </button>
        <button className="btn-ghost" onClick={() => onShare(post)} style={{
          padding:"5px 11px", borderRadius:30, fontSize:11, fontWeight:600,
        }}>⊕</button>
        <button onClick={() => onAnalyze(post)} style={{
          padding:"5px 11px", borderRadius:30, fontSize:11, fontWeight:600,
          border:`1px solid ${m.color}25`,
          background: m.dark,
          color: m.color,
          cursor:"pointer", fontFamily:"var(--sans)",
          transition:"all 0.15s",
          boxShadow:`inset 0 1px 0 ${m.color}15`,
        }}>◈</button>
      </div>

      {/* Replies */}
      {open && (
        <div style={{marginTop:14, paddingTop:14, borderTop:"1px solid var(--border)"}}>
          {(post.replies || []).map((r, i) => (
            <div key={i} style={{display:"flex", gap:9, marginBottom:9}}>
              <div style={{
                width:28, height:28, borderRadius:9, flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, background:"var(--surface2)",
                border:"1px solid var(--border)",
              }}>{r.avatar}</div>
              <div style={{
                flex:1, borderRadius:12, padding:"8px 13px",
                background:"var(--surface2)",
                border:"1px solid var(--border)",
                boxShadow:"inset 0 1px 0 var(--inset-shine)",
              }}>
                <p style={{color:"var(--faint)", fontSize:10, fontWeight:700, fontFamily:"var(--sans)", marginBottom:3, letterSpacing:"0.06em"}}>{r.author}</p>
                <p style={{color:"var(--text)", fontSize:13, fontFamily:"var(--sans)", lineHeight:1.55}}>{r.text}</p>
              </div>
            </div>
          ))}
          <div style={{display:"flex", gap:8, marginTop:8}}>
            <input
              className="input-base"
              value={reply}
              onChange={e => setReply(e.target.value.slice(0, 280))}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Reply…"
              style={{
                padding:"9px 14px", fontSize:13, borderRadius:12,
                "--accent":`${m.color}60`,
                "--accent-dim": m.dark,
              }}
            />
            <button onClick={send} style={{
              padding:"9px 18px", borderRadius:12, border:"none",
              background: m.color,
              color:"#000", fontSize:12, fontWeight:700,
              cursor:"pointer", fontFamily:"var(--sans)",
              flexShrink:0, transition:"opacity 0.15s",
              boxShadow:`0 4px 18px ${m.glow}`,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >Send</button>
          </div>
        </div>
      )}
    </article>
  );
}
