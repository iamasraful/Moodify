import { useState, useRef } from "react";
import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";
import { ago, sanitize } from "../helpers.js";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];
const REACTION_LABELS = { "👍": "Like", "❤️": "Love", "😂": "Haha", "😮": "Wow", "😢": "Sad", "😡": "Angry" };

function ReplyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7"/>
      <path d="M20 18v-2a4 4 0 00-4-4H4"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}

export default function PostCard({ post, userReaction, onReact, onReply, onShare, onAnalyze, onParticle }) {
  const { user, mood } = useApp();
  const m = MOODS[mood];
  const pm = MOODS[post.mood] || MOODS.happy;
  const [open, setOpen]           = useState(false);
  const [reply, setReply]         = useState("");
  const [hovered, setHovered]     = useState(false);
  const [reactOpen, setReactOpen] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  const reactTimer = useRef(null);

  const handleReact = (e, emoji) => {
    const r = e.currentTarget.getBoundingClientRect();
    onParticle(r.left + r.width / 2, r.top, emoji, pm.color);
    onReact(post.id, emoji);
    setReactOpen(false);
  };

  const send = () => {
    const t = sanitize(reply);
    if (!t) return;
    onReply(post.id, t);
    setReply("");
  };

  const showReact = () => {
    clearTimeout(reactTimer.current);
    setReactOpen(true);
  };

  const hideReact = () => {
    reactTimer.current = setTimeout(() => setReactOpen(false), 350);
  };

  const reactionEntries = REACTIONS.filter(e => (post.reactions?.[e] || 0) > 0)
    .sort((a, b) => (post.reactions?.[b] || 0) - (post.reactions?.[a] || 0));
  const totalReactions = reactionEntries.reduce((sum, e) => sum + (post.reactions?.[e] || 0), 0);

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
        position:"relative", overflow:"visible",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:1,
        borderRadius:"var(--radius-lg) var(--radius-lg) 0 0",
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
        marginBottom: reactionEntries.length > 0 ? 10 : 15,
        letterSpacing:"0.01em",
      }}>{post.text}</p>

      {/* Reaction summary */}
      {reactionEntries.length > 0 && (
        <div style={{
          display:"flex", alignItems:"center", gap:6,
          marginBottom:12, paddingBottom:12,
          borderBottom:"1px solid var(--border)",
        }}>
          <div style={{display:"flex"}}>
            {reactionEntries.slice(0, 3).map((e, i) => (
              <span key={e} style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                width:22, height:22, borderRadius:"50%",
                background:"var(--surface2)",
                border:"2px solid var(--surface)",
                fontSize:11,
                marginLeft: i > 0 ? -6 : 0,
                boxShadow:"0 1px 4px rgba(0,0,0,0.15)",
                zIndex: 3 - i,
                position:"relative",
              }}>{e}</span>
            ))}
          </div>
          <span style={{fontSize:12, color:"var(--muted)", fontFamily:"var(--sans)"}}>
            {totalReactions}
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{display:"flex", gap:5, flexWrap:"wrap", alignItems:"center"}}>

        {/* React button with Facebook-style popup */}
        <div style={{position:"relative"}} onMouseEnter={showReact} onMouseLeave={hideReact}>
          <button style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"6px 13px", borderRadius:30,
            border: userReaction ? `1px solid ${pm.color}50` : "1px solid var(--border)",
            background: userReaction ? pm.dark : "var(--surface)",
            cursor:"pointer",
            fontSize:12, fontWeight:700,
            color: userReaction ? pm.color : "var(--muted)",
            fontFamily:"var(--sans)", transition:"all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = userReaction ? pm.dark : "var(--surface2)";
            e.currentTarget.style.color = pm.color;
            e.currentTarget.style.borderColor = `${pm.color}50`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = userReaction ? pm.dark : "var(--surface)";
            e.currentTarget.style.color = userReaction ? pm.color : "var(--muted)";
            e.currentTarget.style.borderColor = userReaction ? `${pm.color}50` : "var(--border)";
          }}
          >
            <span style={{fontSize:14}}>{userReaction || "👍"}</span>
            {userReaction ? REACTION_LABELS[userReaction] : "React"}
          </button>

          {/* Reaction popup */}
          <div
            onMouseEnter={() => clearTimeout(reactTimer.current)}
            onMouseLeave={hideReact}
            style={{
              position:"absolute",
              bottom:"calc(100% + 10px)",
              left:"50%",
              transform: reactOpen
                ? "translateX(-50%) scale(1) translateY(0)"
                : "translateX(-50%) scale(0.75) translateY(10px)",
              opacity: reactOpen ? 1 : 0,
              pointerEvents: reactOpen ? "auto" : "none",
              transition:"all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display:"flex", gap:4, alignItems:"flex-end",
              padding:"8px 10px", borderRadius:40,
              background:"var(--surface)",
              border:"1px solid var(--border)",
              boxShadow:"0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
              zIndex:100,
            }}
          >
            {/* Caret arrow */}
            <div style={{
              position:"absolute", bottom:-5, left:"50%",
              transform:"translateX(-50%) rotate(45deg)",
              width:9, height:9,
              background:"var(--surface)",
              border:"1px solid var(--border)",
              borderTop:"none", borderLeft:"none",
            }}/>

            {REACTIONS.map(e => (
              <div key={e} style={{position:"relative", display:"flex", flexDirection:"column", alignItems:"center"}}>
                {/* Tooltip label */}
                <div style={{
                  position:"absolute",
                  bottom:"calc(100% + 6px)",
                  left:"50%",
                  transform:"translateX(-50%)",
                  padding:"3px 7px", borderRadius:7,
                  background:"rgba(0,0,0,0.72)", color:"#fff",
                  fontSize:10, fontWeight:600, fontFamily:"var(--sans)",
                  whiteSpace:"nowrap", pointerEvents:"none",
                  opacity: hoveredEmoji === e ? 1 : 0,
                  transition:"opacity 0.1s",
                }}>
                  {REACTION_LABELS[e]}
                </div>
                <button
                  onClick={ev => handleReact(ev, e)}
                  onMouseEnter={() => setHoveredEmoji(e)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                  style={{
                    width: hoveredEmoji === e ? 42 : 34,
                    height: hoveredEmoji === e ? 42 : 34,
                    borderRadius:"50%",
                    border: userReaction === e ? `2px solid ${pm.color}` : "none",
                    background: hoveredEmoji === e
                      ? "var(--surface2)"
                      : userReaction === e
                        ? pm.dark
                        : "transparent",
                    cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize: hoveredEmoji === e ? 26 : 20,
                    transition:"all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: hoveredEmoji === e ? "translateY(-5px)" : "translateY(0)",
                  }}
                >
                  {e}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{flex:1}}/>

        {/* Reply button */}
        <button
          className="btn-ghost"
          onClick={() => setOpen(!open)}
          style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"6px 11px", borderRadius:30, fontSize:12, fontWeight:600,
            color: open ? pm.color : "var(--muted)",
            transition:"color 0.15s",
          }}
        >
          <ReplyIcon />
          {post.replies?.length > 0 && (
            <span>{post.replies.length}</span>
          )}
        </button>

        {/* Copy button */}
        <button
          className="btn-ghost"
          onClick={() => onShare(post)}
          title="Copy post"
          style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"6px 11px", borderRadius:30, fontSize:12, fontWeight:600,
          }}
        >
          <CopyIcon />
        </button>

        {/* Analyze button */}
        <button
          onClick={() => onAnalyze(post)}
          title="Analyze mood"
          style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"6px 11px", borderRadius:30, fontSize:12, fontWeight:600,
            border:`1px solid ${m.color}25`,
            background: m.dark,
            color: m.color,
            cursor:"pointer", fontFamily:"var(--sans)",
            transition:"all 0.15s",
            boxShadow:`inset 0 1px 0 ${m.color}15`,
          }}
        >
          <AnalyzeIcon />
        </button>
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
              placeholder="Write a reply…"
              style={{
                padding:"9px 14px", fontSize:13, borderRadius:12,
                "--accent":`${m.color}60`,
                "--accent-dim": m.dark,
              }}
            />
            <button onClick={send} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"9px 18px", borderRadius:12, border:"none",
              background: m.color,
              color:"#000", fontSize:12, fontWeight:700,
              cursor:"pointer", fontFamily:"var(--sans)",
              flexShrink:0, transition:"opacity 0.15s",
              boxShadow:`0 4px 18px ${m.glow}`,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Send
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
