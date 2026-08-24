import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config';

export default function AdminPanel() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('icockroach_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.userType !== 'Admin') {
      alert('Access Denied. Admins only.');
      navigate('/');
      return;
    }
    fetchJobs();
  }, [navigate]);

  const getToken = () => localStorage.getItem('icockroach_token');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/jobs`);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to CANCEL this job?')) return;
    try {
      await axios.patch(`${API}/api/jobs/${jobId}/status`, { status: 'Closed' }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: 'Closed' } : j));
      alert('✅ Job cancelled successfully!');
    } catch (err) {
      console.error('Cancel error:', err.response?.data || err.message);
      alert(`Failed to cancel job: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('PERMANENTLY DELETE this job? Cannot be undone!')) return;
    try {
      await axios.delete(`${API}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setJobs(prev => prev.filter(j => j._id !== jobId));
      alert('✅ Job deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      alert(`Failed to delete job: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div style={{background:'#0A0A0A',minHeight:'100vh',padding:'40px 20px',color:'white'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'30px',flexWrap:'wrap',gap:'15px'}}>
          <div>
            <h1 style={{color:'#FF6B00',fontSize:'2rem',margin:0}}>🛡️ Admin Panel</h1>
            <p style={{color:'#888',margin:'5px 0 0 0'}}>Manage all jobs on TaskBridge</p>
          </div>
          <div style={{display:'flex',gap:'15px'}}>
            <div style={{background:'#111',padding:'15px 20px',borderRadius:'12px',border:'1px solid #222',textAlign:'center'}}>
              <div style={{color:'#FF6B00',fontSize:'1.5rem',fontWeight:'bold'}}>{jobs.length}</div>
              <div style={{color:'#888',fontSize:'12px'}}>Total Jobs</div>
            </div>
            <button
              onClick={fetchJobs}
              style={{background:'#1a1a1a',color:'#FF6B00',border:'1px solid #FF6B00',padding:'10px 20px',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{color:'#888',textAlign:'center',padding:'40px'}}>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p style={{color:'#888',textAlign:'center',padding:'40px'}}>No jobs found.</p>
        ) : (
          <div style={{display:'grid',gap:'15px'}}>
            {jobs.map(job => (
              <div key={job._id} style={{
                background:'#111',
                borderRadius:'12px',
                padding:'20px',
                border:`1px solid ${job.status === 'Closed' ? '#ff4444' : '#333'}`,
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                flexWrap:'wrap',
                gap:'15px'
              }}>
                <div style={{flex:1,minWidth:'200px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px',flexWrap:'wrap'}}>
                    <h3 style={{color:'white',margin:0,fontSize:'1rem'}}>{job.title}</h3>
                    <span style={{
                      background: job.status === 'Open' ? '#1a2a1a' :
                                  job.status === 'Closed' ? '#2a1a1a' :
                                  job.status === 'In Progress' ? '#1a1a2a' : '#2a2a1a',
                      color: job.status === 'Open' ? '#4CAF50' :
                             job.status === 'Closed' ? '#ff4444' :
                             job.status === 'In Progress' ? '#6B8CFF' : '#FFD700',
                      padding:'3px 10px',
                      borderRadius:'20px',
                      fontSize:'11px',
                      fontWeight:'bold'
                    }}>{job.status}</span>
                  </div>
                  <p style={{color:'#888',margin:'0 0 4px 0',fontSize:'13px'}}>
                    🏢 {job.postedBy} | 💰 ₹{Number(job.budget).toLocaleString('en-IN')} | 📅 {new Date(job.deadline).toLocaleDateString('en-IN')}
                  </p>
                  <p style={{color:'#555',margin:0,fontSize:'11px',fontFamily:'monospace'}}>
                    ID: {job._id}
                  </p>
                </div>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  {job.status !== 'Closed' && (
                    <button
                      onClick={() => handleCancelJob(job._id)}
                      style={{
                        background:'#2a1500',
                        color:'#FF6B00',
                        border:'1px solid #FF6B00',
                        padding:'8px 16px',
                        borderRadius:'8px',
                        cursor:'pointer',
                        fontWeight:'bold',
                        fontSize:'13px'
                      }}
                    >
                      ⛔ Cancel
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    style={{
                      background:'#2a0000',
                      color:'#ff4444',
                      border:'1px solid #ff4444',
                      padding:'8px 16px',
                      borderRadius:'8px',
                      cursor:'pointer',
                      fontWeight:'bold',
                      fontSize:'13px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}