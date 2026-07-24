import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRupeeSign, FaExternalLinkAlt, FaUser, FaGraduationCap,
  FaComment, FaStar, FaClock, FaLink, FaTimes, FaEye,
} from 'react-icons/fa';
import API from '../config';
import { getToken } from '../utils/auth';
import './BusinessDashboard.css';

const API_BASE = API || 'https://i-cockroach.onrender.com';

const CATEGORY_LABELS = {
  'Social Media': 'Social Media',
  Branding: 'Branding',
  'Video Editing': 'Video/Editing',
  'Growth Outreach': 'Growth/Outreach',
  'Automation Tech': 'Automation/Tech',
  'Research Ops': 'Research/Ops',
};

const getLoggedInUser = () => {
  try {
    const raw = localStorage.getItem('icockroach_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function BusinessDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingPitches, setLoadingPitches] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loggedInUser = getLoggedInUser();

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setError('');
      try {
        const { data } = await axios.get(`${API_BASE}/api/jobs`);
        if (!isMounted) return;
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Failed to load jobs.');
        setJobs([]);
      } finally {
        if (isMounted) setLoadingJobs(false);
      }
    };
    fetchJobs();
    return () => { isMounted = false; };
  }, []);

  const fetchPitches = async (job) => {
    try {
      setLoadingPitches(true);
      setError('');
      const { data } = await axios.get(`${API_BASE}/api/pitches/job/${job._id}`);
      setPitches(Array.isArray(data) ? data : []);
      setSelectedJob(job);
      setSuccessMsg('');
    } catch (err) {
      setPitches([]);
      setError(err.response?.data?.message || 'Failed to load pitches.');
    } finally {
      setLoadingPitches(false);
    }
  };

  const closePitches = () => {
    setSelectedJob(null);
    setPitches([]);
    setSuccessMsg('');
    setError('');
  };

  // Ownership uses job.ownerId (Job model field) vs logged-in user id
  const isJobOwner = (job) => {
    if (!loggedInUser || !job) return false;
    const userId = String(loggedInUser._id || loggedInUser.id || '').trim();
    if (!userId) return false;

    const ownerId = job.ownerId != null ? String(job.ownerId).trim() : '';
    if (!ownerId) return false;

    return ownerId === userId;
  };

  const handleAccept = async (pitchId) => {
    if (!selectedJob) return;
    if (!isJobOwner(selectedJob)) {
      setError('❌ You can only accept pitches for your own jobs!');
      return;
    }
    try {
      setActionLoading(pitchId);
      setSuccessMsg('');
      const token = getToken();
      const { data } = await axios.patch(
        `${API_BASE}/api/pitches/${pitchId}/accept`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setPitches(data.pitches || []);
      setJobs(prev => prev.map(j =>
        j._id === selectedJob._id ? { ...j, status: 'In Progress' } : j
      ));
      setSelectedJob(prev => prev ? { ...prev, status: 'In Progress' } : prev);
      setSuccessMsg('✅ Pitch Accepted! Job is now In Progress');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept pitch.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (pitchId) => {
    if (!selectedJob) return;
    if (!isJobOwner(selectedJob)) {
      setError('❌ You can only reject pitches for your own jobs!');
      return;
    }
    try {
      setActionLoading(pitchId);
      const token = getToken();
      const { data } = await axios.patch(
        `${API_BASE}/api/pitches/${pitchId}/reject`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setPitches(prev => prev.map(p => p._id === pitchId ? data : p));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject pitch.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatMoney = (n) => Number(n || 0).toLocaleString('en-IN');

  const getStatusClass = (status) => {
    if (status === 'Open') return 'status-open';
    if (status === 'In Progress') return 'status-progress';
    if (status === 'Completed') return 'status-completed';
    return 'status-default';
  };

  const renderJobCard = (job, i) => {
    const catLabel = CATEGORY_LABELS[job.category] || job.category || 'General';
    const owned = isJobOwner(job);

    return (
      <motion.article
        key={job._id}
        className="job-card"
        style={{ position: 'relative' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.06, duration: 0.45 }}
        whileHover={{ y: -4 }}
      >
        {owned && (
          <div style={{
            position:'absolute', top:'-10px', right:'10px',
            background:'#FF6B00', color:'white', padding:'3px 10px',
            borderRadius:'20px', fontSize:'11px', fontWeight:'bold',
            zIndex: 1
          }}>
            YOUR JOB ✓
          </div>
        )}
        <div className="job-card-header">
          <span className="category-badge">{catLabel}</span>
          <span className={`status-badge ${getStatusClass(job.status)}`}>
            {job.status || 'Open'}
          </span>
        </div>
        <h3 className="job-title">{job.title}</h3>
        <p style={{color:'#888',fontSize:'12px',margin:'4px 0 8px 0'}}>
          Posted by: {job.postedBy}
        </p>
        <p className="job-budget"><FaRupeeSign /> ₹{formatMoney(job.budget)}</p>
        <button
          type="button"
          className="btn-view-pitches"
          onClick={() => fetchPitches(job)}
        >
          <FaEye /> View Pitches 👁️
        </button>
        {!owned && (
          <p style={{color:'#666',fontSize:'11px',marginTop:'6px',textAlign:'center'}}>
            👁️ View only — not your job
          </p>
        )}
      </motion.article>
    );
  };

  return (
    <div className="business-dashboard">
      <motion.header
        className="biz-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <h1>Business Dashboard 🏢</h1>
        <p>Review pitches and manage your jobs</p>
        {loggedInUser && (
          <p style={{color:'#FF6B00',marginTop:'8px',fontWeight:'bold',fontSize:'14px'}}>
            Logged in as: {loggedInUser.name || loggedInUser.businessName} | ID: {loggedInUser._id || loggedInUser.id}
          </p>
        )}
      </motion.header>

      {error && (
        <motion.div
          className="biz-alert biz-alert-error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>{error}</span>
          <button type="button" onClick={() => setError('')}><FaTimes /></button>
        </motion.div>
      )}

      <section className="biz-jobs-section">
        <h2 className="section-heading">All Jobs</h2>
        {loadingJobs && (
          <div className="biz-loading">
            <span className="biz-spinner" />
            <p>Loading jobs...</p>
          </div>
        )}
        <div className="jobs-grid">
          {jobs.map((job, i) => renderJobCard(job, i))}
        </div>
        {!loadingJobs && jobs.length === 0 && (
          <motion.div className="biz-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>No jobs posted yet.</p>
            <Link to="/post-job" className="btn-orange">Post a Job →</Link>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePitches}
            />
            <div className="modal-wrapper">
              <motion.div
                className="pitches-modal"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              >
                <div className="modal-header">
                  <div>
                    <h2>Pitches for</h2>
                    <p className="modal-job-title">{selectedJob.title}</p>
                    {isJobOwner(selectedJob) ? (
                      <span style={{color:'#FF6B00',fontSize:'13px',fontWeight:'bold'}}>
                        ✅ This is your job - manage pitches below
                      </span>
                    ) : (
                      <span style={{color:'#888',fontSize:'13px'}}>
                        🔒 Only the original job poster can manage these pitches
                      </span>
                    )}
                  </div>
                  <button type="button" className="modal-close" onClick={closePitches}>
                    <FaTimes />
                  </button>
                </div>

                <AnimatePresence>
                  {successMsg && (
                    <motion.div
                      className="biz-success-banner"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {loadingPitches ? (
                  <div className="biz-loading modal-loading">
                    <span className="biz-spinner" />
                    <p>Loading pitches...</p>
                  </div>
                ) : pitches.length === 0 ? (
                  <div className="biz-empty modal-empty">
                    <p>No pitches yet for this job.</p>
                  </div>
                ) : (
                  <div className="pitches-scroll">
                    {pitches.map((pitch, i) => (
                      <motion.div
                        key={pitch._id}
                        className={`pitch-card pitch-${pitch.status?.toLowerCase()}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="pitch-row">
                          <FaUser className="pitch-icon" />
                          <div>
                            <span className="pitch-label">Student</span>
                            <strong>{pitch.studentName}</strong>
                          </div>
                          <span className={`pitch-tag tag-${pitch.status?.toLowerCase()}`}>
                            {pitch.status}
                          </span>
                        </div>
                        <div className="pitch-row">
                          <FaGraduationCap className="pitch-icon" />
                          <div>
                            <span className="pitch-label">College</span>
                            <p>{pitch.college}</p>
                          </div>
                        </div>
                        <div className="pitch-row block">
                          <FaComment className="pitch-icon" />
                          <div>
                            <span className="pitch-label">Intro</span>
                            <p>{pitch.intro}</p>
                          </div>
                        </div>
                        <div className="pitch-row block">
                          <FaStar className="pitch-icon" />
                          <div>
                            <span className="pitch-label">Why Me</span>
                            <p>{pitch.whyMe}</p>
                          </div>
                        </div>
                        <div className="pitch-meta-grid">
                          <div className="pitch-meta">
                            <span className="pitch-label">💰 Their Price</span>
                            <strong className="price-text">₹{formatMoney(pitch.cost)}</strong>
                          </div>
                          <div className="pitch-meta">
                            <span className="pitch-label"><FaClock /> Timeline</span>
                            <strong>{pitch.timeline} days</strong>
                          </div>
                        </div>
                        {pitch.portfolioLink && (
                          <a href={pitch.portfolioLink} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                            <FaLink /> Portfolio <FaExternalLinkAlt />
                          </a>
                        )}

                        {/* ✅ FIXED: Show accept/reject only to job owner, only for pending pitches */}
                        {pitch.status === 'Pending' && isJobOwner(selectedJob) && (
                          <div className="pitch-actions">
                            <button
                              type="button"
                              className="btn-accept"
                              disabled={!!actionLoading}
                              onClick={() => handleAccept(pitch._id)}
                            >
                              {actionLoading === pitch._id ? 'Accepting...' : '✅ Accept'}
                            </button>
                            <button
                              type="button"
                              className="btn-reject"
                              disabled={!!actionLoading}
                              onClick={() => handleReject(pitch._id)}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        {pitch.status === 'Pending' && !isJobOwner(selectedJob) && (
                          <p style={{color:'#888',fontSize:'12px',textAlign:'center',marginTop:'10px'}}>
                            🔒 Only the original job poster can manage these pitches
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BusinessDashboard;
