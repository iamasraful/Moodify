import { useState, useEffect, useCallback } from "react";
import { storageGet, storageSet } from "./storage.js";
import { MOODS } from "./constants.js";
import { sanitize } from "./helpers.js";
import { Ctx, getStoredTheme, applyTheme } from "./context.jsx";

import Onboarding from "./components/Onboarding.jsx";
import MoodRail from "./components/MoodRail.jsx";
import Sidebar from "./components/Sidebar.jsx";
import BottomDock from "./components/BottomDock.jsx";
import FAB from "./components/FAB.jsx";
import ConfigBanner from "./components/ConfigBanner.jsx";
import BackgroundOrbs from "./components/BackgroundOrbs.jsx";
import Toasts from "./components/Toasts.jsx";

import Feed from "./pages/Feed.jsx";
import Memes from "./pages/Memes.jsx";
import Music from "./pages/Music.jsx";
import Explore from "./pages/Explore.jsx";
import Stats from "./pages/Stats.jsx";
import Profile from "./pages/Profile.jsx";

const PAGES = { feed: Feed, memes: Memes, music: Music, explore: Explore, stats: Stats, profile: Profile };

export default function App() {
  const [mood, setMoodState] = useState("happy");
  const [user, setUser]      = useState(null);
  const [page, setPage]      = useState("feed");
  const [toasts, setToasts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme]    = useState(getStoredTheme);
  const m = MOODS[mood];

  // Keep HTML data-theme in sync
  useEffect(() => { applyTheme(theme); }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === "dark" ? "light" : "dark");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const u  = await storageGet("user");
        const mo = await storageGet("mood");
        if (u && typeof u.name === "string") setUser(u);
        if (mo && MOODS[mo]) setMoodState(mo);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const setMood = useCallback(async key => {
    if (!MOODS[key]) return;
    setMoodState(key);
    await storageSet("mood", key);
    const hist = (await storageGet("moodHistory")) || [];
    await storageSet("moodHistory",
      [...hist, { mood:key, date:new Date().toDateString() }].slice(-100)
    );
  }, []);

  const toast = useCallback((msg, icon = "✦") => {
    const id = Date.now() + Math.random();
    const safe = sanitize(String(msg)).slice(0, 80);
    setToasts(t => [...t, { id, msg:safe, icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  if (loading) return (
    <div style={{
      position:"fixed", inset:0, background:"var(--bg)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:20,
    }}>
      <div style={{
        position:"absolute", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)",
        pointerEvents:"none",
      }}/>
      <div style={{
        width:58, height:58, borderRadius:19,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28,
        background:"var(--surface)",
        border:"1px solid var(--border)",
        boxShadow:"0 0 40px rgba(139,92,246,0.3), inset 0 1px 0 var(--inset-shine)",
        animation:"float 1.8s ease-in-out infinite",
      }}>🎭</div>
      <div style={{textAlign:"center"}}>
        <p style={{
          fontFamily:"var(--serif)", fontSize:24, color:"var(--text)",
          letterSpacing:"-0.6px", marginBottom:10,
        }}>Moodify</p>
        <p style={{
          color:"var(--faint)", fontSize:10, fontFamily:"var(--sans)",
          letterSpacing:"0.18em", textTransform:"uppercase",
          animation:"pulse 2s ease-in-out infinite",
        }}>Loading…</p>
      </div>
    </div>
  );

  if (!user) return (
    <Ctx.Provider value={{ mood, setMood, user, setUser, toast, theme, toggleTheme }}>
      <Onboarding onDone={u => setUser(u)} />
    </Ctx.Provider>
  );

  const PageComponent = PAGES[page] || Feed;

  return (
    <Ctx.Provider value={{ mood, setMood, user, setUser, toast, theme, toggleTheme }}>
      <div style={{
        height:"100vh", display:"flex", flexDirection:"column",
        background:"var(--bg)", color:"var(--text)", overflow:"hidden",
        transition:"background 0.3s ease",
      }}>

        <BackgroundOrbs/>

        {/* Header */}
        <header style={{
          flexShrink:0, zIndex:70,
          background:"var(--bg-frosted)",
          backdropFilter:"blur(32px) saturate(180%)",
          WebkitBackdropFilter:"blur(32px) saturate(180%)",
          borderBottom:"1px solid var(--border)",
          boxShadow:"0 1px 0 var(--inset-shine), 0 8px 32px rgba(0,0,0,0.15)",
          position:"relative",
          transition:"background 0.3s ease, border-color 0.3s ease",
        }}>
          {/* Mood-reactive accent line */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0, height:1,
            background:`linear-gradient(90deg, transparent 0%, ${m.color}50 30%, ${m.color}70 50%, ${m.color}50 70%, transparent 100%)`,
            transition:"background 0.6s ease",
          }}/>
          <ConfigBanner/>
          <div style={{maxWidth:860, margin:"0 auto", padding:"10px 16px"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
              {/* Logo */}
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{
                  width:34, height:34, borderRadius:12,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:17,
                  background:"var(--surface)",
                  border:"1px solid var(--border)",
                  boxShadow:`0 0 20px ${m.color}25, inset 0 1px 0 var(--inset-shine)`,
                  transition:"box-shadow 0.5s ease",
                }}>🎭</div>
                <span style={{
                  fontFamily:"var(--serif)", fontWeight:400, fontSize:23,
                  letterSpacing:"-0.7px", color:"var(--text)",
                  transition:"color 0.3s",
                }}>Moodify</span>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                style={{
                  width:36, height:36, borderRadius:12,
                  border:"1px solid var(--border)",
                  background:"var(--surface)", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:15, transition:"all 0.2s ease",
                  color:"var(--muted)",
                  boxShadow:"inset 0 1px 0 var(--inset-shine)",
                  flexShrink:0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--surface2)";
                  e.currentTarget.style.borderColor = "var(--border2)";
                  e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "var(--surface)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                {theme === "dark" ? "☀" : "🌙"}
              </button>
            </div>
            <MoodRail/>
          </div>
        </header>

        {/* Layout */}
        <div style={{
          flex:1, overflow:"hidden",
          width:"100%", maxWidth:860, margin:"0 auto",
          display:"flex",
        }}>
          <Sidebar page={page} setPage={setPage}/>
          <main style={{
            flex:1, minWidth:0,
            overflowY:"auto", overscrollBehavior:"none",
            padding:"1px 16px 120px",
          }}>
            <div key={page} style={{animation:"fadeUp 0.35s ease"}}>
              <PageComponent/>
            </div>
          </main>
        </div>

        <BottomDock page={page} setPage={setPage}/>
        {page === "feed" && <FAB onClick={() => document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" })}/>}
        <Toasts toasts={toasts}/>
      </div>
    </Ctx.Provider>
  );
}
