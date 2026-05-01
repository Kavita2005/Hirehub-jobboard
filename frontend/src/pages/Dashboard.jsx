import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(user?.role === 'employer' ? 'posted' : 'saved');

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'employer') {
        const { data } = await api.get('/jobs/user/my-jobs');
        setMyJobs(data.jobs);
      } else {
        const { data } = await api.get('/auth/me');
        const savedIds = data.user.savedJobs || [];
        if (savedIds.length > 0) {
          const jobPromises = savedIds.map((id) => api.get(`/jobs/${id}`).catch(() => null));
          const results = await Promise.all(jobPromises);
          setSavedJobs(results.filter(Boolean).map((r) => r.data.job));
        }
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const handleUnsave = async (jobId) => {
    await api.post(`/jobs/${jobId}/save`);
    setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    toast.success('Job unsaved');
  };

  return (
    <div className="dashboard page-enter">
      <div className="container">
        {/* Profile Header */}
        <div className="dash-header">
          <div className="dash-avatar">{user?.name[0].toUpperCase()}</div>
          <div>
            <h1 className="dash-name">{user?.name}</h1>
            <p className="dash-email">{user?.email}</p>
            <span className={`badge ${user?.role === 'employer' ? 'badge-purple' : 'badge-green'}`}>
              {user?.role === 'employer' ? '🏢 Employer' : '🔍 Job Seeker'}
            </span>
          </div>
          {user?.role === 'employer' && (
            <Link to="/post-job" className="btn btn-primary" style={{ marginLeft: 'auto' }}>+ Post a Job</Link>
          )}
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {user?.role === 'employer' ? (
            <>
              <div className="stat-card">
                <span className="stat-n">{myJobs.length}</span>
                <span className="stat-l">Jobs Posted</span>
              </div>
              <div className="stat-card">
                <span className="stat-n">{myJobs.reduce((a, j) => a + (j.views || 0), 0)}</span>
                <span className="stat-l">Total Views</span>
              </div>
              <div className="stat-card">
                <span className="stat-n">{myJobs.filter((j) => j.isActive).length}</span>
                <span className="stat-l">Active Listings</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <span className="stat-n">{savedJobs.length}</span>
                <span className="stat-l">Saved Jobs</span>
              </div>
              <div className="stat-card">
                <Link to="/jobs" style={{ textDecoration: 'none' }}>
                  <span className="stat-n" style={{ color: 'var(--accent2)' }}>Browse</span>
                  <span className="stat-l">Find Jobs</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="dash-content">
          {loading ? (
            <div className="spinner" />
          ) : user?.role === 'employer' ? (
            <>
              <h2 className="dash-section-title">Your Job Listings</h2>
              {myJobs.length === 0 ? (
                <div className="empty-state">
                  <h3>No jobs posted yet</h3>
                  <p>Post your first job to start finding candidates</p>
                  <Link to="/post-job" className="btn btn-primary" style={{ marginTop: 16 }}>Post a Job</Link>
                </div>
              ) : (
                <div className="dash-grid">
                  {myJobs.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="dash-section-title">Saved Jobs</h2>
              {savedJobs.length === 0 ? (
                <div className="empty-state">
                  <h3>No saved jobs yet</h3>
                  <p>Browse jobs and click ♡ to save them here</p>
                  <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Jobs</Link>
                </div>
              ) : (
                <div className="dash-grid">
                  {savedJobs.map((job) => (
                    <JobCard key={job._id} job={job} saved={true} onSave={handleUnsave} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .dashboard { padding: 40px 0 80px; min-height: 80vh; }
        .dash-header { display: flex; align-items: center; gap: 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px; flex-wrap: wrap; }
        .dash-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 28px; font-weight: 800; flex-shrink: 0; }
        .dash-name { font-family: var(--font-display); font-size: 22px; font-weight: 800; }
        .dash-email { color: var(--text2); font-size: 14px; margin: 4px 0 8px; }
        .dash-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; text-align: center; }
        .stat-n { display: block; font-family: var(--font-display); font-size: 32px; font-weight: 800; color: var(--text); }
        .stat-l { font-size: 13px; color: var(--text3); margin-top: 4px; display: block; }
        .dash-section-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; margin-bottom: 20px; }
        .dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        @media (max-width: 600px) {
          .dash-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
