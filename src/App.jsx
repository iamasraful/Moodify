import { useState, useEffect, useCallback } from "react";
import { storageGet, storageSet } from "./storage.js";
import { MOODS } from "./constants.js";
import { sanitize } from "./helpers.js";
import { Ctx } from "./context.jsx";

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
      position:"fixed", inset:0, background:"#080812",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:16,
    }}>
      <div style={{
        fontSize:48, animation:"float 1.8s ease-in-out infinite",
        filter:"drop-shadow(0 0 28px rgba(139,92,246,0.55))",
      }}>🎭</div>
      <p style={{
        color:"var(--faint)", fontSize:11, fontFamily:"var(--sans)",
        letterSpacing:"0.15em", textTransform:"uppercase",
        animation:"pulse 2s ease-in-out infinite",
      }}>Loading…</p>
    </div>
  );

  if (!user) return (
    <Ctx.Provider value={{ mood, setMood, user, setUser, toast }}>
      <Onboarding onDone={u => setUser(u)} />
    </Ctx.Provider>
  );

  const PageComponent = PAGES[page] || Feed;

  return (
    <Ctx.Provider value={{ mood, setMood, user, setUser, toast }}>
      <div style={{
        height:"100vh", display:"flex", flexDirection:"column",
        background:"#080812", color:"var(--text)", overflow:"hidden",
      }}>

        <BackgroundOrbs/>

        {/* Header */}
        <header style={{
          flexShrink:0, zIndex:70,
          background:"rgba(8,8,18,0.84)",
          backdropFilter:"blur(28px) saturate(160%)",
          WebkitBackdropFilter:"blur(28px) saturate(160%)",
          borderBottom:"1px solid var(--border)",
          boxShadow:"0 1px 0 rgba(255,255,255,0.02)",
        }}>
          <ConfigBanner/>
          <div style={{maxWidth:860, margin:"0 auto", padding:"8px 16px"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{
                  width:32, height:32, borderRadius:11,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:17, background:"var(--surface)",
                  border:"1px solid var(--border)",
                }}>🎭</div>
                <span style={{
                  fontFamily:"var(--serif)", fontWeight:400, fontSize:22,
                  color:"var(--text)", letterSpacing:"-0.7px",
                }}>Moodify</span>
              </div>
              {/* <span style={{color:"var(--text)", fontSize:11, fontFamily:"var(--serif)",border:"2px solid var(--border)",borderRadius:12,}}>{user?.avatar} {user?.name}</span> */}
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
        {page === "feed" && <FAB onClick={() => setPage("feed")}/>}
        <Toasts toasts={toasts}/>
      </div>
    </Ctx.Provider>
  );
}
