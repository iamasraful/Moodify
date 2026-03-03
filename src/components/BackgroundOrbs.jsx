import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function BackgroundOrbs() {
  const { mood, theme } = useApp();
  const m = MOODS[mood];
  const light = theme === "light";

  return (
    <div style={{position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden"}}>
      {/* Primary mood orb — top right */}
      <div style={{
        position:"absolute", width:"72vw", height:"72vw",
        maxWidth:680, maxHeight:680, borderRadius:"50%",
        background: light
          ? `radial-gradient(circle, ${m.color}22 0%, ${m.color}08 45%, transparent 70%)`
          : `radial-gradient(circle, ${m.color}18 0%, ${m.color}06 45%, transparent 70%)`,
        top:"-25%", right:"-10%",
        transition:"background 2.2s ease",
        animation:"orbPulse 18s ease-in-out infinite",
        filter:"blur(2px)",
      }}/>
      {/* Secondary indigo orb — bottom left */}
      <div style={{
        position:"absolute", width:"60vw", height:"60vw",
        maxWidth:520, maxHeight:520, borderRadius:"50%",
        background: light
          ? "radial-gradient(circle, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.04) 50%, transparent 72%)"
          : "radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.03) 50%, transparent 72%)",
        bottom:"-18%", left:"-8%",
        animation:"orbPulse 24s ease-in-out infinite reverse",
        filter:"blur(2px)",
      }}/>
      {/* Tertiary pink accent — center */}
      <div style={{
        position:"absolute", width:"30vw", height:"30vw",
        maxWidth:260, maxHeight:260, borderRadius:"50%",
        background: light
          ? "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 68%)"
          : "radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 68%)",
        top:"38%", left:"22%",
        animation:"orbPulse 16s ease-in-out infinite",
        filter:"blur(1px)",
      }}/>
      {/* Quaternary soft teal — bottom right */}
      <div style={{
        position:"absolute", width:"22vw", height:"22vw",
        maxWidth:200, maxHeight:200, borderRadius:"50%",
        background: light
          ? "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
        bottom:"20%", right:"8%",
        animation:"orbPulse 20s ease-in-out infinite reverse",
        filter:"blur(1px)",
      }}/>
      {/* Dot grid — adapts to theme */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage: light
          ? "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)"
          : "radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)",
        backgroundSize:"28px 28px",
      }}/>
      {/* Vignette */}
      <div style={{
        position:"absolute", inset:0,
        background: light
          ? "linear-gradient(180deg, rgba(240,239,233,0.25) 0%, transparent 30%, transparent 70%, rgba(240,239,233,0.35) 100%)"
          : "linear-gradient(180deg, rgba(6,6,15,0.3) 0%, transparent 30%, transparent 70%, rgba(6,6,15,0.4) 100%)",
        transition:"background 0.3s ease",
      }}/>
    </div>
  );
}
