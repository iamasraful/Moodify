import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function BackgroundOrbs() {
  const { mood } = useApp();
  const m = MOODS[mood];
  return (
    <div style={{position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden"}}>
      <div style={{
        position:"absolute", width:"65vw", height:"65vw",
        maxWidth:600, maxHeight:600, borderRadius:"50%",
        background:`radial-gradient(circle, ${m.color}10 0%, transparent 68%)`,
        top:"-20%", right:"-5%",
        transition:"background 2s ease",
        animation:"orbPulse 18s ease-in-out infinite",
      }}/>
      <div style={{
        position:"absolute", width:"55vw", height:"55vw",
        maxWidth:480, maxHeight:480, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
        bottom:"-15%", left:"-5%",
        animation:"orbPulse 22s ease-in-out infinite reverse",
      }}/>
      <div style={{
        position:"absolute", width:"25vw", height:"25vw",
        maxWidth:220, maxHeight:220, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
        top:"40%", left:"25%",
        animation:"orbPulse 14s ease-in-out infinite",
      }}/>
      {/* Dot grid */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"radial-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
        backgroundSize:"28px 28px",
      }}/>
    </div>
  );
}
