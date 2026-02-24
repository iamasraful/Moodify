import { useState, useEffect, useContext, createContext, useRef, useCallback } from "react";
import { storageGet, storageSet, isSharedConfigured } from "./storage.js";

// ─── MOOD CONFIG ──────────────────────────────────────────────────────────────
const MOODS = {
  happy:    { label:"Happy",     emoji:"😄", color:"#f59e0b", genre:"pop" },
  sad:      { label:"Sad",       emoji:"😢", color:"#60a5fa", genre:"acoustic" },
  angry:    { label:"Angry",     emoji:"😡", color:"#f87171", genre:"rock" },
  chill:    { label:"Chill",     emoji:"😎", color:"#34d399", genre:"lofi" },
  romantic: { label:"Romantic",  emoji:"💕", color:"#f472b6", genre:"romance" },
  anxious:  { label:"Anxious",   emoji:"😰", color:"#a78bfa", genre:"ambient" },
  hyped:    { label:"Hyped",     emoji:"🔥", color:"#fb923c", genre:"hiphop" },
  nostalgic:{ label:"Nostalgic", emoji:"🌙", color:"#94a3b8", genre:"indie" },
};

const MEME_CATS = {
  happy:"wholesomememes", sad:"me_irl", angry:"dankmemes",
  chill:"memes", romantic:"wholesomememes", anxious:"meirl",
  hyped:"dankmemes", nostalgic:"nostalgia",
};

const MOOD_WEATHER = {
  happy:    "Sunshine with a high of 98° feelings. Winds of joy expected.",
  sad:      "Overcast skies with a 90% chance of tears. Tissues advised.",
  angry:    "Severe thunderstorm warning in effect. Seek shelter immediately.",
  chill:    "Clear skies, 72° vibes. Perfect for doing absolutely nothing.",
  romantic: "Pink clouds with scattered heart showers. Bring your person.",
  anxious:  "Turbulent conditions. Forecast: 100% overthinking. Breathe.",
  hyped:    "EXTREME HEAT WARNING — you're literally on fire. Stay hydrated.",
  nostalgic:"Foggy with memories rolling in. Expect flashback visibility.",
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
function useApp() { return useContext(AppContext); }

// ─── TOAST ────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium animate-slide-in"
          style={{ background:"rgba(15,15,25,0.95)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(12px)" }}>
          <span>{t.icon}</span><span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── JSONBIN BANNER ───────────────────────────────────────────────────────────
function ConfigBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (isSharedConfigured() || dismissed) return null;
  return (
    <div className="mx-4 mt-3 rounded-2xl px-4 py-3 flex items-start gap-3"
      style={{ background:"rgba(251,146,60,0.15)", border:"1px solid rgba(251,146,60,0.4)" }}>
      <span className="text-lg mt-0.5">⚡</span>
      <div className="flex-1">
        <p className="text-orange-300 font-bold text-sm">Connect live feed</p>
        <p className="text-orange-200 text-xs mt-0.5">
          Posts are currently stored locally only. Add your{" "}
          <a href="https://jsonbin.io" target="_blank" rel="noreferrer" className="underline">JSONBin</a>
          {" "}keys in <code className="bg-black/30 px-1 rounded">.env</code> to share posts with everyone.
          See <strong>README.md</strong> for full setup instructions.
        </p>
      </div>
      <button onClick={() => setDismissed(true)} className="text-orange-400 hover:text-white text-lg leading-none">✕</button>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const AVATARS = ["🐱","🦊","🐼","🦋","🌟","🎭","🦄","🔥","🌈","🎪","🍀","⚡"];

function Onboarding({ onDone }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🌟");

  const handle = async () => {
    if (!name.trim()) return;
    const user = { name: name.trim(), avatar };
    await storageSet("user", user);
    onDone(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" }}>
      <div className="text-center max-w-md w-full">
        <div className="text-6xl mb-4 animate-bounce-mood">🎭</div>
        <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily:"Georgia,serif", letterSpacing:"-1px" }}>
          Welcome to Moodify
        </h1>
        <p className="text-slate-400 mb-8 text-lg">Express yourself. Explore your moods.</p>

        <div className="rounded-3xl p-6 mb-4"
          style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-white font-semibold mb-3 text-sm uppercase tracking-widest">Pick your avatar</p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)}
                className="text-2xl w-12 h-12 rounded-2xl transition-all"
                style={{
                  background: avatar===a ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)",
                  transform:  avatar===a ? "scale(1.2)" : "scale(1)",
                  border:     avatar===a ? "2px solid white" : "2px solid transparent",
                }}>
                {a}
              </button>
            ))}
          </div>
          <p className="text-white font-semibold mb-3 text-sm uppercase tracking-widest">Your display name</p>
          <input value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handle()}
            placeholder="e.g. CosmicVibes" maxLength={20}
            className="w-full px-4 py-3 rounded-2xl text-white text-center text-lg font-bold outline-none"
            style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)" }} />
        </div>

        <button onClick={handle} disabled={!name.trim()}
          className="w-full py-4 rounded-2xl text-white font-black text-lg transition-all"
          style={{
            background:"linear-gradient(135deg,#f59e0b,#f87171)",
            opacity: name.trim() ? 1 : 0.4,
            cursor:  name.trim() ? "pointer" : "not-allowed",
          }}>
          Enter Moodify ✨
        </button>
      </div>
    </div>
  );
}

