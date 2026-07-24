import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLink, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import API from '../config';
import './PitchForm.css';

const CATEGORY_LABELS = {
  'Social Media': 'Social Media',
  Branding: 'Branding',
  'Video Editing': 'Video/Editing',
  'Growth Outreach': 'Growth/Outreach',
  'Automation Tech': 'Automation/Tech',
  'Research Ops': 'Research/Ops',
};

const PITCH_TIPS = [
  'Be specific, not generic',
  'Show similar past work',
  'Price fairly, not too low',
  'Mention your tools',
  'Keep it under 150 words',
];

const initialForm = {
  studentName: '',
  college: '',
  intro: '',
  whyMe: '',
  cost: '',
  timeline: '',
  portfolioLink: '',
  sampleWork: '',
};

function Confetti() {
  const colors = ['#FF6B00', '#FFD700', '#4ADE80', '#3B82F6', '#E1306C', '#A855F7'];
  return (
    <div className="confetti-container" aria-hidden="true">
      {Array.from({ length: 50 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            '--delay': `${(i % 10) * 0.1}s`,
            '--left': `${(i * 7.3) % 100}%`,
            '--color': colors[i % colors.length],
            '--rotate': `${(i * 37) % 360}deg`,
          }}
        />
      ))}
    </div>
  );
}

