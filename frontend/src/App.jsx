import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LinkForm from './components/LinkForm';
import DiscoveryResults from './components/DiscoveryResults';
import ContentCard from './components/ContentCard';
import SharePage from './pages/SharePage';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__image" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line skeleton-card__line--title" />
        <div className="skeleton-card__line skeleton-card__line--text" />
        <div className="skeleton-card__line skeleton-card__line--text" />
        <div className="skeleton-card__line skeleton-card__line--short" />
      </div>
    </div>
  );
}

function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discoveryOptions, setDiscoveryOptions] = useState([]);

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/links`);
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleLinkAdded = () => {
    fetchCards();
    setDiscoveryOptions([]); // Clear results after success
  };

  const handleDiscovery = (options) => {
    setDiscoveryOptions(options);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/links/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="header__title">Vertical Pulse</h1>
        <p className="header__subtitle">
          Discover trending articles or publish directly — optimized for GenZ audiences
        </p>
      </header>

      {/* Link Submit Form - Now supports Discovery Mode */}
      <LinkForm onLinkAdded={handleLinkAdded} onDiscovery={handleDiscovery} />

      {/* Experimental Discovery Section */}
      {discoveryOptions.length > 0 && (
        <DiscoveryResults 
          options={discoveryOptions} 
          onPublished={handleLinkAdded}
          onDiscardAll={() => setDiscoveryOptions([])}
        />
      )}

      {/* Content Cards Section */}
      <section>
        <div className="section-header">
          <h2 className="section-header__title">
            📋 Published Content
          </h2>
          {cards.length > 0 && (
            <span className="section-header__count">
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="cards-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : cards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔗</div>
            <h3 className="empty-state__title">No content yet</h3>
            <p className="empty-state__subtitle">
              Paste a URL above to create your first content card
            </p>
          </div>
        ) : (
          <div className="cards-grid" id="cards-container">
            {cards.map((card, index) => (
              <ContentCard
                key={card.id}
                card={card}
                index={index}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/card/:id" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  );
}
