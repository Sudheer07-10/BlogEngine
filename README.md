# ⚡ Vertical Pulse

**Vertical Pulse** is a high-performance, AI-driven content ingestion and discovery engine designed for the modern web. It enables users to instantly scrape, summarize, and share trending articles across focused industry verticals like **AI, Healthcare, Education, and Jobs**.

Built with a sleek **GenZ aesthetic**, it features a premium glassmorphic UI, lightning-fast AI operations, and a robust Supabase backend.

---

## ✨ Key Features

- 🤖 **AI-First Summarization**: Leveraging Google Gemini to turn long articles into concise, 3-sentence "pulses".
- 🎯 **Industry Verticals**: Targeted discovery for Education, Health care, AI, and Jobs.
- 🔗 **Smart Ingestion**: Paste any URL or search a topic; the system scrapes, cleans, and summarizes it in seconds.
- 💎 **Premium UI**: Modern glassmorphic design system using Vanilla CSS for maximum performance and a high-end feel.
- 📱 **Mobile Optimized**: Fully responsive layout with built-in support for network-based mobile testing.
- 🔐 **Secure Backend**: Supabase integration with Row Level Security (RLS) for safe, public-facing interactions.
- 📤 **Social Sharing**: One-click sharing to X, LinkedIn, and Instagram with customized titles and summaries.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Vanilla CSS (Custom Design System)
- **Backend**: Python (FastAPI), Uvicorn
- **AI**: Google GenAI (Gemini Pro)
- **Database**: Supabase (Postgres + RLS)
- **Search**: DuckDuckGo Search API (DDGS)
- **Scraping**: curl_cffi, BeautifulSoup4

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Google Gemini API Key
- Supabase Project

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/your-username/vertical-pulse.git
   cd vertical-pulse
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Create a .env file based on the Team Integration Guide
   python -m uvicorn main:app --reload --host 0.0.0.0
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local for network usage
   npm run dev -- --host
   ```

---

## 📄 Documentation

For detailed information on how to integrate this framework into your project, check out the [Team Integration Guide](INTEGRATION_GUIDE.md).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*Built with ❤️ for the next generation of content creators.*
