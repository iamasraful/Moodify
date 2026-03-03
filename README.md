# 🎭 Moodify

> A mood-driven social platform. Share your vibe, discover music & memes, connect through feelings.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-success)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Page | What it does |
|------|-------------|
| 📝 **Feed** | Shared social feed — post your mood, react, reply. Synced across all users via JSONBin. |
| 😂 **Memes** | Mood-matched memes pulled from Reddit subreddits in real time. |
| 🎵 **Music** | 30-second song previews via iTunes API. Previous/next controls, queue, auto-play on mood change. |
| 🔭 **Explore** | Vibe Check quiz, emotional forecast, community mood trends, quotes, and jokes. |
| 📊 **Stats** | Personal 7-day mood chart, streak counter, and mood breakdown. |
| 👤 **Profile** | Edit your name and avatar. View your post and reaction counts. |
| ⏰ **Time Capsule** | Write a message to your future self — unlocks after 7 days. |
| 🌍 **Who's Online** | See other Moodify users active right now (desktop). |

---

## 🚀 Deploy to GitHub Pages

### Step 1 — Fork & clone

```bash
git clone https://github.com/YOUR_USERNAME/Moodify.git
cd Moodify
npm install
```

---

### Step 2 — Set up JSONBin (free shared feed)

JSONBin is used as a free backend so all users share the same live feed. Without it the app works fine in standalone mode — posts are saved to localStorage only.

1. Go to [jsonbin.io](https://jsonbin.io) → Sign Up (free)
2. Click **New Bin** → paste `{"posts":[]}` as content → Save
3. Copy the **Bin ID** from the URL (the long string after `/b/`)
4. Go to your avatar → **API Keys** → copy the **Master Key**

---

### Step 3 — Add secrets to GitHub

1. Open your forked repo on GitHub
2. Go to **Settings → Secrets and variables → Actions → New repository secret**
3. Add both secrets:

   | Secret Name | Value |
   |---|---|
   | `VITE_JSONBIN_BIN_ID` | Bin ID from Step 2 |
   | `VITE_JSONBIN_API_KEY` | Master Key from Step 2 |

---

### Step 4 — Enable GitHub Pages

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

---

### Step 5 — Push to deploy

```bash
git add .
git commit -m "Deploy Moodify 🎭"
git push origin main
```

The **Actions** tab will show the build progress. In ~2 minutes your site is live at:

```
https://YOUR_USERNAME.github.io/Moodify/
```

> The base path is set automatically from the repo name — no manual config needed.

---

## 💻 Run Locally

```bash
# 1. Copy the env template
cp .env.example .env

# 2. Fill in your JSONBin keys in .env (optional — app works without them)

# 3. Start the dev server
npm run dev
```

App runs at `http://localhost:5173`

---

## 🔑 APIs Used

| API | Used for | Key required? |
|-----|----------|:---:|
| [JSONBin.io](https://jsonbin.io) | Shared community feed | Yes (free) |
| [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI) | Mood-matched music + 30s previews | No |
| [Meme API](https://meme-api.com) | Reddit memes by mood subreddit | No |
| [Official Joke API](https://official-joke-api.appspot.com) | Random jokes on Explore page | No |
| Built-in quotes | Inspirational quotes (offline, no API) | No |

---

## 🛠 Tech Stack

- **React 18** — UI + hooks
- **Vite 5** — build tool and dev server
- **CSS custom properties** — full dark/light theming via `--variable` tokens
- **JSONBin.io** — serverless shared storage (optional)
- **localStorage** — personal data (mood history, profile, time capsule)
- **GitHub Actions** — automatic CI/CD on push to `main`
- **GitHub Pages** — hosting

---

## 📁 Project Structure

```
Moodify/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Auto-deploy to GitHub Pages
├── src/
│   ├── components/
│   │   ├── AnalysisModal.jsx   ← Sentiment keyword analysis
│   │   ├── BackgroundOrbs.jsx  ← Animated mood-reactive background
│   │   ├── BottomDock.jsx      ← Mobile nav bar
│   │   ├── ConfigBanner.jsx    ← JSONBin setup prompt
│   │   ├── FAB.jsx             ← Floating action button
│   │   ├── MoodRail.jsx        ← Horizontal mood selector
│   │   ├── Onboarding.jsx      ← First-time name + avatar setup
│   │   ├── OnlineStrip.jsx     ← Active users display
│   │   ├── Particle.jsx        ← Emoji reaction animation
│   │   ├── PostCard.jsx        ← Feed post with reactions + replies
│   │   ├── Sidebar.jsx         ← Desktop navigation
│   │   ├── TimeCapsule.jsx     ← 7-day future message
│   │   ├── Toasts.jsx          ← Notification toasts
│   │   └── VibeCheck.jsx       ← 3-question mood detection quiz
│   ├── pages/
│   │   ├── Explore.jsx         ← Quotes, jokes, vibe check, mood forecast
│   │   ├── Feed.jsx            ← Social feed with post composer
│   │   ├── Memes.jsx           ← Reddit meme fetcher
│   │   ├── Music.jsx           ← iTunes music player
│   │   ├── Profile.jsx         ← User profile editor
│   │   └── Stats.jsx           ← Mood analytics dashboard
│   ├── App.jsx                 ← Root component, routing, context provider
│   ├── constants.js            ← Moods, nav items, vibe questions, subreddits
│   ├── context.jsx             ← React context + theme helpers
│   ├── helpers.js              ← Time formatting, XSS sanitizer
│   ├── index.css               ← CSS variables, animations, global styles
│   ├── itunes.js               ← iTunes Search API client
│   ├── main.jsx                ← React entry point
│   └── storage.js              ← localStorage + JSONBin storage layer
├── .env.example                ← Copy to .env with your JSONBin keys
├── index.html
├── vite.config.js
└── package.json
```

---

## ❓ Troubleshooting

**App loads blank after GitHub Pages deploy?**
→ Ensure the workflow ran successfully in the **Actions** tab. The base path is set automatically — no changes to `vite.config.js` needed.

**Feed not updating for other users?**
→ Check that `VITE_JSONBIN_BIN_ID` and `VITE_JSONBIN_API_KEY` are set correctly in repo **Settings → Secrets**.

**CORS error with JSONBin?**
→ Make sure your Master Key is correct and the Bin visibility is set to **Public** (default).

**Memes not loading?**
→ `meme-api.com` can be rate-limited. Wait a moment and hit the refresh button.

**Build fails in GitHub Actions?**
→ Check the Actions tab logs. Most common cause: missing or misspelled secret names.

---

Made with 🎭 and good vibes.