// ─── VIBE CHECK ───────────────────────────────────────────────────────────────
const VIBE_Q = [
  { q:"How's your energy right now?", opts:[
    {t:"Through the roof 🔥",m:"hyped"},{t:"Pretty good 😊",m:"happy"},
    {t:"Mellow & easy 😎",m:"chill"}, {t:"Low & drained 😔",m:"sad"},
  ]},
  { q:"What sounds best right now?", opts:[
    {t:"Blasting music & dancing",m:"hyped"},{t:"Cuddling with someone 💕",m:"romantic"},
    {t:"Overthinking alone 😰",m:"anxious"},{t:"Old photos & memories 🌙",m:"nostalgic"},
  ]},
  { q:"Pick a color that feels like you:", opts:[
    {t:"🔴 Bold Red",m:"angry"},{t:"🌊 Cool Blue",m:"sad"},
    {t:"🌿 Calm Green",m:"chill"},{t:"🌸 Soft Pink",m:"romantic"},
  ]},
];

function VibeCheck({ onResult, onClose }) {
  const [step, setStep]   = useState(0);
  const [votes, setVotes] = useState({});

  const pick = (m) => {
    const v = { ...votes, [m]: (votes[m]||0)+1 };
    setVotes(v);
    if (step < VIBE_Q.length - 1) { setStep(step+1); }
    else { onResult(Object.entries(v).sort((a,b)=>b[1]-a[1])[0][0]); }
  };

  const q = VIBE_Q[step];
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)" }}>
      <div className="max-w-md w-full rounded-3xl p-6"
        style={{ background:"rgba(15,15,25,0.95)", border:"1px solid rgba(255,255,255,0.15)" }}>
        <div className="flex justify-between items-center mb-6">
          <span className="text-white font-black text-lg">✨ Vibe Check</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>
        <div className="flex gap-1 mb-6">
          {VIBE_Q.map((_,i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all"
              style={{ background: i<=step ? "#f59e0b" : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
        <p className="text-white text-xl font-bold mb-4">{q.q}</p>
        <div className="flex flex-col gap-3">
          {q.opts.map((o,i) => (
            <button key={i} onClick={() => pick(o.m)}
              className="px-4 py-3 rounded-2xl text-left text-white font-medium transition-all hover:scale-105"
              style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)" }}>
              {o.t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MOOD BAR ─────────────────────────────────────────────────────────────────
function MoodBar() {
  const { mood, setMood } = useApp();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-1" style={{ scrollbarWidth:"none" }}>
      {Object.entries(MOODS).map(([key,m]) => (
        <button key={key} onClick={() => setMood(key)}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl flex-shrink-0 transition-all"
          style={{
            background: mood===key ? m.color : "rgba(255,255,255,0.08)",
            transform:  mood===key ? "scale(1.1)" : "scale(1)",
            border:     mood===key ? "2px solid white" : "2px solid transparent",
          }}>
          <span className="text-lg">{m.emoji}</span>
          <span className="text-xs font-bold" style={{ color: mood===key ? "white" : "rgba(255,255,255,0.6)" }}>
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"feed",    icon:"📝", label:"Feed" },
  { id:"memes",   icon:"😂", label:"Memes" },
  { id:"music",   icon:"🎵", label:"Music" },
  { id:"explore", icon:"🔭", label:"Explore" },
  { id:"stats",   icon:"📊", label:"Stats" },
  { id:"profile", icon:"👤", label:"Profile" },
];

function BottomNav({ page, setPage }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around items-center px-2 py-2 md:hidden"
      style={{ background:"rgba(8,8,18,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all"
          style={{ color: page===n.id ? m.color : "rgba(255,255,255,0.4)", transform: page===n.id ? "scale(1.1)" : "scale(1)" }}>
          <span className="text-xl">{n.icon}</span>
          <span className="text-xs font-bold">{n.label}</span>
        </button>
      ))}
    </nav>
  );
}

function SideNav({ page, setPage }) {
  const { mood, user } = useApp();
  const m = MOODS[mood];
  return (
    <aside className="hidden md:flex flex-col gap-2 w-56 flex-shrink-0 sticky top-0 h-screen pt-6 px-4">
      <div className="flex items-center gap-3 mb-6 px-2">
        <span className="text-3xl">{user?.avatar||"🌟"}</span>
        <div>
          <p className="text-white font-black text-sm">{user?.name||"Moodifier"}</p>
          <p className="text-xs" style={{ color:m.color }}>● {m.label}</p>
        </div>
      </div>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all font-semibold"
          style={{
            background:  page===n.id ? `${m.color}22` : "transparent",
            color:       page===n.id ? m.color : "rgba(255,255,255,0.5)",
            borderLeft:  page===n.id ? `3px solid ${m.color}` : "3px solid transparent",
          }}>
          <span className="text-xl">{n.icon}</span>
          <span>{n.label}</span>
        </button>
      ))}
    </aside>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post, onReact, onReply, onShare, onAnalyze }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  const [showReplies, setShowReplies] = useState(false);
  const [replyText,   setReplyText]   = useState("");
  const postMood = MOODS[post.mood] || MOODS.happy;
  const { user } = useApp();

  const submitReply = () => {
    if (replyText.trim()) { onReply(post.id, replyText.trim()); setReplyText(""); }
  };

  return (
    <div className="rounded-3xl p-4 mb-3 transition-all"
      style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(10px)" }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{post.avatar}</span>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{post.author}</p>
          <p className="text-xs text-slate-500">
            {new Date(post.ts).toLocaleDateString()} · {new Date(post.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background:`${postMood.color}33`, color:postMood.color }}>
          {postMood.emoji} {postMood.label}
        </span>
      </div>

      <p className="text-white text-sm leading-relaxed mb-4" style={{ fontFamily:"Georgia,serif" }}>{post.text}</p>

      <div className="flex gap-2 flex-wrap">
        {["😂","❤️","🔥","😢","😮"].map(e => (
          <button key={e} onClick={() => onReact(post.id, e)}
            className="px-3 py-1 rounded-full text-sm transition-all hover:scale-110"
            style={{ background:"rgba(255,255,255,0.08)" }}>
            {e} <span className="text-white text-xs ml-1">{post.reactions?.[e]||0}</span>
          </button>
        ))}
        <button onClick={() => setShowReplies(!showReplies)}
          className="px-3 py-1 rounded-full text-xs text-slate-400 hover:text-white transition-all"
          style={{ background:"rgba(255,255,255,0.06)" }}>
          💬 {post.replies?.length||0}
        </button>
        <button onClick={() => onShare(post)}
          className="px-3 py-1 rounded-full text-xs text-slate-400 hover:text-white transition-all"
          style={{ background:"rgba(255,255,255,0.06)" }}>
          🔗 Share
        </button>
        <button onClick={() => onAnalyze(post)}
          className="px-3 py-1 rounded-full text-xs transition-all"
          style={{ background:`${m.color}22`, color:m.color }}>
          🔍 Analyze
        </button>
      </div>

      {showReplies && (
        <div className="mt-4 border-t pt-4" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
          {post.replies?.map((r,i) => (
            <div key={i} className="flex gap-2 mb-2">
              <span className="text-lg">{r.avatar}</span>
              <div className="rounded-2xl px-3 py-2 flex-1" style={{ background:"rgba(255,255,255,0.05)" }}>
                <p className="text-white text-xs font-bold">{r.author}</p>
                <p className="text-slate-300 text-xs">{r.text}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input value={replyText} onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key==="Enter" && submitReply()}
              placeholder="Write a reply…"
              className="flex-1 px-3 py-2 rounded-2xl text-white text-xs outline-none"
              style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)" }} />
            <button onClick={submitReply}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-white"
              style={{ background:m.color }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ANALYSIS MODAL ───────────────────────────────────────────────────────────
function AnalysisModal({ post, onClose }) {
  if (!post) return null;
  const text = post.text.toLowerCase();
  const scoring = {
    happy:    ["happy","joy","love","great","awesome","amazing","wonderful","excited","yay","haha"],
    sad:      ["sad","cry","miss","lonely","depressed","hurt","pain","lost","broken","tears"],
    angry:    ["angry","hate","frustrated","mad","annoyed","rage","ugh","awful","terrible","worst"],
    chill:    ["chill","relax","calm","peaceful","easy","mellow","vibe","cool","nice","fine"],
    hyped:    ["fire","hype","epic","let's go","yooo","crazy","insane","wild","lit","banger"],
  };
  const scores = {};
  Object.entries(scoring).forEach(([k,words]) => { scores[k] = words.filter(w => text.includes(w)).length; });
  const total  = Math.max(1, Object.values(scores).reduce((a,b) => a+b, 0));
  const top    = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)" }}>
      <div className="max-w-md w-full rounded-3xl p-6"
        style={{ background:"rgba(10,10,20,0.97)", border:"1px solid rgba(255,255,255,0.15)" }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-black">🔍 Mood Analysis</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <p className="text-slate-400 text-xs mb-4 italic">
          "{post.text.slice(0,80)}{post.text.length>80?"...":""}"
        </p>
        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-3 uppercase tracking-widest">Detected Mood Signals</p>
          {Object.entries(scores).map(([k,v]) => {
            const pct = Math.round((v/total)*100);
            const mm  = MOODS[k] || MOODS.chill;
            return (
              <div key={k} className="flex items-center gap-3 mb-2">
                <span className="text-sm w-6">{mm.emoji}</span>
                <span className="text-xs text-white w-16">{mm.label}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background:"rgba(255,255,255,0.08)" }}>
                  <div className="h-2 rounded-full transition-all" style={{ width:`${pct}%`, background:mm.color }} />
                </div>
                <span className="text-xs text-slate-400 w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background:`${MOODS[top[0]]?.color||"#888"}22` }}>
          <p className="text-white font-bold text-sm">
            Dominant Vibe: {MOODS[top[0]]?.emoji} {MOODS[top[0]]?.label}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {top[1]>0 ? `${top[1]} mood signal${top[1]>1?"s":""} detected` : "Neutral post — hard to read 🤔"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── WHO'S ONLINE STRIP ───────────────────────────────────────────────────────
function OnlineStrip({ posts }) {
  const seen   = new Set();
  const recent = posts.filter(p => { if (seen.has(p.author)) return false; seen.add(p.author); return true; }).slice(0,10);
  if (!recent.length) return null;
  return (
    <div className="mb-4">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 px-1">🌍 People on Moodify</p>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth:"none" }}>
        {recent.map((p, i) => {
          const mm = MOODS[p.mood] || MOODS.happy;
          return (
            <div key={p.author} className="flex flex-col items-center gap-1 flex-shrink-0 animate-fade-up"
              style={{ animationDelay:`${i*0.05}s` }}>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background:`${mm.color}33`, border:`2px solid ${mm.color}88` }}>
                  {p.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background:mm.color, fontSize:"10px" }}>
                  {mm.emoji}
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center truncate" style={{ maxWidth:"48px" }}>{p.author}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FEED ─────────────────────────────────────────────────────────────────────
function Feed() {
  const { mood, user, toast } = useApp();
  const [posts,        setPosts]        = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [text,         setText]         = useState("");
  const [filter,       setFilter]       = useState("all");
  const [analysis,     setAnalysis]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [onlineCount,  setOnlineCount]  = useState(1);
  const pollRef = useRef(null);
  const m = MOODS[mood];

  useEffect(() => {
    (async () => {
      const saved = await storageGet("posts", true);
      setPosts(saved || []);
      setLoading(false);
    })();
  }, []);

  // Poll every 5 s for new posts from other users
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      const fresh = await storageGet("posts", true);
      if (!fresh) return;
      setPosts(prev => {
        if (fresh.length > prev.length) {
          const prevIds  = new Set(prev.map(p => p.id));
          const newOnes  = fresh.filter(p => !prevIds.has(p.id) && p.author !== user?.name);
          if (newOnes.length) setPendingPosts(pp => [...newOnes, ...pp]);
          return fresh;
        }
        return fresh.length === prev.length ? fresh : prev;
      });
      const tenMin = Date.now() - 10*60*1000;
      const active = new Set(fresh.filter(p => p.ts > tenMin).map(p => p.author));
      if (user) active.add(user.name);
      setOnlineCount(Math.max(1, active.size));
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [user]);

  const publish = async () => {
    if (!text.trim()) return;
    const post    = { id:Date.now(), author:user.name, avatar:user.avatar, text:text.trim(), mood, ts:Date.now(), reactions:{}, replies:[] };
    const updated = [post, ...posts];
    setPosts(updated);
    await storageSet("posts", updated, true);
    setText("");
    toast("📝 Post published!", "✨");
    const hist = (await storageGet("moodHistory")) || [];
    hist.push({ mood, date:new Date().toDateString() });
    await storageSet("moodHistory", hist.slice(-100));
  };

  const onReact = async (id, emoji) => {
    const updated = posts.map(p => p.id===id ? {...p, reactions:{...p.reactions,[emoji]:(p.reactions[emoji]||0)+1}} : p);
    setPosts(updated);
    await storageSet("posts", updated, true);
  };

  const onReply = async (id, txt) => {
    const updated = posts.map(p => p.id===id ? {...p, replies:[...(p.replies||[]),{author:user.name,avatar:user.avatar,text:txt}]} : p);
    setPosts(updated);
    await storageSet("posts", updated, true);
    toast("💬 Reply sent!", "💬");
  };

  const onShare = (post) => {
    const txt = `"${post.text}" — ${post.author} feeling ${MOODS[post.mood]?.label} on Moodify`;
    navigator.clipboard?.writeText(txt).catch(()=>{});
    toast("🔗 Copied to clipboard!", "🔗");
  };

  const shown = filter==="all"  ? posts
              : filter==="mine" ? posts.filter(p => p.mood===mood)
              :                   posts.filter(p => p.author===user?.name);

  return (
    <div>
      {/* Live header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-white font-black text-xl" style={{ fontFamily:"Georgia,serif" }}>📝 Mood Feed</h2>
        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background:"rgba(52,211,153,0.15)", color:"#34d399" }}>
          <span className="online-dot" style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block" }} />
          {onlineCount} online
        </span>
      </div>

      {!loading && <OnlineStrip posts={posts} />}

      {/* New posts banner */}
      {pendingPosts.length > 0 && (
        <button onClick={() => setPendingPosts([])}
          className="w-full py-3 rounded-2xl text-white font-bold text-sm mb-4 flex items-center justify-center gap-2 animate-slide-down"
          style={{ background:`linear-gradient(135deg,${m.color}cc,${m.color}88)`, border:`1px solid ${m.color}66` }}>
          <span className="animate-bounce-mood">⬆️</span>
          {pendingPosts.length} new {pendingPosts.length===1?"post":"posts"} from the community
        </button>
      )}

      {/* Composer */}
      <div className="rounded-3xl p-4 mb-4"
        style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{user?.avatar}</span>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder={`What's on your mind, ${user?.name}? You're feeling ${m.label}…`}
            className="flex-1 text-white text-sm outline-none resize-none rounded-2xl p-3"
            style={{ background:"rgba(255,255,255,0.05)", minHeight:"80px", fontFamily:"Georgia,serif" }}
            maxLength={500} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">{text.length}/500 · feeling {m.emoji} {m.label}</span>
          <button onClick={publish} disabled={!text.trim()}
            className="px-6 py-2 rounded-2xl text-white font-bold text-sm transition-all"
            style={{ background:text.trim()?m.color:"rgba(255,255,255,0.1)", opacity:text.trim()?1:0.5 }}>
            Post Mood ✨
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {[["all","🌍 Everyone"],["mine",`My Mood ${m.emoji}`],["me","My Posts 👤"]].map(([id,label]) => (
          <button key={id} onClick={() => setFilter(id)}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all"
            style={{ background:filter===id?m.color:"rgba(255,255,255,0.08)", color:filter===id?"white":"rgba(255,255,255,0.5)" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading
        ? [1,2,3].map(i => <div key={i} className="h-32 rounded-3xl mb-3 animate-pulse" style={{ background:"rgba(255,255,255,0.05)" }} />)
        : shown.length===0
          ? <div className="text-center py-16 text-slate-500"><div className="text-5xl mb-3">🌱</div><p>No posts yet. Be the first!</p></div>
          : shown.map((p,i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay:`${Math.min(i,5)*0.05}s` }}>
                <PostCard post={p} onReact={onReact} onReply={onReply} onShare={onShare} onAnalyze={setAnalysis} />
              </div>
            ))
      }

      {analysis && <AnalysisModal post={analysis} onClose={() => setAnalysis(null)} />}
    </div>
  );
}

// ─── MEMES ────────────────────────────────────────────────────────────────────
function Memes() {
  const { mood, toast } = useApp();
  const [meme,    setMeme]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [cat,     setCat]     = useState("");
  const [saved,   setSaved]   = useState([]);
  const m = MOODS[mood];

  useEffect(() => {
    (async () => { setSaved(await storageGet("savedMemes") || []); })();
    fetchMeme(MEME_CATS[mood]);
  }, [mood]);

  const fetchMeme = async (subreddit) => {
    setLoading(true);
    try {
      const r    = await fetch(`https://meme-api.com/gimme/${subreddit || MEME_CATS[mood]}`);
      const data = await r.json();
      if (data.url) setMeme(data);
    } catch { toast("Couldn't load meme 😢","❌"); }
    setLoading(false);
  };

  const saveMeme = async () => {
    if (!meme) return;
    const updated = [meme, ...saved].slice(0,20);
    setSaved(updated);
    await storageSet("savedMemes", updated);
    toast("Meme saved! 💾","💾");
  };

  const CATS = ["memes","dankmemes","wholesomememes","me_irl","animememes","ProgrammerHumor"];

  return (
    <div>
      <h2 className="text-white font-black text-2xl mb-4" style={{ fontFamily:"Georgia,serif" }}>😂 Meme Generator</h2>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth:"none" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => { setCat(c); fetchMeme(c); }}
            className="px-3 py-2 rounded-full text-xs font-bold flex-shrink-0 transition-all"
            style={{ background:cat===c?m.color:"rgba(255,255,255,0.08)", color:cat===c?"white":"rgba(255,255,255,0.6)" }}>
            r/{c}
          </button>
        ))}
      </div>

      <div className="rounded-3xl overflow-hidden mb-4"
        style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        {loading
          ? <div className="h-72 flex items-center justify-center" style={{ background:"rgba(255,255,255,0.04)" }}>
              <div className="text-4xl animate-spin-mood">🎭</div>
            </div>
          : meme && <>
              <img src={meme.url} alt={meme.title} className="w-full object-contain max-h-96" style={{ background:"#000" }} />
              <div className="p-4">
                <p className="text-white text-sm font-semibold mb-1">{meme.title}</p>
                <p className="text-slate-500 text-xs">r/{meme.subreddit} · 👍 {meme.ups?.toLocaleString()}</p>
              </div>
            </>
        }
      </div>

      <div className="flex gap-3">
        <button onClick={() => fetchMeme(cat||MEME_CATS[mood])} className="flex-1 py-3 rounded-2xl font-bold text-white" style={{ background:m.color }}>
          🎲 Get Another
        </button>
        <button onClick={saveMeme} className="px-6 py-3 rounded-2xl font-bold text-white" style={{ background:"rgba(255,255,255,0.1)" }}>
          💾
        </button>
        <button onClick={() => { navigator.clipboard?.writeText(meme?.url||""); toast("Link copied!","🔗"); }}
          className="px-6 py-3 rounded-2xl font-bold text-white" style={{ background:"rgba(255,255,255,0.1)" }}>
          🔗
        </button>
      </div>

      {saved.length > 0 && (
        <div className="mt-6">
          <p className="text-white font-bold mb-3 text-sm uppercase tracking-widest">💾 Saved Memes</p>
          <div className="grid grid-cols-3 gap-2">
            {saved.slice(0,6).map((s,i) => (
              <img key={i} src={s.url} alt="" className="rounded-2xl object-cover aspect-square w-full cursor-pointer" onClick={() => setMeme(s)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MUSIC ────────────────────────────────────────────────────────────────────
function Music() {
  const { mood, toast } = useApp();
  const [songs,   setSongs]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(null);
  const m = MOODS[mood];

  const fetchSongs = async (q) => {
    setLoading(true);
    try {
      const term = encodeURIComponent(q || m.genre);
      const r    = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&limit=12&entity=song`);
      const data = await r.json();
      setSongs(data.results?.filter(s => s.previewUrl) || []);
    } catch { toast("Couldn't load songs 😢","❌"); }
    setLoading(false);
  };

  useEffect(() => { fetchSongs(); }, [mood]);

  const play = (song) => {
    if (playing?.trackId === song.trackId) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) { audioRef.current.src = song.previewUrl; audioRef.current.play().catch(()=>{}); }
      setPlaying(song);
      toast(`▶️ ${song.trackName}`,"🎵");
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-black text-2xl" style={{ fontFamily:"Georgia,serif" }}>🎵 Mood Music</h2>
        <button onClick={() => fetchSongs()} className="px-4 py-2 rounded-2xl text-xs font-bold text-white" style={{ background:m.color }}>
          🔀 Shuffle
        </button>
      </div>
      <div className="rounded-3xl p-4 mb-4" style={{ background:`${m.color}22`, border:`1px solid ${m.color}44` }}>
        <p className="text-white font-bold">{m.emoji} {m.label} Playlist</p>
        <p className="text-xs" style={{ color:m.color }}>Songs tuned to your current mood · {m.genre} vibes</p>
      </div>

      <audio ref={audioRef} onEnded={() => setPlaying(null)} />

      {loading
        ? [1,2,3,4].map(i => <div key={i} className="h-20 rounded-3xl mb-3 animate-pulse" style={{ background:"rgba(255,255,255,0.05)" }} />)
        : (
          <div className="flex flex-col gap-3">
            {songs.map(s => (
              <div key={s.trackId} onClick={() => play(s)}
                className="flex items-center gap-3 p-3 rounded-3xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  background: playing?.trackId===s.trackId ? `${m.color}33` : "rgba(255,255,255,0.06)",
                  border:     playing?.trackId===s.trackId ? `1px solid ${m.color}66` : "1px solid rgba(255,255,255,0.08)",
                }}>
                <div className="relative flex-shrink-0">
                  <img src={s.artworkUrl100} alt="" className="w-14 h-14 rounded-2xl" />
                  {playing?.trackId===s.trackId && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background:"rgba(0,0,0,0.5)" }}>
                      <span className="text-xl">⏸</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{s.trackName}</p>
                  <p className="text-slate-400 text-xs truncate">{s.artistName}</p>
                  <p className="text-xs truncate" style={{ color:m.color }}>{s.collectionName}</p>
                </div>
                <div className="text-xl flex-shrink-0">{playing?.trackId===s.trackId ? "🔊" : "▶️"}</div>
              </div>
            ))}
          </div>
        )
      }

      {playing && (
        <div className="fixed bottom-16 left-0 right-0 md:bottom-0 px-4 py-3 z-20"
          style={{ background:"rgba(8,8,18,0.97)", backdropFilter:"blur(20px)", borderTop:`2px solid ${m.color}` }}>
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <img src={playing.artworkUrl100} alt="" className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{playing.trackName}</p>
              <p className="text-slate-400 text-xs truncate">{playing.artistName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm animate-pulse-mood" style={{ color:m.color }}>▶ PLAYING</span>
              <button onClick={() => { audioRef.current?.pause(); setPlaying(null); }} className="text-slate-400 hover:text-white text-lg">⏹</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXPLORE ──────────────────────────────────────────────────────────────────
function Explore() {
  const { mood, setMood, toast } = useApp();
  const [quote,    setQuote]    = useState(null);
  const [joke,     setJoke]     = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingJ, setLoadingJ] = useState(false);
  const [posts,    setPosts]    = useState([]);
  const [showVibe, setShowVibe] = useState(false);
  const m = MOODS[mood];

  useEffect(() => {
    fetchQuote();
    fetchJoke();
    (async () => { setPosts(await storageGet("posts",true) || []); })();
  }, []);

  const fetchQuote = async () => {
    setLoadingQ(true);
    try { const r = await fetch("https://api.quotable.io/random"); setQuote(await r.json()); }
    catch { setQuote({ content:"Feelings are just visitors, let them come and go.", author:"Unknown" }); }
    setLoadingQ(false);
  };

  const fetchJoke = async () => {
    setLoadingJ(true);
    try { const r = await fetch("https://official-joke-api.appspot.com/random_joke"); setJoke(await r.json()); }
    catch {}
    setLoadingJ(false);
  };

  const moodCounts = posts.reduce((acc,p) => { acc[p.mood]=(acc[p.mood]||0)+1; return acc; }, {});
  const trending   = Object.entries(moodCounts).sort((a,b) => b[1]-a[1]).slice(0,4);
  const moodOfDay  = trending[0]?.[0] || "happy";

  return (
    <div className="space-y-4">
      <h2 className="text-white font-black text-2xl" style={{ fontFamily:"Georgia,serif" }}>🔭 Explore</h2>

      {/* Vibe Check */}
      <div className="rounded-3xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
        onClick={() => setShowVibe(true)}
        style={{ background:`linear-gradient(135deg,${m.color}33,rgba(255,255,255,0.05))`, border:`1px solid ${m.color}55` }}>
        <p className="text-white font-black text-lg mb-1">✨ Take a Vibe Check</p>
        <p className="text-slate-300 text-sm">3 quick questions to detect your true mood</p>
      </div>
      {showVibe && (
        <VibeCheck
          onResult={result => { setMood(result); setShowVibe(false); toast(`Vibe: ${MOODS[result].emoji} ${MOODS[result].label}!`,"✨"); }}
          onClose={() => setShowVibe(false)}
        />
      )}

      {/* Mood Weather */}
      <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">🌤 Emotional Forecast</p>
        <p className="text-white font-bold text-lg">{m.emoji} {m.label} Weather</p>
        <p className="text-slate-300 text-sm mt-1" style={{ fontFamily:"Georgia,serif", fontStyle:"italic" }}>
          {MOOD_WEATHER[mood]}
        </p>
      </div>

      {/* Trending */}
      <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">🔥 Trending Moods</p>
        {trending.length ? (
          <div className="flex gap-2 flex-wrap">
            {trending.map(([k,cnt]) => { const mm = MOODS[k]||MOODS.happy; return (
              <div key={k} className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background:`${mm.color}22` }}>
                <span>{mm.emoji}</span>
                <span className="text-white text-xs font-bold">{mm.label}</span>
                <span className="text-xs" style={{ color:mm.color }}>{cnt}</span>
              </div>
            ); })}
          </div>
        ) : <p className="text-slate-500 text-sm">No mood data yet</p>}
        {trending[0] && (
          <p className="text-xs text-slate-400 mt-3">
            🏆 Mood of the day: {MOODS[moodOfDay]?.emoji} <strong className="text-white">{MOODS[moodOfDay]?.label}</strong>
          </p>
        )}
      </div>

      {/* Quote */}
      <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex justify-between items-center mb-3">
          <p className="text-slate-400 text-xs uppercase tracking-widest">💬 Daily Inspiration</p>
          <button onClick={fetchQuote} className="text-xs px-3 py-1 rounded-full text-white" style={{ background:m.color }}>
            {loadingQ ? "…" : "↻"}
          </button>
        </div>
        {quote
          ? <>
              <p className="text-white text-sm leading-relaxed mb-2" style={{ fontFamily:"Georgia,serif", fontStyle:"italic" }}>
                "{quote.content}"
              </p>
              <p className="text-right text-xs" style={{ color:m.color }}>— {quote.author}</p>
            </>
          : <div className="h-12 animate-pulse rounded-xl" style={{ background:"rgba(255,255,255,0.05)" }} />
        }
      </div>

      {/* Joke */}
      <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex justify-between items-center mb-3">
          <p className="text-slate-400 text-xs uppercase tracking-widest">😄 Mood Booster</p>
          <button onClick={fetchJoke} className="text-xs px-3 py-1 rounded-full text-white" style={{ background:m.color }}>
            {loadingJ ? "…" : "↻"}
          </button>
        </div>
        {joke
          ? <>
              <p className="text-white text-sm font-semibold mb-2">{joke.setup}</p>
              <p className="text-sm" style={{ color:m.color, fontStyle:"italic" }}>{joke.punchline} 😄</p>
            </>
          : <div className="h-12 animate-pulse rounded-xl" style={{ background:"rgba(255,255,255,0.05)" }} />
        }
      </div>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function TimeCapsule() {
  const { mood, user, toast } = useApp();
  const [msg,      setMsg]      = useState("");
  const [capsules, setCapsules] = useState([]);
  const m = MOODS[mood];

  useEffect(() => { (async () => { setCapsules(await storageGet("capsules") || []); })(); }, []);

  const save = async () => {
    if (!msg.trim()) return;
    const c       = { id:Date.now(), text:msg.trim(), mood, author:user?.name, unlockAt:Date.now()+7*24*60*60*1000, ts:Date.now() };
    const updated = [c, ...capsules];
    setCapsules(updated);
    await storageSet("capsules", updated);
    setMsg("");
    toast("⏰ Time capsule sealed! Opens in 7 days","⏰");
  };

  const now = Date.now();
  return (
    <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-white font-black mb-1">⏰ Mood Time Capsule</p>
      <p className="text-slate-400 text-xs mb-3">Write to your future self. Opens in 7 days.</p>
      <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Dear future me…"
        className="w-full text-white text-sm outline-none resize-none rounded-2xl p-3 mb-3"
        style={{ background:"rgba(255,255,255,0.05)", minHeight:"70px", fontFamily:"Georgia,serif" }} />
      <button onClick={save} disabled={!msg.trim()} className="w-full py-2 rounded-2xl text-white font-bold text-sm"
        style={{ background:m.color, opacity:msg.trim()?1:0.5 }}>
        🔒 Seal Capsule
      </button>
      {capsules.length > 0 && (
        <div className="mt-4 space-y-2">
          {capsules.slice(0,3).map(c => (
            <div key={c.id} className="rounded-2xl p-3" style={{ background:"rgba(255,255,255,0.04)" }}>
              {now >= c.unlockAt
                ? <><p className="text-xs text-green-400 mb-1">✅ Unlocked!</p><p className="text-white text-xs" style={{ fontFamily:"Georgia,serif" }}>{c.text}</p></>
                : <><p className="text-xs" style={{ color:m.color }}>🔒 Opens {new Date(c.unlockAt).toLocaleDateString()}</p><p className="text-slate-500 text-xs">{c.mood} mood · sealed by {c.author}</p></>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stats() {
  const { mood } = useApp();
  const [history, setHistory] = useState([]);
  const [posts,   setPosts]   = useState([]);
  const m = MOODS[mood];

  useEffect(() => {
    (async () => {
      setHistory(await storageGet("moodHistory") || []);
      setPosts(await storageGet("posts", true) || []);
    })();
  }, []);

  const last7      = Array.from({length:7}, (_,i) => { const d=new Date(); d.setDate(d.getDate()-i); return d.toDateString(); }).reverse();
  const moodByDay  = last7.map(day => {
    const moods = history.filter(h => h.date===day);
    const cnt   = moods.reduce((a,h) => { a[h.mood]=(a[h.mood]||0)+1; return a; }, {});
    return { day:day.split(" ").slice(0,3).join(" "), ...cnt, total:moods.length };
  });
  const allMoods  = history.reduce((a,h) => { a[h.mood]=(a[h.mood]||0)+1; return a; }, {});
  const topMood   = Object.entries(allMoods).sort((a,b) => b[1]-a[1])[0];
  const maxDay    = Math.max(1, ...moodByDay.map(d => d.total));
  const streak    = (() => { let s=0; for (let i=last7.length-1; i>=0; i--) { if (moodByDay[i].total>0) s++; else break; } return s; })();

  return (
    <div className="space-y-4">
      <h2 className="text-white font-black text-2xl" style={{ fontFamily:"Georgia,serif" }}>📊 Mood Analytics</h2>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Mood Streak", value:`${streak} days`, icon:"🔥" },
          { label:"Top Mood",    value:topMood?`${MOODS[topMood[0]]?.emoji} ${MOODS[topMood[0]]?.label}`:"—", icon:"🏆" },
          { label:"Total Posts", value:posts.length, icon:"📝" },
        ].map(s => (
          <div key={s.label} className="rounded-3xl p-3 text-center"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-white font-black text-sm">{s.value}</p>
            <p className="text-slate-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">📅 7-Day Mood Activity</p>
        <div className="flex items-end gap-2 h-24">
          {moodByDay.map((d,i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-xl transition-all"
                style={{ height:`${Math.max(8,(d.total/maxDay)*80)}px`, background:d.total>0?m.color:"rgba(255,255,255,0.1)" }} />
              <p className="text-slate-500 text-center" style={{ fontSize:"9px" }}>{d.day.split(" ")[0]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">🎭 All-Time Mood Breakdown</p>
        {Object.keys(allMoods).length === 0
          ? <p className="text-slate-500 text-sm text-center py-4">No mood data yet. Start posting!</p>
          : Object.entries(allMoods).sort((a,b) => b[1]-a[1]).map(([k,v]) => {
              const mm    = MOODS[k] || MOODS.happy;
              const total = Object.values(allMoods).reduce((a,b) => a+b, 0);
              const pct   = Math.round((v/total)*100);
              return (
                <div key={k} className="flex items-center gap-3 mb-3">
                  <span className="text-lg w-7">{mm.emoji}</span>
                  <span className="text-white text-xs w-20 font-semibold">{mm.label}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background:"rgba(255,255,255,0.08)" }}>
                    <div className="h-2 rounded-full" style={{ width:`${pct}%`, background:mm.color }} />
                  </div>
                  <span className="text-xs text-slate-400 w-8">{pct}%</span>
                </div>
              );
            })
        }
      </div>

      <TimeCapsule />
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile() {
  const { mood, user, setUser, toast, darkMode, setDarkMode } = useApp();
  const [posts,   setPosts]   = useState([]);
  const [name,    setName]    = useState(user?.name||"");
  const [avatar,  setAvatar]  = useState(user?.avatar||"🌟");
  const [editing, setEditing] = useState(false);
  const m = MOODS[mood];

  useEffect(() => {
    (async () => { setPosts((await storageGet("posts",true)||[]).filter(x => x.author===user?.name)); })();
  }, []);

  const save = async () => {
    const u = { name, avatar };
    setUser(u);
    await storageSet("user", u);
    setEditing(false);
    toast("Profile updated! ✨","✨");
  };

  const totalReactions = posts.reduce((a,p) => a+Object.values(p.reactions||{}).reduce((x,y) => x+y, 0), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-6 text-center"
        style={{ background:`linear-gradient(135deg,${m.color}33,rgba(255,255,255,0.05))`, border:`1px solid ${m.color}44` }}>
        <div className="text-6xl mb-3">{user?.avatar}</div>
        <h2 className="text-white font-black text-2xl" style={{ fontFamily:"Georgia,serif" }}>{user?.name}</h2>
        <p className="text-sm" style={{ color:m.color }}>{m.emoji} Currently feeling {m.label}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[{l:"Posts",v:posts.length,i:"📝"},{l:"Reactions Received",v:totalReactions,i:"❤️"}].map(s => (
          <div key={s.l} className="rounded-3xl p-4 text-center"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <div className="text-2xl mb-1">{s.i}</div>
            <p className="text-white font-black text-xl">{s.v}</p>
            <p className="text-slate-500 text-xs">{s.l}</p>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-white font-bold mb-3">Edit Profile</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)}
                className="text-2xl w-10 h-10 rounded-xl transition-all"
                style={{ background:avatar===a?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.05)", transform:avatar===a?"scale(1.2)":"scale(1)" }}>
                {a}
              </button>
            ))}
          </div>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-white mb-3 outline-none"
            style={{ background:"rgba(255,255,255,0.1)" }} maxLength={20} />
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-2 rounded-2xl text-white font-bold text-sm" style={{ background:m.color }}>Save</button>
            <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-2xl text-white font-bold text-sm" style={{ background:"rgba(255,255,255,0.1)" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="w-full py-3 rounded-2xl text-white font-bold"
          style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)" }}>
          ✏️ Edit Profile
        </button>
      )}

      <div className="rounded-3xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold">🌙 Dark Mode</p>
            <p className="text-slate-500 text-xs">Toggle app theme</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="w-12 h-6 rounded-full transition-all relative"
            style={{ background:darkMode?m.color:"rgba(255,255,255,0.2)" }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
              style={{ left:darkMode?"calc(100% - 22px)":"2px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FAB ──────────────────────────────────────────────────────────────────────
function FAB({ setPage }) {
  const { mood } = useApp();
  const m = MOODS[mood];
  return (
    <button onClick={() => setPage("feed")}
      className="fixed bottom-20 right-4 md:bottom-6 w-14 h-14 rounded-full text-white text-2xl shadow-2xl z-20 flex items-center justify-center transition-all hover:scale-110"
      style={{ background:`linear-gradient(135deg,${m.color},#f87171)`, boxShadow:`0 0 24px ${m.color}88` }}>
      ✏️
    </button>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mood,     setMoodState] = useState("happy");
  const [darkMode, setDarkMode]  = useState(true);
  const [user,     setUser]      = useState(null);
  const [page,     setPage]      = useState("feed");
  const [toasts,   setToasts]    = useState([]);
  const [loading,  setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      const u  = await storageGet("user");
      const mo = await storageGet("mood");
      const dm = await storageGet("darkMode");
      if (u)           setUser(u);
      if (mo)          setMoodState(mo);
      if (dm !== null) setDarkMode(dm);
      setLoading(false);
    })();
  }, []);

  const setMood = async (mo) => {
    setMoodState(mo);
    await storageSet("mood", mo);
    const hist = (await storageGet("moodHistory")) || [];
    hist.push({ mood:mo, date:new Date().toDateString() });
    await storageSet("moodHistory", hist.slice(-100));
  };

  const toast = useCallback((msg, icon="✨") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background:"#080812" }}>
      <div className="text-5xl animate-bounce-mood">🎭</div>
    </div>
  );

  if (!user) return <Onboarding onDone={u => setUser(u)} />;

  const m     = MOODS[mood];
  const pages = { feed:<Feed/>, memes:<Memes/>, music:<Music/>, explore:<Explore/>, stats:<Stats/>, profile:<Profile/> };

  return (
    <AppContext.Provider value={{ mood, setMood, darkMode, setDarkMode, user, setUser, toast }}>
      <div style={{ minHeight:"100vh", background:darkMode?"#080812":"#f0f4ff", fontFamily:"'Segoe UI',sans-serif" }}>

        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ background:`radial-gradient(ellipse 80% 50% at 50% 0%, ${m.color}18 0%, transparent 60%)` }} />

        {/* Header */}
        <header className="sticky top-0 z-30 px-4 py-3"
          style={{ background:"rgba(8,8,18,0.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎭</span>
                <span className="text-white font-black text-xl"
                  style={{ fontFamily:"Georgia,serif", background:`linear-gradient(135deg,${m.color},#f87171)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  Moodify
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold hidden md:block">{user?.avatar} {user?.name}</span>
                <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded-full text-xs"
                  style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)" }}>
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>
            </div>
            <MoodBar />
          </div>
        </header>

        <ConfigBanner />

        <div className="max-w-3xl mx-auto flex gap-0 md:gap-6 px-0 md:px-4 py-4 relative z-10">
          <SideNav page={page} setPage={setPage} />
          <main className="flex-1 min-w-0 px-4 md:px-0 pb-24 md:pb-8">
            {pages[page] || <Feed />}
          </main>
        </div>

        <BottomNav page={page} setPage={setPage} />
        <FAB setPage={setPage} />
        <ToastContainer toasts={toasts} />
      </div>
    </AppContext.Provider>
  );
}
