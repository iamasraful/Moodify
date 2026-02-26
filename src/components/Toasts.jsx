export default function Toasts({ toasts }) {
  return (
    <div style={{
      position:"fixed", top:16, right:16, zIndex:9998,
      display:"flex", flexDirection:"column", gap:8,
      pointerEvents:"none", maxWidth:280,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:"rgba(10,10,22,0.97)",
          border:"1px solid rgba(255,255,255,0.1)",
          backdropFilter:"blur(24px)",
          borderRadius:14, padding:"11px 16px",
          display:"flex", alignItems:"center", gap:10,
          animation:"toastSlide 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
          pointerEvents:"all",
        }}>
          <span style={{fontSize:15}}>{t.icon}</span>
          <span style={{
            color:"rgba(255,255,255,0.88)", fontSize:13,
            fontWeight:500, fontFamily:"var(--sans)",
          }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