function PitchForm() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [aiLoadingIntro, setAiLoadingIntro] = useState(false);
  const [aiLoadingWhyMe, setAiLoadingWhyMe] = useState(false);
  const [aiSuccessIntro, setAiSuccessIntro] = useState(false);
  const [aiSuccessWhyMe, setAiSuccessWhyMe] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setJobLoading(true);
        const { data } = await axios.get(`${API}/api/jobs/${jobId}`);
        setJob(data);
        setJobError('');
      } catch (err) {
        setJobError(err.response?.data?.message || 'Job not found.');
      } finally {
        setJobLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ✅ FIXED - calls backend instead of Anthropic directly
  const enhanceWithAI = async (fieldName, fieldValue, setLoadingFn, setSuccessFn) => {
    if (!fieldValue.trim()) {
      alert('Please write something first before enhancing with AI!');
      return;
    }
    setLoadingFn(true);
    setSuccessFn(false);
    try {
      const { data } = await axios.post(`${API}/api/enhance`, {
        fieldName,
        fieldValue,
      });
      if (data.enhancedText) {
        setForm(prev => ({ ...prev, [fieldName]: data.enhancedText }));
        setSuccessFn(true);
        setTimeout(() => setSuccessFn(false), 3000);
      } else {
        alert('AI enhancement failed. Please try again.');
      }
    } catch (err) {
      console.error('AI error:', err);
      alert('AI enhancement failed. Please try again.');
    } finally {
      setLoadingFn(false);
    }
  };

  const validate = () => {
    const next = {};
    const required = ['studentName', 'college', 'intro', 'whyMe', 'cost', 'timeline', 'sampleWork'];
    required.forEach((key) => {
      if (!String(form[key]).trim()) next[key] = 'This field is required';
    });
    if (form.cost && Number(form.cost) <= 0) next.cost = 'Price must be greater than 0';
    if (form.timeline && Number(form.timeline) < 1) next.timeline = 'Timeline must be at least 1 day';
    if (form.portfolioLink.trim() && !/^https?:\/\/.+/i.test(form.portfolioLink)) {
      next.portfolioLink = 'Enter a valid URL (https://...)';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const intro = form.sampleWork.trim()
        ? `${form.intro.trim()}\n\n--- Sample Work ---\n${form.sampleWork.trim()}`
        : form.intro.trim();
      const payload = {
        jobId,
        studentName: form.studentName.trim(),
        college: form.college.trim(),
        intro,
        whyMe: form.whyMe.trim(),
        cost: Number(form.cost),
        timeline: Number(form.timeline),
        portfolioLink: form.portfolioLink.trim(),
      };
      await axios.post(`${API}/api/pitches`, payload);
      localStorage.setItem('icockroach_student_name', form.studentName.trim());
      localStorage.setItem('icockroach_student_college', form.college.trim());
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send pitch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) => `form-field ${errors[name] ? 'form-field-error' : ''}`;
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (jobLoading) {
    return (
      <div className="pitch-page">
        <div className="pitch-loading">
          <span className="pitch-spinner" />
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="pitch-page">
        <div className="pitch-error-state">
          <p>{jobError || 'Job not found.'}</p>
          <Link to="/jobs" className="btn-back-jobs">← Back to Jobs</Link>
        </div>
      </div>
    );
  }

  const catLabel = CATEGORY_LABELS[job.category] || job.category;

  return (
    <div className="pitch-page">
      {success && <Confetti />}

      <motion.div
        className="job-preview-card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="preview-label">Applying for</span>
        <span className="preview-category">{catLabel}</span>
        <h1 className="preview-title">{job.title}</h1>
        <div className="preview-meta">
          <span className="preview-budget">
            <FaRupeeSign /> ₹{Number(job.budget).toLocaleString('en-IN')}
          </span>
          <span className="preview-deadline">
            <FaCalendarAlt /> {formatDate(job.deadline)}
          </span>
        </div>
        <p className="preview-desc">{job.description}</p>
      </motion.div>

      <div className="pitch-layout">
        <motion.div
          className="pitch-form-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                className="pitch-success-card"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <span className="success-emoji">🎉</span>
                <h2>Pitch Sent!</h2>
                <p>The business will review it soon.</p>
                <Link to="/jobs" className="btn-browse-more">Browse More Jobs</Link>
                <Link to="/student-dashboard" className="btn-my-pitches">Go to Dashboard</Link>
              </motion.div>
            ) : (
              <motion.div key="form">
                <h2 className="form-section-title">Submit Your Pitch ✍️</h2>
                <form className="pitch-form" onSubmit={handleSubmit}>
                  <div className="form-row-2">
                    <div className={fieldClass('studentName')}>
                      <label htmlFor="studentName">Your Name</label>
                      <input
                        id="studentName"
                        name="studentName"
                        type="text"
                        placeholder="Full name"
                        value={form.studentName}
                        onChange={handleChange}
                      />
                      {errors.studentName && <span className="error-msg">{errors.studentName}</span>}
                    </div>
                    <div className={fieldClass('college')}>
                      <label htmlFor="college">Your College</label>
                      <input
                        id="college"
                        name="college"
                        type="text"
                        placeholder="College / University name"
                        value={form.college}
                        onChange={handleChange}
                      />
                      {errors.college && <span className="error-msg">{errors.college}</span>}
                    </div>
                  </div>

                  <div className={fieldClass('intro')}>
                    <label htmlFor="intro">Short Intro</label>
                    <textarea
                      id="intro"
                      name="intro"
                      rows={3}
                      placeholder="Tell them who you are in 2-3 lines"
                      value={form.intro}
                      onChange={handleChange}
                    />
                    {errors.intro && <span className="error-msg">{errors.intro}</span>}
                    <button
                      type="button"
                      onClick={() => enhanceWithAI('intro', form.intro, setAiLoadingIntro, setAiSuccessIntro)}
                      disabled={aiLoadingIntro}
                      style={{
                        marginTop:'8px',
                        background:'linear-gradient(135deg, #FF6B00, #ff9500)',
                        color:'white',
                        border:'none',
                        padding:'8px 16px',
                        borderRadius:'8px',
                        cursor: aiLoadingIntro ? 'not-allowed' : 'pointer',
                        fontWeight:'bold',
                        fontSize:'13px',
                        display:'flex',
                        alignItems:'center',
                        gap:'6px',
                        boxShadow:'0 0 12px rgba(255,107,0,0.4)',
                        opacity: aiLoadingIntro ? 0.7 : 1,
                      }}
                    >
                      {aiLoadingIntro ? '⏳ Enhancing...' : '✨ Improve Intro with AI'}
                    </button>
                    {aiSuccessIntro && (
                      <p style={{color:'#4ADE80',fontSize:'13px',marginTop:'6px',fontWeight:'bold'}}>
                        ✨ Intro enhanced by AI!
                      </p>
                    )}
                  </div>

                  <div className={fieldClass('whyMe')}>
                    <label htmlFor="whyMe">Why You?</label>
                    <textarea
                      id="whyMe"
                      name="whyMe"
                      rows={4}
                      placeholder="Why are you the best for this? Show confidence!"
                      value={form.whyMe}
                      onChange={handleChange}
                    />
                    {errors.whyMe && <span className="error-msg">{errors.whyMe}</span>}
                    <button
                      type="button"
                      onClick={() => enhanceWithAI('whyMe', form.whyMe, setAiLoadingWhyMe, setAiSuccessWhyMe)}
                      disabled={aiLoadingWhyMe}
                      style={{
                        marginTop:'8px',
                        background:'linear-gradient(135deg, #FF6B00, #ff9500)',
                        color:'white',
                        border:'none',
                        padding:'8px 16px',
                        borderRadius:'8px',
                        cursor: aiLoadingWhyMe ? 'not-allowed' : 'pointer',
                        fontWeight:'bold',
                        fontSize:'13px',
                        display:'flex',
                        alignItems:'center',
                        gap:'6px',
                        boxShadow:'0 0 12px rgba(255,107,0,0.4)',
                        opacity: aiLoadingWhyMe ? 0.7 : 1,
                      }}
                    >
                      {aiLoadingWhyMe ? '⏳ Enhancing...' : '✨ Enhance with AI'}
                    </button>
                    {aiSuccessWhyMe && (
                      <p style={{color:'#4ADE80',fontSize:'13px',marginTop:'6px',fontWeight:'bold'}}>
                        ✨ Pitch enhanced by AI!
                      </p>
                    )}
                  </div>

                  <div className="form-row-2">
                    <div className={fieldClass('cost')}>
                      <label htmlFor="cost">Your Price</label>
                      <div className="price-wrap">
                        <span className="rupee-prefix">₹</span>
                        <input
                          id="cost"
                          name="cost"
                          type="number"
                          min="1"
                          placeholder="Your quote"
                          value={form.cost}
                          onChange={handleChange}
                        />
                      </div>
                      <span className="field-hint">
                        Job budget is ₹{Number(job.budget).toLocaleString('en-IN')}
                      </span>
                      {errors.cost && <span className="error-msg">{errors.cost}</span>}
                    </div>
                    <div className={fieldClass('timeline')}>
                      <label htmlFor="timeline">Timeline</label>
                      <div className="timeline-wrap">
                        <input
                          id="timeline"
                          name="timeline"
                          type="number"
                          min="1"
                          placeholder="3"
                          value={form.timeline}
                          onChange={handleChange}
                        />
                        <span className="timeline-suffix">days</span>
                      </div>
                      {errors.timeline && <span className="error-msg">{errors.timeline}</span>}
                    </div>
                  </div>

                  <div className={fieldClass('portfolioLink')}>
                    <label htmlFor="portfolioLink">Portfolio / Work Link</label>
                    <div className="link-wrap">
                      <FaLink className="link-icon" />
                      <input
                        id="portfolioLink"
                        name="portfolioLink"
                        type="url"
                        placeholder="https://your-portfolio.com"
                        value={form.portfolioLink}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.portfolioLink && <span className="error-msg">{errors.portfolioLink}</span>}
                  </div>

                  <div className={fieldClass('sampleWork')}>
                    <label htmlFor="sampleWork">Sample Work Description</label>
                    <textarea
                      id="sampleWork"
                      name="sampleWork"
                      rows={3}
                      placeholder="Describe a similar past project"
                      value={form.sampleWork}
                      onChange={handleChange}
                    />
                    {errors.sampleWork && <span className="error-msg">{errors.sampleWork}</span>}
                  </div>

                  {submitError && <p className="submit-error">{submitError}</p>}

                  <motion.button
                    type="submit"
                    className="btn-send-pitch"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <span className="btn-loading">
                        <span className="pitch-spinner small" />
                        Sending...
                      </span>
                    ) : (
                      'Send My Pitch 🚀'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <aside className="pitch-tips-sidebar">
          <motion.div
            className="tips-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <h3>💡 Pitch Tips</h3>
            <ul>
              {PITCH_TIPS.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <div style={{marginTop:'20px',padding:'15px',background:'#1a0f00',borderRadius:'8px',border:'1px solid #FF6B00'}}>
              <p style={{color:'#FF6B00',fontWeight:'bold',margin:'0 0 8px 0',fontSize:'13px'}}>✨ AI Powered</p>
              <p style={{color:'#888',margin:0,fontSize:'12px'}}>Use the AI buttons to instantly enhance your pitch with Claude AI!</p>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

export default PitchForm;
