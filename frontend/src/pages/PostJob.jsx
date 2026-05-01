import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Product', 'Data', 'Other'];

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    category: 'Engineering', description: '', requirements: '',
    salaryMin: '', salaryMax: '', applicationUrl: '',
  });

  if (user?.role !== 'employer') {
    return (
      <div className="empty-state" style={{ marginTop: 100 }}>
        <h3>Employers Only</h3>
        <p>Only employer accounts can post jobs.</p>
      </div>
    );
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      const { data } = await api.post('/jobs', payload);
      toast.success('Job posted successfully!');
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page page-enter">
      <div className="container">
        <div className="post-job-header">
          <h1 className="post-title">Post a Job</h1>
          <p className="post-sub">Fill in the details to reach qualified candidates</p>
        </div>

        {error && <div className="error-msg" style={{ maxWidth: 720, margin: '0 auto 20px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-section">
            <h2 className="form-section-title">Basic Info</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" placeholder="e.g. Senior React Developer" value={form.title} onChange={(e) => set('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Company *</label>
                <input className="form-input" placeholder="Company name" value={form.company} onChange={(e) => set('company', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" placeholder="e.g. Mumbai, India or Remote" value={form.location} onChange={(e) => set('location', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Application URL</label>
                <input className="form-input" placeholder="https://..." value={form.applicationUrl} onChange={(e) => set('applicationUrl', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Job Type & Category</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select className="form-input" value={form.type} onChange={(e) => set('type', e.target.value)}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Salary (Optional)</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Minimum (₹/year)</label>
                <input className="form-input" type="number" placeholder="e.g. 600000" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum (₹/year)</label>
                <input className="form-input" type="number" placeholder="e.g. 1200000" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Description & Requirements</h2>
            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                className="form-input"
                rows={6}
                placeholder="Describe the role, responsibilities, company culture..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Requirements</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Skills, qualifications, experience required..."
                value={form.requirements}
                onChange={(e) => set('requirements', e.target.value)}
              />
            </div>
          </div>

          <div className="submit-row">
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Posting...' : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .post-job-page { padding: 40px 0 80px; min-height: 80vh; }
        .post-job-header { text-align: center; margin-bottom: 40px; }
        .post-title { font-family: var(--font-display); font-size: 32px; font-weight: 800; }
        .post-sub { color: var(--text2); margin-top: 8px; }
        .post-form { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
        .form-section { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 20px; }
        .form-section-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .submit-row { display: flex; justify-content: flex-end; gap: 12px; padding-bottom: 20px; }
        @media (max-width: 600px) {
          .form-grid-2 { grid-template-columns: 1fr; }
          .submit-row { flex-direction: column-reverse; }
          .submit-row .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
