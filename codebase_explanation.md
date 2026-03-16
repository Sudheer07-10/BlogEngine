# Traffic Content Hub: Complete Codebase Architecture & Data Flow

This document explains the step-by-step data flow of the entire application, detailing how a user-submitted URL is processed, scraped, summarized by AI, and finally rendered as a minimalist, readable "Share Page" with infographics and statistics.

## High-Level Architecture
The project is split into two main parts:
1. **Frontend (React + Vite)**: The user interface where you paste links and view the formatted "Content Cards" and the "Share Page".
2. **Backend (Python + FastAPI)**: The engine that receives the link, downloads the webpage, extracts the data, uses AI to summarize it, and sends it back to the frontend.

---

## 🚀 The Data Flow

### Step 1: The User Submits a Link (Frontend)
When someone pastes a URL (like a Wikipedia article) into the main input bar and clicks "Publish":
- The `LinkForm.jsx` React component captures the URL from the input field.
- It immediately sends an HTTP `POST` request to your FastAPI backend at the `/api/submit-link` endpoint, securely passing the URL in the request body.

### Step 2: The Backend Receives the Request (`backend/main.py`)
- The FastAPI application running via Uvicorn intercepts this request in the `submit_link` function.
- It immediately passes the URL to your custom Python web scraping engine logic.

### Step 3: Scraping & Extracting Base Data (`backend/scraper.py`)
The `scrape_url` function is the core of your data extraction pipeline. It executes the following tasks:
- **Fetching HTML**: It uses the Python `requests` library to securely download the raw HTML source code of the webpage.
- **Parsing Data**: It initializes `BeautifulSoup` to traverse the HTML structure and find specific semantic elements:
  - **Title**: Locates the `<title>` tag or OpenGraph title tags (used for social sharing previews).
  - **Hero Image (`image_url`)**: Searches for the `og:image` meta tag (the main header image seen when sharing a link on platforms like Twitter or iMessage).
  - **Text Body**: It crawls through the document looking for `<p>` (paragraph) tags inside the main `<article>` or `<body>` elements to aggregate the actual reading text, ensuring proper spacing between paragraphs.
  - **Hashtags**: Analyzes the meta `keywords` tags in the HTML `<head>` and converts them into a clean array of hashtags.

### Step 4: Extracting "The Curious Plot" (Images & Stats)
While processing the HTML in `scraper.py`, two specialized functions are executed to gather media for the infographic layout:
- **`_extract_body_images`**: It crawls through the HTML `<img>` tags. To discard tiny tracking pixels, icons, or logos, it specifically checks the width/height rules (ignoring images smaller than certain dimensions). It ultimately grabs up to 3 large, relevant images embedded within the article text. These are assigned to `content_images`.
- **`_extract_highlights`**: It reads every single sentence from the extracted text block and applies **Regex (Regular Expressions)** to identify sentences containing strict mathematical numbers, percentages (`%`), or currency symbols (`$`, `€`, `£`). It curates the first 3 interesting statistical sentences to serve as callouts. These are assigned to `callout_stats`.

### Step 5: AI Summarization (HuggingFace Transformers)
At the conclusion of data scraping, `scraper.py` feeds the massive, unformatted block of aggregated text into a pre-trained AI NLP model (`facebook/bart-large-cnn`) running locally within your backend environment.
- The AI algorithm processes the longform text, comprehends the context, and condenses it into a short, crisp plot/snippet (strictly limited to a maximum of 130 words).
- This curated AI response is returned as the `summary`.

### Step 6: Packaging & Saving the Data
The backend aggregates the Title, Summary, Hashtags, Hero Image, Content Images, and Callout Stats into a structured Pydantic model called a `ContentCard`. It temporarily saves this record in the backend's in-memory database dictionary, and then transmits the finalized JSON object back to the React Frontend.

---

## 🎨 Rendering the User Interface (Frontend)

### Step 1: The Home Page (`frontend/src/App.jsx` + `ContentCard.jsx`)
- The React Frontend receives the finalized `ContentCard` JSON object from the backend API response and pushes it to the generic array of `Published Content`.
- The screen redraws to render a smaller preview of the card using the `ContentCard` component, displaying just the core metadata: Title, Source Domain, AI Summary snippet, Hero Image overlay, and Hashtag badges.
- Clicking anywhere on this card triggers React Router to intercept the click and dynamically navigate the user to the dedicated read route: `/card/<id>`.

### Step 2: The Share Page (`frontend/src/pages/SharePage.jsx`)
Upon navigating to the Share Page, the React component reads the dynamic `id` from the URL, fetches the exact article stored in memory, and renders it through the **Minimalist Light Theme** layout (designed via `index.css`).

Here is a breakdown of how the UI pieces are mapped to the scraped Python data:

- **Top Navigation Bar**: Features a "← Back" button and a "🔗 Share" button. The Share button leverages the browser's native `navigator.clipboard` API to silently copy the current page URL, allowing the user to seamlessly share it with others.
- **Document Header**: Displays the source Domain, followed by a dot separator, and the formatted ingestion date. Directly beneath, it renders the scraped `title` as a massive, serif `<h1 className="share-card__title">`, emulating a digital broadsheet newspaper.
- **Hero Graphic (`image_url`)**: If the scraper successfully located an OpenGraph image, it renders it with subtle curved borders (`share-card__hero-img`) above the text.
- **The Text Body (`summary`)**: The crisp AI-generated summary is injected into the DOM. The Javascript splits the string by newline characters (`\n`) to ensure it forms readable HTML paragraphs (`<p>`) rather than a single impenetrable block of text.
- **The Visuals & Stats (Curious Plot)**:
  - The map loop iterates through the `callout_stats` array (the regex-extracted sentences containing percentages/numbers) and renders them inside highlighted `<div className="share-card__stat-block">` boxes. These are styled with a stark, thick left border to emulate professional pull-quotes.
  - The map loop simultaneously iterates through the `content_images` array (the extra images scraped from the article HTML body) and injects them side-by-side naturally as large, responsive visuals (`share-card__info-img`).
- **Metadata Badges**: Iterates through the `hashtags` array and renders them as simple, minimalist pill-shaped badges at the base of the article.
- **Call To Action (CTA)**: Finally, it anchors the page with the original URL submitted in Step 1, rendering a "Read Original →" hyperlinked button positioned at the bottom right, intentionally routing engaged readers to the full source article.

By combining Python's powerful BeautifulSoup scraping heuristics and local AI transformers with React's dynamic structural UI rendering, this pipeline automatically ingests raw articles and refines them into premium, high-readability minimalist content cards.
