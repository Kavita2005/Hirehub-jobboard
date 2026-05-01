import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">⬡</span>
          <span>HireHub</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {user ? (
            <>
              {user.role === 'employer' && (
                <Link to="/post-job" className={`nav-link ${isActive('/post-job') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Post a Job</Link>
              )}
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <div className="nav-user">
                <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(10,10,15,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-size: 20px; font-weight: 800;
          color: var(--text); letter-spacing: -0.5px;
        }
        .logo-icon { color: var(--accent); font-size: 22px; }
        .nav-links {
          display: flex; align-items: center; gap: 8px;
        }
        .nav-link {
          font-family: var(--font-display); font-size: 14px; font-weight: 500;
          color: var(--text2); padding: 6px 12px; border-radius: 8px;
          transition: all var(--transition);
        }
        .nav-link:hover, .nav-link.active { color: var(--text); background: var(--card); }
        .nav-link.active { color: var(--accent2); }
        .nav-user { display: flex; align-items: center; gap: 8px; padding: 0 8px; }
        .user-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 700; font-size: 13px;
        }
        .user-name { font-size: 13px; color: var(--text2); font-weight: 500; }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: 4px; }
        .hamburger span { width: 22px; height: 2px; background: var(--text2); border-radius: 2px; display: block; transition: all var(--transition); }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .nav-links {
            display: none; position: absolute; top: 64px; left: 0; right: 0;
            flex-direction: column; background: var(--bg2);
            border-bottom: 1px solid var(--border); padding: 16px; gap: 4px;
          }
          .nav-links.open { display: flex; }
          .nav-link { padding: 10px 16px; width: 100%; }
          .nav-user { padding: 8px 16px; }
        }
      `}</style>
    </nav>
  );
}
