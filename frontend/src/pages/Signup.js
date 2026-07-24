import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaBuilding,
  FaGraduationCap,
  FaPhone,
} from 'react-icons/fa';
import API from '../config';
import { setAuth, getDashboardPath } from '../utils/auth';
import './Auth.css';

const API_BASE = API || 'https://i-cockroach.onrender.com';

function Signup() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('Business');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    fullName: '',
    college: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload =
      userType === 'Business'
        ? {
            userType: 'Business',
            name: form.ownerName.trim(),
            businessName: form.businessName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            password: form.password,
          }
        : {
            userType: 'Student',
            name: form.fullName.trim(),
            college: form.college.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            skills,
            password: form.password,
          };

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/signup`, payload);
      setAuth(data.token, data.user);

      if (data.user.userType === 'Student') {
        localStorage.setItem('icockroach_student_name', data.user.name);
        localStorage.setItem('icockroach_student_college', data.user.college || '');
      }

      navigate(getDashboardPath(data.user.userType));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="auth-logo">🌉 TaskBridge</span>
        <h1 className="auth-title">Create Account</h1>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${userType === 'Business' ? 'active' : ''}`}
            onClick={() => setUserType('Business')}
          >
            Business
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${userType === 'Student' ? 'active' : ''}`}
            onClick={() => setUserType('Student')}
          >
            Student
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {userType === 'Business' ? (
            <>
              <div className="auth-field">
                <label htmlFor="businessName">Business Name</label>
                <div className="auth-input-wrap">
                  <FaBuilding className="auth-input-icon" />
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="Your business name"
                    value={form.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="ownerName">Owner Name</label>
                <div className="auth-input-wrap">
                  <FaUser className="auth-input-icon" />
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    placeholder="Your full name"
                    value={form.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="auth-field">
                <label htmlFor="fullName">Full Name</label>
                <div className="auth-input-wrap">
                  <FaUser className="auth-input-icon" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="college">College</label>
                <div className="auth-input-wrap">
                  <FaGraduationCap className="auth-input-icon" />
                  <input
                    id="college"
                    name="college"
                    type="text"
                    placeholder="College / University"
                    value={form.college}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="skills">Skills</label>
                <div className="auth-input-wrap">
                  <input
                    id="skills"
                    type="text"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={addSkill}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                {skills.length > 0 && (
                  <div className="auth-skills-wrap">
                    {skills.map((skill) => (
                      <span key={skill} className="auth-skill-tag">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className="auth-input-wrap">
              <FaEnvelope className="auth-input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="phone">Phone</label>
            <div className="auth-input-wrap">
              <FaPhone className="auth-input-icon" />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <FaLock className="auth-input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <motion.button
            type="submit"
            className="auth-submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <span className="auth-loading">
                <span className="auth-spinner" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
