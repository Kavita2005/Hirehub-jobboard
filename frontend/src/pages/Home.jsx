import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { label: 'Jobs Posted', value: '1,200+' },
  { label: 'Companies', value: '340+' },
  { label: 'Hires Made', value: '890+' },
];

const CATEGORIES = [
  { icon: '⚙️', name: 'Engineering', color: '#6c63ff' },
  { icon: '🎨', name: 'Design', color: '#a78bfa' },
  { icon: '📣', name: 'Marketing', color: '#38bdf8' },
  { icon: '📊', name: 'Data', color: '#34d399' },
  { icon: '🚀', name: 'Product', color: '#fb923c' },
  { icon: '💼', name: 'Sales', color: '#f472b6' },
  { icon: '👥', name: 'HR', color: '#facc15' },
  { icon: '💰', name: 'Finance', color: '#4ade80' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="pulse-dot" />
            <span>Jobs available right now</span>
          </div>
          <h1 className="hero-title">
            Find Your Next<br />
            <span className="gradient-text">Dream Role</span>
          </h1>
          <p className="hero-sub">
            Discover opportunities at top companies. No noise, just quality jobs curated for developers, designers, and builders.
          </p>

          <form onSubmit={handleSearch} className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for jobs, companies, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="hero-stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/jobs?category=${cat.name}`}
                className="cat-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container cta-inner">
            <div>
              <h2 className="cta-title">Ready to hire great talent?</h2>
              <p className="cta-sub">Post your job and reach thousands of qualified candidates today.</p>
            </div>
            <div className="cta-actions">
              <Link to="/signup?role=employer" className="btn btn-primary btn-lg">Post a Job →</Link>
              <Link to="/jobs" className="btn btn-secondary btn-lg">Browse Jobs</Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .home { min-height: 100vh; }
        .hero { position: relative; overflow: hidden; padding: 100px 0 80px; }
        .hero-glow {
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content { position: relative; z-index: 1; text-align: center; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.25);
          border-radius: 100px; padding: 6px 16px; margin-bottom: 24px;
          font-size: 13px; color: var(--accent2); font-family: var(--font-display);
        }
        .pulse-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--green);
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        .hero-title {
          font-family: var(--font-display); font-size: clamp(48px, 7vw, 80px);
          font-weight: 800; line-height: 1.1; letter-spacing: -2px; margin-bottom: 20px;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub { font-size: 18px; color: var(--text2); max-width: 520px; margin: 0 auto 40px; line-height: 1.7; }
        .search-bar {
          display: flex; align-items: center; gap: 12px; max-width: 600px; margin: 0 auto 48px;
          background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg);
          padding: 8px 8px 8px 16px;
        }
        .search-bar:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(108,99,255,0.1); }
        .search-icon { font-size: 16px; flex-shrink: 0; }
        .search-input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-size: 15px; font-family: var(--font-body); }
        .search-input::placeholder { color: var(--text3); }
        .hero-stats { display: flex; justify-content: center; gap: 48px; }
        .stat { text-align: center; }
        .stat-value { display: block; font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--text); }
        .stat-label { font-size: 13px; color: var(--text3); }
        .categories-section { padding: 80px 0; background: var(--bg2); }
        .section-title { font-family: var(--font-display); font-size: 28px; font-weight: 700; margin-bottom: 32px; text-align: center; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }
        .cat-card {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 24px 16px; background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); transition: all 0.2s;
          text-align: center;
        }
        .cat-card:hover {
          border-color: var(--cat-color, var(--accent));
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .cat-icon { font-size: 28px; }
        .cat-name { font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--text2); }
        .cat-card:hover .cat-name { color: var(--cat-color, var(--accent2)); }
        .cta-section { padding: 80px 0; background: linear-gradient(135deg, rgba(108,99,255,0.08), rgba(167,139,250,0.05)); border-top: 1px solid var(--border); }
        .cta-inner { display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
        .cta-title { font-family: var(--font-display); font-size: 32px; font-weight: 800; margin-bottom: 8px; }
        .cta-sub { color: var(--text2); font-size: 16px; }
        .cta-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .hero { padding: 60px 0 50px; }
          .hero-stats { gap: 24px; }
          .search-bar { flex-direction: column; padding: 16px; }
          .search-input { width: 100%; }
          .cta-inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
