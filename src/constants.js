export const MOODS = {
  happy:    { label:"Happy",     emoji:"😄", color:"#F59E0B", glow:"rgba(245,158,11,0.4)",  dark:"rgba(245,158,11,0.08)",  genre:"happy pop upbeat",
    queries:["Badshah songs","bollywood party hits","Yo Yo Honey Singh dance","Dua Lipa dance pop","Pharrell Williams happy"] },
  sad:      { label:"Sad",       emoji:"😢", color:"#60A5FA", glow:"rgba(96,165,250,0.4)",  dark:"rgba(96,165,250,0.08)",  genre:"sad acoustic emotional",
    queries:["Arijit Singh sad","Jubin Nautiyal emotional","KK dil ibaadat","Adele heartbreak","hindi breakup songs"] },
  angry:    { label:"Angry",     emoji:"😡", color:"#F43F5E", glow:"rgba(244,63,94,0.4)",   dark:"rgba(244,63,94,0.08)",   genre:"angry rock aggressive",
    queries:["Linkin Park","Eminem rap","Diljit Dosanjh punjabi","Honey Singh rap","hard rock aggressive"] },
  chill:    { label:"Chill",     emoji:"😎", color:"#10B981", glow:"rgba(16,185,129,0.4)",  dark:"rgba(16,185,129,0.08)",  genre:"chill lofi relaxing",
    queries:["Prateek Kuhad","lofi hindi chill","Cigarettes After Sex","indie acoustic relax","Shubh mellow"] },
  romantic: { label:"Romantic",  emoji:"💕", color:"#EC4899", glow:"rgba(236,72,153,0.4)",  dark:"rgba(236,72,153,0.08)",  genre:"romantic love ballad",
    queries:["Arijit Singh romantic","Atif Aslam love songs","KK pyaar ke pal","Ed Sheeran perfect","bollywood love"] },
  anxious:  { label:"Anxious",   emoji:"😰", color:"#8B5CF6", glow:"rgba(139,92,246,0.4)",  dark:"rgba(139,92,246,0.08)",  genre:"ambient anxiety calm",
    queries:["hindi instrumental piano calm","ambient study focus","lofi peaceful beats","soft acoustic soothing","A R Rahman instrumental"] },
  hyped:    { label:"Hyped",     emoji:"🔥", color:"#F97316", glow:"rgba(249,115,22,0.4)",  dark:"rgba(249,115,22,0.08)",  genre:"hype energetic hip hop",
    queries:["Badshah club banger","punjabi dance floor","The Weeknd Blinding Lights","bollywood item number","EDM hype drops"] },
  nostalgic:{ label:"Nostalgic", emoji:"🌙", color:"#94A3B8", glow:"rgba(148,163,184,0.4)", dark:"rgba(148,163,184,0.08)", genre:"nostalgic indie folk",
    queries:["Kishore Kumar","Lata Mangeshkar","Mohammed Rafi","90s bollywood hits","retro hindi classics"] },
};

export const MEME_SUBS = {
  happy:"wholesomememes", sad:"me_irl", angry:"dankmemes",
  chill:"memes", romantic:"wholesomememes", anxious:"meirl",
  hyped:"dankmemes", nostalgic:"nostalgia"
};

export const MOOD_FORECAST = {
  happy:    "Sunny with a high of pure joy. UV index: dangerously wholesome.",
  sad:      "Overcast. 90% chance of tears after midnight. Pack tissues.",
  angry:    "Severe storm warning. Lightning likely. Shelter immediately.",
  chill:    "Clear skies, 72°F vibes. Zero pressure. Absolutely perfect.",
  romantic: "Rose-colored clouds. Scattered heart showers. Bring someone.",
  anxious:  "Turbulent at altitude. 100% chance of overthinking. Breathe.",
  hyped:    "EXTREME HEAT. You are literally on fire. Stay hydrated.",
  nostalgic:"Dense fog of memories. Low visibility. Flashbacks imminent.",
};

export const AVATARS = ["🐱","🦊","🐼","🦋","🌟","🎭","🦄","🔥","🌈","🎪","🍀","⚡","🦁","🐺","🎨","🚀","🙈","🤡"];

export const VIBE_Q = [
  { q:"What's your energy right now?", opts:[
    {t:"Electric — I could run a marathon",m:"hyped"},
    {t:"Warm and genuinely good",m:"happy"},
    {t:"Still water, no ripples",m:"chill"},
    {t:"Heavy. Everything is heavy.",m:"sad"},
  ]},
  { q:"What does your heart want?", opts:[
    {t:"To move, to scream, to dance",m:"hyped"},
    {t:"Someone close. Very close.",m:"romantic"},
    {t:"Quiet and spiral thoughts",m:"anxious"},
    {t:"Songs from a different era",m:"nostalgic"},
  ]},
  { q:"Pick a texture:", opts:[
    {t:"Cracked concrete — raw",m:"angry"},
    {t:"Deep ocean floor — cold",m:"sad"},
    {t:"Velvet at midnight — soft",m:"romantic"},
    {t:"Fog over old fields — hazy",m:"nostalgic"},
  ]},
];

export const NAV = [
  {id:"feed",    icon:"◎", label:"Feed"},
  {id:"memes",   icon:"✦", label:"Memes"},
  {id:"music",   icon:"♫", label:"Music"},
  {id:"explore", icon:"⊕", label:"Explore"},
  {id:"stats",   icon:"◈", label:"Stats"},
  {id:"profile", icon:"◉", label:"You"},
];
