// ─── STORAGE LAYER ────────────────────────────────────────────────────────────
// Personal data  → localStorage (instant, private per browser)
// Shared data    → JSONBin.io free API  (community feed visible to all users)
//
// HOW TO SET UP JSONBIN (free, takes 60 seconds):
//   1. Go to https://jsonbin.io and sign up free
//   2. Click "Create Bin" → paste this as initial content: {"posts":[]}
//   3. Copy the Bin ID from the URL  (looks like: 64f3a2b1...)
//   4. Go to API Keys → Master Key → copy it
//   5. Paste both values below and redeploy

const JSONBIN_BIN_ID  = import.meta.env.VITE_JSONBIN_BIN_ID  || "";
const JSONBIN_API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || "";
const JSONBIN_BASE    = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// ── JSONBin helpers ───────────────────────────────────────────────────────────
let _sharedCache = null;
let _cacheTs     = 0;
const CACHE_TTL  = 5000; // ms

async function jsonbinGet() {
  if (!JSONBIN_BIN_ID) return {};
  const now = Date.now();
  if (_sharedCache && now - _cacheTs < CACHE_TTL) return _sharedCache;
  try {
    const res  = await fetch(`${JSONBIN_BASE}/latest`, {
      headers: { "X-Master-Key": JSONBIN_API_KEY }
    });
    const json = await res.json();
    _sharedCache = json.record || {};
    _cacheTs     = now;
    return _sharedCache;
  } catch {
    return _sharedCache || {};
  }
}

async function jsonbinSet(data) {
  if (!JSONBIN_BIN_ID) return;
  _sharedCache = data;
  _cacheTs     = Date.now();
  try {
    await fetch(JSONBIN_BASE, {
      method:  "PUT",
      headers: {
        "Content-Type":  "application/json",
        "X-Master-Key":  JSONBIN_API_KEY,
        "X-Bin-Versioning": "false",
      },
      body: JSON.stringify(data),
    });
  } catch {}
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function storageGet(key, shared = false) {
  if (shared) {
    const data = await jsonbinGet();
    return data[key] !== undefined ? data[key] : null;
  }
  try {
    const raw = localStorage.getItem(`moodify:${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function storageSet(key, value, shared = false) {
  if (shared) {
    const data = await jsonbinGet();
    data[key]  = value;
    await jsonbinSet(data);
    return;
  }
  try {
    localStorage.setItem(`moodify:${key}`, JSON.stringify(value));
  } catch {}
}

export function isSharedConfigured() {
  return Boolean(JSONBIN_BIN_ID && JSONBIN_API_KEY);
}
