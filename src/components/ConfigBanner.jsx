import { useState } from "react";
import { isSharedConfigured } from "../storage.js";

export default function ConfigBanner() {
  const [gone, setGone] = useState(false);
  if (isSharedConfigured() || gone) return null;
  return (
    <div style={{
      padding:"9px 16px", display:"flex", alignItems:"center", gap:10,
      background:"rgba(249,115,22,0.08)",
      borderBottom:"1px solid rgba(249,115,22,0.15)",
    }}>
      <span style={{fontSize:13, flexShrink:0}}>⚡</span>
      <span style={{
        color:"rgba(249,115,22,0.8)", fontSize:11, flex:1,
        fontFamily:"var(--sans)", lineHeight:1.4,
      }}>
        Set <code style={{background:"rgba(249,115,22,0.15)", padding:"1px 5px", borderRadius:4}}>VITE_JSONBIN_BIN_ID</code> &amp; <code style={{background:"rgba(249,115,22,0.15)", padding:"1px 5px", borderRadius:4}}>VITE_JSONBIN_API_KEY</code> in Vercel to enable the community feed.
      </span>
      <button onClick={() => setGone(true)} style={{
        background:"none", border:"none", color:"rgba(249,115,22,0.4)",
        cursor:"pointer", fontSize:16, flexShrink:0, lineHeight:1,
        padding:"2px 4px",
      }}>×</button>
    </div>
  );
}
