# 🐱 Evil Larry Cat (ELC) Discord Bot

> *"You now belong to Evil Larry."*

A chaotic, meme-powered Discord bot built around the **PEENAR economy**. Steal, destroy, protect, and grow your PEENAR empire — all while Evil Larry watches.

---

## 🚀 Setup Guide (Step by Step)

### Step 1: Create Your Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** → Name it `Evil Larry Cat`
3. Go to **Bot** tab → Click **Add Bot**
4. Under **Privileged Gateway Intents**, enable:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
5. Click **Reset Token** → Copy your bot token
6. Copy your **Application ID** (Client ID) from the General Information tab

### Step 2: Set Up Supabase Database (Free via GitHub Student Pack)

1. Go to [supabase.com](https://supabase.com) → Sign in with GitHub
2. Create a **New Project** (free tier)
3. Once created, go to **SQL Editor**
4. Paste the contents of `database_schema.sql` and click **Run**
5. Go to **Settings → API** → Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:
```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run Locally (for testing)

```bash
npm run dev
```

### Step 6: Invite Bot to Your Server

Replace `YOUR_CLIENT_ID` in this URL and open it in your browser:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274877975552&scope=bot
```

---

## ☁️ Deploy to Railway (Free via GitHub Student Pack)

Railway gives you **$5/month free credit** — more than enough for a Discord bot.

1. Push your code to a **GitHub repo**
   ```bash
   git init
   git add .
   git commit -m "Initial ELC bot commit"
   git remote add origin https://github.com/YOUR_USERNAME/evil-larry-bot.git
   git push -u origin main
   ```

2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub Repo**

3. Select your repo

4. Go to **Variables** tab → Add all your `.env` variables:
   - `DISCORD_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

5. Railway auto-deploys! Check the **Logs** tab to see Evil Larry come online.

---

## 🎮 Command Reference

| Command | Description |
|---|---|
| `elc start` | Register in the PEENAR economy |
| `elc profile` | View your PEENAR profile |
| `elc steal @user` | Steal from another user (50% chance, 30min cooldown) |
| `elc chamber @user` | Destroy stolen PEENAR in the Explosion Chamber |
| `elc summon james` | Summon Evil James for 1 hour of protection |
| `elc leaderboard` | View the top PEENAR holders |
| `elc help` | Show all commands |

---

## 🖼️ Adding Meme Images

The bot uses image URLs for Evil Larry and Evil James memes. To add your own:

1. Upload your meme images to a Discord channel
2. Right-click the image → **Copy Link**
3. Open `src/utils/embeds.js`
4. Replace the placeholder URLs in the `IMAGES` object:

```js
const IMAGES = {
  EVIL_LARRY: 'https://cdn.discordapp.com/attachments/YOUR_EVIL_LARRY_IMAGE_URL',
  EVIL_JAMES:  'https://cdn.discordapp.com/attachments/YOUR_EVIL_JAMES_IMAGE_URL',
  CHAMBER:     'https://cdn.discordapp.com/attachments/YOUR_CHAMBER_IMAGE_URL',
};
```

---

## 😈 Evil Level Ranks

| Points | Rank |
|---|---|
| 0 | Innocent Fool 😇 |
| 1 | Larry Follower 🐱 |
| 3 | Junior Menace 😈 |
| 5 | Chaos Agent 🔥 |
| 10 | True Evil 💀 |
| 20 | Disciple of Larry 👑 |

---

## 🏗️ Project Structure

```
evil-larry-bot/
├── src/
│   ├── index.js              # Main entry point
│   ├── commands/
│   │   ├── start.js          # elc start
│   │   ├── profile.js        # elc profile
│   │   ├── steal.js          # elc steal
│   │   ├── chamber.js        # elc chamber
│   │   ├── summonjames.js    # elc summon james
│   │   └── leaderboard.js    # elc leaderboard
│   ├── events/
│   │   ├── ready.js          # Bot ready + daily tax cron
│   │   └── messageCreate.js  # Command router
│   ├── database/
│   │   └── db.js             # Supabase helpers
│   └── utils/
│       └── embeds.js         # Discord embed builders
├── database_schema.sql       # Run this in Supabase SQL Editor
├── .env.example              # Copy to .env and fill in
├── package.json
├── railway.toml              # Railway deployment config
└── README.md
```

---

*Evil Larry is always watching. 🐱*
