# Traffic Content System — Implementation Plan

A web application that lets anyone paste a link, automatically extracts the **title**, **hashtags**, and **content**, summarizes it into a short crisp snippet, and publishes it as a beautiful content card. Each card shows hashtags, the summary, and a "Read More" link to the original article.

## Architecture

```
┌───────────────────────┐       ┌──────────────────────────────┐
│   React Frontend      │──────▶│   FastAPI Backend             │
│   (Vite)              │◀──────│                               │
│                       │       │  POST /api/links  → ingest    │
│  • Link submit form   │       │  GET  /api/links  → list all  │
│  • Content card grid  │       │                               │
│  • Dark mode + glass  │       │  Scraper: requests + BS4      │
│                       │       │  Summarizer: extractive NLP   │
│                       │       │  Store: JSON file (simple)    │
└───────────────────────┘       └──────────────────────────────┘
```

**Tech Stack:**

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React + Vanilla CSS |
| Backend | Python FastAPI |
| Scraping | `requests` + `BeautifulSoup4` |
| Summarization | Extractive (no API keys needed) — top sentences by TF-IDF scoring |
| Storage | JSON file (`data/links.json`) |

---

## Proposed Changes

### Backend — `backend/`

#### `main.py`
- FastAPI app with CORS enabled
- **`POST /api/links`** — accepts `{ "url": "..." }`, scrapes the page, extracts title + meta description + hashtags, summarizes body text into 2-3 sentences, stores everything, returns the card object
- **`GET /api/links`** — returns all stored content cards as JSON array

#### `scraper.py`
- `scrape_url(url)` → returns `{ title, description, body_text, hashtags, image_url }`
- Uses `requests` + `BeautifulSoup4`
- Extracts: `<title>`, `og:title`, `og:description`, `og:image`, `meta[name=keywords]`, plus any `#hashtag` patterns found in the text

#### `summarizer.py`
- `summarize(text, max_sentences=3)` → returns a short string
- Extractive approach: sentence tokenization → TF-IDF scoring → pick top N sentences
- No external API keys needed

#### `store.py`
- Simple JSON-file-based store (`data/links.json`)
- `save_link(card_data)`, `get_all_links()`, `delete_link(id)`

#### `requirements.txt`
- `fastapi`, `uvicorn`, `requests`, `beautifulsoup4`, `lxml`

---

### Frontend — `frontend/`

#### Vite + React scaffold
- Created via `npx -y create-vite@latest ./ --template react`

#### `App.jsx`
- Two sections: **Link Submission** form + **Content Cards** gallery
- Fetches cards from `GET /api/links` on mount and after each submission

#### `components/LinkForm.jsx`
- Single URL input + "Publish" button
- Calls `POST /api/links` and triggers refresh

#### `components/ContentCard.jsx`
- Displays: title, hashtag pills, 2-3 sentence summary, thumbnail image (if available), "Read More →" link
- Glassmorphic card design, hover lift animation

#### `index.css`
- Dark theme with gradient background
- Glassmorphism cards (backdrop-filter, semi-transparent backgrounds)
- Hashtag pill styling (vibrant gradient pills)
- Micro-animations: card hover lift, button pulse, skeleton loading

---

## Design Aesthetic

- **Dark mode** base (`#0a0a1a` → `#1a1a2e` gradient)
- **Glassmorphic cards** with backdrop blur + subtle borders
- **Gradient hashtag pills** (cyan → purple)
- **Hover animations** — cards lift with shadow expansion
- **Typography** — Inter font from Google Fonts
- **Responsive** — 1-3 column grid depending on screen size

---

## Verification Plan

### Automated Tests (via curl)
1. Start backend: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000`
2. Submit a link: `curl -X POST http://localhost:8000/api/links -H "Content-Type: application/json" -d "{\"url\": \"https://example.com\"}"` — should return JSON with `title`, `summary`, `hashtags`
3. List all links: `curl http://localhost:8000/api/links` — should return an array with the submitted link

### Browser Verification
1. Start frontend: `cd frontend && npm install && npm run dev`
2. Open `http://localhost:5173` in the browser
3. Paste a URL (e.g. a Wikipedia or news article link) into the form and click "Publish"
4. Verify that a content card appears with: title, hashtags, short summary, and a "Read More" link
5. Click "Read More" — should open the original article in a new tab
