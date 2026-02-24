<<<<<<< HEAD
# 🎭 Moodify

> A mood-driven social platform. Share your vibe, discover music & memes, connect through feelings.

![Moodify](https://img.shields.io/badge/Moodify-Live-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-success)

---

## 🚀 Deploy to GitHub Pages in 5 Minutes

### Step 1 — Fork & clone this repo

```bash
# On GitHub, click "Fork" on this repo, then:
git clone https://github.com/YOUR_USERNAME/moodify.git
cd moodify
npm install
```

---

### Step 2 — Set up JSONBin (free shared feed, 60 seconds)

Moodify uses [JSONBin.io](https://jsonbin.io) as a free backend so all users share the same live feed.

1. Go to **https://jsonbin.io** → Sign Up (free)
2. Click **"New Bin"** → paste this as content → Save:
   ```json
   {"posts":[]}
   ```
3. Copy the **Bin ID** from the URL bar (the long string after `/b/`)
4. Click your avatar → **API Keys** → copy the **Master Key**

---

### Step 3 — Add secrets to GitHub

1. Go to your forked repo on GitHub
2. Click **Settings → Secrets and variables → Actions → New repository secret**
3. Add these two secrets:

   | Secret Name            | Value                        |
   |------------------------|------------------------------|
   | `VITE_JSONBIN_BIN_ID`  | Your Bin ID from Step 2      |
   | `VITE_JSONBIN_API_KEY` | Your Master Key from Step 2  |

---

### Step 4 — Enable GitHub Pages

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

---

### Step 5 — Deploy!

Push any commit to `main` and GitHub Actions will build and deploy automatically:

```bash
git add .
git commit -m "Deploy Moodify 🎭"
git push origin main
```

Watch the **Actions** tab — in ~2 minutes your site will be live at:
```
https://YOUR_USERNAME.github.io/moodify/
```

---

## 💻 Run Locally

```bash
# 1. Copy env file
cp .env.example .env

# 2. Fill in your JSONBin keys in .env

# 3. Start dev server
npm run dev
```

App will be at `http://localhost:5173`

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 Live Feed | Posts shared in real-time across all users |
| 😂 Meme Generator | Random memes from Reddit via Meme API |
| 🎵 Mood Music | 30-sec song previews via iTunes API |
| 🔭 Explore | Trending moods, quotes, jokes, Vibe Check quiz |
| 📊 Analytics | 7-day mood chart, streaks, breakdown |
| ⏰ Time Capsule | Write to your future self, unlocks in 7 days |
| 🌍 Who's Online | See other Moodify users in real time |
| 🌙 Dark Mode | Full dark/light theme toggle |

---

## 🔑 Free APIs Used

| API | Usage |
|---|---|
| [JSONBin.io](https://jsonbin.io) | Shared community feed storage |
| [Meme API](https://meme-api.com) | Random memes by subreddit |
| [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI) | Mood-matched music + 30s previews |
| [Quotable](https://api.quotable.io) | Inspirational quotes |
| [Official Joke API](https://official-joke-api.appspot.com) | Random jokes |

All APIs are free with no key required except JSONBin.

---

## 📁 Project Structure

```
moodify/
├── .github/
│   └── workflows/
│       └── deploy.yml      ← Auto-deploy to GitHub Pages
├── src/
│   ├── App.jsx             ← Full app (components, pages, logic)
│   ├── storage.js          ← localStorage + JSONBin storage layer
│   ├── main.jsx            ← React entry point
│   └── index.css           ← Tailwind + custom animations
├── index.html
├── vite.config.js
├── tailwind.config.js
├── .env.example            ← Copy to .env with your keys
└── README.md
```

---

## 🛠 Tech Stack

- **React 18** + Vite 5
- **Tailwind CSS** for styling
- **JSONBin.io** for serverless shared storage
- **localStorage** for personal/private data
- **GitHub Actions** for CI/CD
- **GitHub Pages** for hosting

---

## ❓ Troubleshooting

**Feed not updating for other users?**
→ Check that your JSONBin secrets are set correctly in GitHub repo settings.

**CORS error on JSONBin?**
→ Make sure your Master Key is correct and the Bin is set to "Public" (default).

**Memes not loading?**
→ The meme-api.com can occasionally be rate-limited. Try again in a moment.

**Build failing in GitHub Actions?**
→ Check the Actions tab for error logs. Most common issue: missing secrets.

---

Made with 🎭 and good vibes.
=======
![image](https://github.com/user-attachments/assets/16afe743-4083-4a9d-a7c8-de43e28829b5)

# Moodify 

### Introduction
A few days ago, I delved into the concepts of REST APIs. To practice what I learned, I created a web app named **Moodify**. This app is purely built with backend technologies, including Node.js, Express.js, REST APIs, and EJS. Moodify allows users to interact with the app according to their mood.

### Features

#### Current Features
- **Post on Moodify Feed:** Users can post anything they want on the Moodify feed. 📝
- **Generate Random Content:** Users can generate random content based on their mood. 🔀
- **Generate Random Songs:** Users can generate random songs that align with their mood. 🎶
- **Download Content:** All generated and posted content can be downloaded. 💾

#### Upcoming Features
- **User Interactions:** Users will be able to reply to, share, and analyze posts. 💬🔄📊
- **Meme Generation:** Users will be able to generate memes according to different categories. 🖼️
- **Mood-Based Songs:** Users will be able to generate songs based on their current mood. 🎼

![Moodify_compressed-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/ba73ac40-01e4-4511-8725-38ff16d65ef1)


### Technologies Used
- **Node.js:** Backend JavaScript runtime environment. 🌐
- **Express.js:** Web application framework for Node.js. 🛠️
- **REST API:** Architectural style for designing networked applications. 🌉
- **EJS (Embedded JavaScript):** Templating engine for generating HTML with JavaScript. 📝

### Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/iamasraful/Moodify.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Moodify
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Usage
- Open your browser and navigate to `http://localhost:8080`. 🌍
- Explore the features:
  - Post on the Moodify feed. 📝
  - Generate random content and songs. 🔀🎶
  - Download your content. 💾

### Future Plans
Stay tuned for updates as we continue to add more features:
1. Reply, share, and analyze posts. 💬🔄📊
2. Generate memes based on various categories. 🖼️
3. Create songs that match your current mood. 🎼

### Contributing
Contributions are welcome! Please fork the repository and submit a pull request. 🤝

### License
This project is licensed under the MIT License. 📜

---

Thank you for checking out Moodify! Your feedback and contributions are highly appreciated. If you have any questions or suggestions, feel free to reach out. 😊
>>>>>>> 60f98bcaf3d2c388b850476543b720561fb1ec83
