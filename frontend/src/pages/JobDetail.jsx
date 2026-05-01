import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => {
        setJob(data.job);
        if (user) {
          api.get('/auth/me').then(({ data: d }) => {
            setSaved(d.user.savedJobs?.includes(id));
          });
        }
      })
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!user) return toast.error('Please login to save jobs');
    const { data } = await api.post(`/jobs/${id}/save`);
    setSaved(data.saved);
    toast.success(data.saved ? 'Saved!' : 'Unsaved');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this job?')) return;
    setDeleting(true);
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!job) return <div className="empty-state"><h3>Job not found</h3><Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Jobs</Link></div>;

  const isOwner = user && job.postedBy?._id === user._id;
  const salary = job.salaryMin && job.salaryMax
    ? `₹${(job.salaryMin / 100000).toFixed(1)}L – ₹${(job.salaryMax / 100000).toFixed(1)}L/yr`
    : 'Not specified';

  return (
    <div className="job-detail page-enter">
      <div className="container">
        <Link to="/jobs" className="back-link">← Back to Jobs</Link>

        <div className="detail-layout">
          {/* Main Content */}
          <div className="detail-main">
            <div className="detail-header card">
              <div className="detail-title-row">
                <div>
                  <h1 className="detail-title">{job.title}</h1>
                  <p className="detail-company">{job.company}</p>
                </div>
                <div className="detail-actions">
                  {user && !isOwner && (
                    <button className={`btn btn-secondary ${saved ? 'saved-active' : ''}`} onClick={handleSave}>
                      {saved ? '♥ Saved' : '♡ Save'}
                    </button>
                  )}
                  {isOwner && (
                    <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                      {deleting ? 'Deleting...' : '🗑 Delete'}
                    </button>
                  )}
                </div>
              </div>

              <div className="detail-meta">
                <span className="meta-tag">📍 {job.location}</span>
                <span className="meta-tag">💼 {job.type}</span>
                <span className="meta-tag">🏷 {job.category}</span>
                <span className="meta-tag">💰 {salary}</span>
                <span className="meta-tag">👁 {job.views} views</span>
              </div>
            </div>

            <div className="card detail-section">
              <h2 className="section-h">About the Role</h2>
              <p className="detail-text">{job.description}</p>
            </div>

            {job.requirements && (
              <div className="card detail-section">
                <h2 className="section-h">Requirements</h2>
                <p className="detail-text">{job.requirements}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="card sidebar-card">
              <h3 className="sidebar-title">Apply Now</h3>
              {job.applicationUrl ? (
                <a href={job.applicationUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Apply on Company Site →
                </a>
              ) : (
                <p className="detail-text" style={{ fontSize: 13 }}>Contact the employer directly for application details.</p>
              )}
            </div>

            <div className="card sidebar-card">
              <h3 className="sidebar-title">Company Info</h3>
              <p className="sidebar-company">{job.company}</p>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
                Posted by {job.postedBy?.name}
              </p>
            </div>

            {!user && (
              <div className="card sidebar-card cta-card">
                <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 12 }}>Create an account to save jobs and track applications.</p>
                <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign Up Free</Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .job-detail { padding: 32px 0 80px; min-height: 80vh; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: var(--text3); margin-bottom: 24px; transition: color 0.15s; }
        .back-link:hover { color: var(--text); }
        .detail-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
        .detail-main { display: flex; flex-direction: column; gap: 16px; }
        .detail-header { display: flex; flex-direction: column; gap: 16px; }
        .detail-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
        .detail-title { font-family: var(--font-display); font-size: 28px; font-weight: 800; line-height: 1.2; }
        .detail-company { font-size: 16px; color: var(--text2); margin-top: 4px; font-weight: 500; }
        .detail-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .detail-meta { display: flex; flex-wrap: wrap; gap: 8px; }
        .meta-tag { font-size: 13px; background: var(--bg3); border: 1px solid var(--border); padding: 4px 12px; border-radius: 100px; color: var(--text2); }
        .detail-section { display: flex; flex-direction: column; gap: 12px; }
        .section-h { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
        .detail-text { font-size: 15px; color: var(--text2); line-height: 1.8; white-space: pre-wrap; }
        .detail-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
        .sidebar-card { display: flex; flex-direction: column; gap: 12px; }
        .sidebar-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; }
        .sidebar-company { font-size: 15px; font-weight: 600; color: var(--text); }
        .saved-active { color: #f87171!important; border-color: rgba(248,113,113,0.4)!important; }
        .cta-card { background: linear-gradient(135deg, rgba(108,99,255,0.1), rgba(167,139,250,0.06)); border-color: rgba(108,99,255,0.2)!important; }
        @media (max-width: 800px) {
          .detail-layout { grid-template-columns: 1fr; }
          .detail-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
}
