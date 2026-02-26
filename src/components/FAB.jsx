import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function FAB({ onClick }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  return (
    <button className="fab" onClick={onClick} style={{
      position:"fixed", zIndex:89,
      width:52, height:52, borderRadius:17, border:"none",
      background:`linear-gradient(135deg, ${m.color}, ${m.color}bb)`,
      color:"#000", fontSize:22, cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:`0 6px 28px ${m.glow}, 0 0 0 1px ${m.color}30`,
      animation:"float 4s ease-in-out infinite",
      transition:"background 0.4s, box-shadow 0.4s",
      fontWeight:900,
    }}
    onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
    onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
    >+</button>
  );
}
