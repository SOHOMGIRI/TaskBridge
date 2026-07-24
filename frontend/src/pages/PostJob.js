import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBuilding,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaAlignLeft,
  FaBullseye,
} from 'react-icons/fa';
import API from '../config';
import { getToken } from '../utils/auth';
import './PostJob.css';

const CATEGORIES = [
  { label: 'Social Media', value: 'Social Media' },
  { label: 'Branding', value: 'Branding' },
  { label: 'Video/Editing', value: 'Video Editing' },
  { label: 'Growth/Outreach', value: 'Growth Outreach' },
  { label: 'Automation/Tech', value: 'Automation Tech' },
  { label: 'Research/Ops', value: 'Research Ops' },
];

const initialForm = {
  businessName: '',
  yourName: '',
  jobTitle: '',
  category: '',
  budget: '',
  deadline: '',
  description: '',
  expectedOutcome: '',
};

const getLoggedInUser = () => {
  try {
    const user = localStorage.getItem('icockroach_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

function PostJob() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loggedInUser = getLoggedInUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const next = {};
    Object.keys(initialForm).forEach((key) => {
      if (!String(form[key]).trim()) {
        next[key] = 'This field is required';
      }
    });
    if (form.budget && Number(form.budget) <= 0) {
      next.budget = 'Budget must be greater than 0';
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
      const description = form.expectedOutcome.trim()
        ? `${form.description.trim()}\n\n--- Expected Outcome ---\n${form.expectedOutcome.trim()}`
        : form.description.trim();

      const payload = {
        title: form.jobTitle.trim(),
        category: form.category,
        budget: Number(form.budget),
        deadline: form.deadline,
        description,
        postedBy: `${form.businessName.trim()} — ${form.yourName.trim()}`,
        ownerId: loggedInUser?._id || loggedInUser?.id || '',
      };

      console.log('Posting job with ownerId:', payload.ownerId);

      const token = getToken();
      if (!token) {
        setSubmitError('Please login as a Business to post a job.');
        setLoading(false);
        return;
      }

      await axios.post(`${API}/api/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Failed to post job. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) =>
    `form-field ${errors[name] ? 'form-field-error' : ''}`;

  return (
    <div className="post-job-page">
      <motion.div
        className="post-job-card"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="post-job-header">
          <h1>Post a Task 📋</h1>
          <p>Get pitches from verified students within hours</p>
        </header>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="success-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="success-title">
                ✅ Job Posted! Students will start pitching soon.
              </h2>
              <Link to="/jobs" className="btn-view-jobs">
                View All Jobs
              </Link>
              <button
                type="button"
                className="btn-post-another"
                onClick={() => setSuccess(false)}
              >
                Post Another Job
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="post-job-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={fieldClass('businessName')}>
                <label htmlFor="businessName">Business Name</label>
                <div className="input-wrap">
                  <FaBuilding className="input-icon" />
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="Your business or brand name"
                    value={form.businessName}
                    onChange={handleChange}
                  />
                </div>
                {errors.businessName && (
                  <span className="error-msg">{errors.businessName}</span>
                )}
              </div>

              <div className={fieldClass('yourName')}>
                <label htmlFor="yourName">Your Name</label>
                <div className="input-wrap">
                  <FaUser className="input-icon" />
                  <input
                    id="yourName"
                    name="yourName"
                    type="text"
                    placeholder="Who should students contact?"
                    value={form.yourName}
                    onChange={handleChange}
                  />
                </div>
                {errors.yourName && (
                  <span className="error-msg">{errors.yourName}</span>
                )}
              </div>

              <div className={fieldClass('jobTitle')}>
                <label htmlFor="jobTitle">Job Title</label>
                <div className="input-wrap">
                  <FaBriefcase className="input-icon" />
                  <input
                    id="jobTitle"
                    name="jobTitle"
                    type="text"
                    placeholder="e.g. Need 5 Instagram posts for my cafe"
                    value={form.jobTitle}
                    onChange={handleChange}
                  />
                </div>
                {errors.jobTitle && (
                  <span className="error-msg">{errors.jobTitle}</span>
                )}
              </div>

              <div className={fieldClass('category')}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="error-msg">{errors.category}</span>
                )}
              </div>

              <div className="form-row">
                <div className={fieldClass('budget')}>
                  <label htmlFor="budget">Budget</label>
                  <div className="input-wrap budget-wrap">
                    <span className="rupee-prefix">₹</span>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      min="1"
                      placeholder="299"
                      value={form.budget}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.budget && (
                    <span className="error-msg">{errors.budget}</span>
                  )}
                </div>

                <div className={fieldClass('deadline')}>
                  <label htmlFor="deadline">Deadline</label>
                  <div className="input-wrap">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={form.deadline}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.deadline && (
                    <span className="error-msg">{errors.deadline}</span>
                  )}
                </div>
              </div>

              <div className={fieldClass('description')}>
                <label htmlFor="description">Description</label>
                <div className="input-wrap textarea-wrap">
                  <FaAlignLeft className="input-icon textarea-icon" />
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Describe exactly what you need, your brand style, references..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
                {errors.description && (
                  <span className="error-msg">{errors.description}</span>
                )}
              </div>

              <div className={fieldClass('expectedOutcome')}>
                <label htmlFor="expectedOutcome">Expected Outcome</label>
                <div className="input-wrap">
                  <FaBullseye className="input-icon" />
                  <input
                    id="expectedOutcome"
                    name="expectedOutcome"
                    type="text"
                    placeholder="What does success look like?"
                    value={form.expectedOutcome}
                    onChange={handleChange}
                  />
                </div>
                {errors.expectedOutcome && (
                  <span className="error-msg">{errors.expectedOutcome}</span>
                )}
              </div>

              {submitError && (
                <p className="submit-error">{submitError}</p>
              )}

              <motion.button
                type="submit"
                className="btn-submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Posting...
                  </span>
                ) : (
                  'Post Job & Get Pitches 🚀'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default PostJob;
