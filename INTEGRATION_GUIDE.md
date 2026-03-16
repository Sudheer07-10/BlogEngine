# Team Integration Guide - Traffic Content System

This document explains how to integrate the **Vertical Pulse** framework into your own projects. This system is optimized for fast, AI-powered content ingestion, discovery, and social sharing.

## 🚀 Setup Requirements

### 1. Database (Supabase)
Run the following SQL in your Supabase SQL Editor to prepare your tables.

```sql
-- Links Table (Main Hub)
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    domain TEXT,
    title TEXT,
    description TEXT,
    summary TEXT,
    hashtags TEXT[],
    image_url TEXT,
    content_images JSONB DEFAULT '[]'::jsonb,
    callout_stats JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Active for discovery/ingestion flows
CREATE TABLE pending_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. 🔐 Security (Row Level Security)
Since the app uses the **Anon Key**, you must enable RLS and add policies so the backend can read/write data.

```sql
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_selections ENABLE ROW LEVEL SECURITY;

-- Allow anyone with the anon key to read and insert
CREATE POLICY "Enable access for anon" ON links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable access for anon" ON pending_selections FOR ALL USING (true) WITH CHECK (true);
```

### 3. Environment Variables (.env)
Create a `.env` in the `backend/` directory:
```env
GEMINI_API_KEY=your_google_ai_key
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_public_key
TELEGRAM_BOT_TOKEN=your_bot_token
ADMIN_TELEGRAM_ID=your_id
```

---

## 🛠️ Integration Points

### A. Vertical-Specific Search
The framework supports 4 industry verticals: `Education`, `Health care`, `AI`, and `Jobs`. 

**API Usage:**
- `POST /api/discover`: Body `{ "query": "latest news", "vertical": "AI" }`
- `POST /api/links`: Body `{ "url": "article_url", "vertical": "Education" }`

### B. Mobile & Network Testing
To test the app on mobile devices within the same network:
1.  Find your computer's IP (e.g., `192.168.0.23`).
2.  **Backend**: Start with `python -m uvicorn main:app --host 0.0.0.0 --port 8000`.
3.  **Frontend**: Create `.env.local` with `VITE_API_URL=http://your_ip:8000`.
4.  **Access**: Open `http://your_ip:5173` on your mobile browser.

### C. Frontend Component Usage
Copy `ContentCard.jsx` and the relevant CSS to your project. Use it as:
```jsx
// Includes built-in X, LinkedIn, and Instagram sharing
<ContentCard card={articleData} />
```

---

## 💡 Best Practices
- **Styling**: Override global colors in `index.css` (e.g., `--accent-cyan`, `--bg-glass`) to match your brand.
- **AI Tiers**: If using Gemini Free Tier, handle `429` errors in your frontend fetch logic.
- **Scraping**: `scraper.py` includes a DuckDuckGo fallback if a direct scrape is blocked by anti-bot measures.
