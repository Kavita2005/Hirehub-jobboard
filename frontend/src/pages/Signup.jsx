import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'jobseeker',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.token, data.user);
      toast.success(`Welcome to HireHub, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-logo">⬡ HireHub</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start your journey today</p>

        {error && <div className="error-msg">{error}</div>}

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${form.role === 'jobseeker' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'jobseeker' })}
          >
            🔍 Job Seeker
          </button>
          <button
            type="button"
            className={`role-btn ${form.role === 'employer' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'employer' })}
          >
            🏢 Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: 90vh; display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
        .auth-card { width: 100%; max-width: 420px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 40px 36px; display: flex; flex-direction: column; gap: 20px; }
        .auth-logo { font-family: var(--font-display); font-size: 18px; font-weight: 800; color: var(--accent2); text-align: center; }
        .auth-title { font-family: var(--font-display); font-size: 26px; font-weight: 800; text-align: center; }
        .auth-sub { text-align: center; color: var(--text2); font-size: 14px; margin-top: -12px; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-footer { text-align: center; font-size: 14px; color: var(--text2); }
        .auth-footer a { color: var(--accent2); font-weight: 600; }
        .auth-footer a:hover { text-decoration: underline; }
        .role-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: var(--bg3); padding: 4px; border-radius: var(--radius); }
        .role-btn { padding: 8px; border-radius: 8px; border: none; background: transparent; color: var(--text2); font-size: 13px; font-family: var(--font-display); font-weight: 600; transition: all 0.15s; }
        .role-btn.active { background: var(--card); color: var(--text); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}
