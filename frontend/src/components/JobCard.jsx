import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  'Full-time': 'badge-green',
  'Part-time': 'badge-blue',
  'Remote': 'badge-purple',
  'Contract': 'badge-orange',
  'Internship': 'badge-blue',
};

const CATEGORY_ICONS = {
  Engineering: '⚙️', Design: '🎨', Marketing: '📣', Sales: '💼',
  Finance: '📊', HR: '👥', Product: '🚀', Data: '📉', Other: '🔧',
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

export default function JobCard({ job, saved, onSave }) {
  const salary =
    job.salaryMin && job.salaryMax
      ? `₹${(job.salaryMin / 100000).toFixed(1)}L – ₹${(job.salaryMax / 100000).toFixed(1)}L`
      : job.salaryMin
      ? `₹${(job.salaryMin / 100000).toFixed(1)}L+`
      : null;

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div className="job-icon">{CATEGORY_ICONS[job.category] || '💼'}</div>
        <div className="job-meta-right">
          <span className={`badge ${TYPE_COLORS[job.type] || 'badge-blue'}`}>{job.type}</span>
          {onSave && (
            <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={() => onSave(job._id)} title={saved ? 'Unsave' : 'Save'}>
              {saved ? '♥' : '♡'}
            </button>
          )}
        </div>
      </div>

      <h3 className="job-title">
        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
      </h3>
      <p className="job-company">{job.company}</p>

      <div className="job-tags">
        <span className="job-tag">📍 {job.location}</span>
        {salary && <span className="job-tag">💰 {salary}</span>}
        <span className="job-tag">🏷 {job.category}</span>
      </div>

      <p className="job-desc">{job.description.substring(0, 120)}...</p>

      <div className="job-footer">
        <span className="job-time">{timeAgo(job.createdAt)}</span>
        <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-primary">View →</Link>
      </div>

      <style>{`
        .job-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: all 0.2s ease;
          display: flex; flex-direction: column; gap: 12px;
        }
        .job-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(108,99,255,0.12);
        }
        .job-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .job-icon { font-size: 28px; line-height: 1; }
        .job-meta-right { display: flex; align-items: center; gap: 8px; }
        .job-title { font-family: var(--font-display); font-size: 17px; font-weight: 700; line-height: 1.3; }
        .job-title a:hover { color: var(--accent2); }
        .job-company { font-size: 14px; color: var(--text2); font-weight: 500; }
        .job-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .job-tag { font-size: 12px; color: var(--text3); background: var(--bg3); border: 1px solid var(--border); padding: 3px 10px; border-radius: 100px; }
        .job-desc { font-size: 13px; color: var(--text2); line-height: 1.6; flex: 1; }
        .job-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
        .job-time { font-size: 12px; color: var(--text3); }
        .save-btn { background: none; border: none; font-size: 20px; color: var(--text3); transition: all 0.2s; padding: 2px; }
        .save-btn:hover, .save-btn.saved { color: #f87171; transform: scale(1.2); }
      `}</style>
    </div>
  );
}
