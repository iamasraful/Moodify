const JSONBIN_BIN_ID  = import.meta.env.VITE_JSONBIN_BIN_ID  || "";
const JSONBIN_API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || "";
const JSONBIN_BASE    = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

let _sharedCache = null;
let _cacheTs     = 0;
const CACHE_TTL  = 5000;
let _pendingWrite = null;

async function jsonbinGet() {
  if (!JSONBIN_BIN_ID) return {};
  const now = Date.now();
  if (_sharedCache && now - _cacheTs < CACHE_TTL) return _sharedCache;
  try {
    const res  = await fetch(`${JSONBIN_BASE}/latest`, {
      headers: { "X-Master-Key": JSONBIN_API_KEY }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
  // Debounce writes — only last write within 300ms goes through
  if (_pendingWrite) clearTimeout(_pendingWrite);
  _pendingWrite = setTimeout(async () => {
    try {
      await fetch(JSONBIN_BASE, {
        method:  "PUT",
        headers: {
          "Content-Type":     "application/json",
          "X-Master-Key":     JSONBIN_API_KEY,
          "X-Bin-Versioning": "false",
        },
        body: JSON.stringify(data),
      });
    } catch {}
  }, 300);
}

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
    // Sanitize posts — strip excessively large payloads
    if (key === "posts" && Array.isArray(value)) {
      value = value.slice(0, 200).map(p => ({
        ...p,
        text: String(p.text || "").slice(0, 500),
        replies: (p.replies || []).slice(0, 50),
      }));
    }
    data[key] = value;
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
