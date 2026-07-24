import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import API from '../config';
import { setAuth, getDashboardPath } from '../utils/auth';
import './Auth.css';

const API_BASE = API || 'https://i-cockroach.onrender.com';

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('Business');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      if (data.user.userType !== userType) {
        setError(
          `This account is registered as ${data.user.userType}. Switch to "${data.user.userType === 'Business' ? "I'm a Business" : "I'm a Student"}".`
        );
        return;
      }

      setAuth(data.token, data.user);

      if (data.user.userType === 'Student') {
        localStorage.setItem('icockroach_student_name', data.user.name);
        localStorage.setItem('icockroach_student_college', data.user.college || '');
      }

      navigate(getDashboardPath(data.user.userType));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
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
        <h1 className="auth-title">Welcome Back!</h1>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${userType === 'Business' ? 'active' : ''}`}
            onClick={() => setUserType('Business')}
          >
            I&apos;m a Business
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${userType === 'Student' ? 'active' : ''}`}
            onClick={() => setUserType('Student')}
          >
            I&apos;m a Student
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className="auth-input-wrap">
              <FaEnvelope className="auth-input-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
