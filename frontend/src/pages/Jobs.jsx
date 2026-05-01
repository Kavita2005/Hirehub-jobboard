import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../hooks/useApi';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Product', 'Data', 'Other'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/auth/me');
      setSavedJobs(data.user.savedJobs || []);
    } catch {}
  };

  useEffect(() => { fetchJobs(); }, [page, filters]);
  useEffect(() => { fetchSaved(); }, [user]);

  const handleFilterChange = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleSave = async (jobId) => {
    if (!user) return toast.error('Login to save jobs');
    try {
      const { data } = await api.post(`/jobs/${jobId}/save`);
      setSavedJobs(data.savedJobs);
      toast.success(data.saved ? 'Job saved!' : 'Job unsaved');
    } catch {
      toast.error('Failed to save job');
    }
  };

  const pages = Math.ceil(total / 9);

  return (
    <div className="jobs-page page-enter">
      <div className="container">
        <div className="jobs-header">
          <div>
            <h1 className="jobs-title">Browse Jobs</h1>
            <p className="jobs-sub">{total} opportunities available</p>
          </div>
          <form onSubmit={handleSearch} className="jobs-search">
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="jobs-layout">
          {/* Sidebar Filters */}
          <aside className="filters-panel">
            <h3 className="filter-heading">Filters</h3>

            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="City or remote..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Job Type</label>
              <div className="filter-options">
                {['', ...TYPES].map((t) => (
                  <button
                    key={t}
                    className={`filter-chip ${filters.type === t ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', t)}
                  >
                    {t || 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-options">
                {['', ...CATEGORIES].map((c) => (
                  <button
                    key={c}
                    className={`filter-chip ${filters.category === c ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', c)}
                  >
                    {c || 'All'}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => { setFilters({ search: '', type: '', category: '', location: '' }); setPage(1); }}
            >
              Clear Filters
            </button>
          </aside>

          {/* Job Grid */}
          <main className="jobs-main">
            {loading ? (
              <div className="spinner" />
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      saved={savedJobs.includes(job._id)}
                      onSave={handleSave}
                    />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="pagination">
                    <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span className="page-info">Page {page} of {pages}</span>
                    <button className="btn btn-secondary btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .jobs-page { padding: 40px 0 80px; min-height: 80vh; }
        .jobs-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; gap: 20px; flex-wrap: wrap; }
        .jobs-title { font-family: var(--font-display); font-size: 32px; font-weight: 800; }
        .jobs-sub { color: var(--text3); font-size: 14px; margin-top: 4px; }
        .jobs-search { display: flex; gap: 8px; }
        .jobs-search .form-input { width: 240px; }
        .jobs-layout { display: grid; grid-template-columns: 260px 1fr; gap: 28px; align-items: start; }
        .filters-panel { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; position: sticky; top: 80px; }
        .filter-heading { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 20px; }
        .filter-group { margin-bottom: 20px; }
        .filter-label { display: block; font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-family: var(--font-display); }
        .filter-options { display: flex; flex-wrap: wrap; gap: 6px; }
        .filter-chip { padding: 4px 10px; border-radius: 100px; font-size: 12px; background: var(--bg3); border: 1px solid var(--border); color: var(--text2); transition: all 0.15s; }
        .filter-chip:hover, .filter-chip.active { background: rgba(108,99,255,0.15); border-color: var(--accent); color: var(--accent2); }
        .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 32px; }
        .page-info { font-size: 13px; color: var(--text2); font-family: var(--font-display); }
        @media (max-width: 900px) {
          .jobs-layout { grid-template-columns: 1fr; }
          .filters-panel { position: static; }
          .jobs-search .form-input { width: 180px; }
        }
        @media (max-width: 600px) {
          .jobs-header { flex-direction: column; align-items: flex-start; }
          .jobs-search { width: 100%; }
          .jobs-search .form-input { flex: 1; }
        }
      `}</style>
    </div>
  );
}
