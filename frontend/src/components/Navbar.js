import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../utils/auth';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const loadUser = () => setUser(getUser());

  useEffect(() => {
    loadUser();
    window.addEventListener('auth-change', loadUser);
    window.addEventListener('storage', loadUser);
    return () => {
      window.removeEventListener('auth-change', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-logo">🌉 TaskBridge</span>
          <span className="navbar-tagline">India's Hyperlocal Talent Marketplace</span>
        </NavLink>

        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className="navbar-link">Home</NavLink>
          </li>

          {/* NOT logged in */}
          {!user && (
            <>
              <li><NavLink to="/jobs" className="navbar-link">Find Work</NavLink></li>
              <li><NavLink to="/post-job" className="navbar-link">Post a Job</NavLink></li>
            </>
          )}

          {/* Student links */}
          {user?.userType === 'Student' && (
            <>
              <li><NavLink to="/jobs" className="navbar-link">Find Work</NavLink></li>
              <li><NavLink to="/student-dashboard" className="navbar-link">Dashboard</NavLink></li>
            </>
          )}

          {/* Business links */}
          {user?.userType === 'Business' && (
            <>
              <li><NavLink to="/post-job" className="navbar-link">Post a Job</NavLink></li>
              <li><NavLink to="/business-dashboard" className="navbar-link">Dashboard</NavLink></li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-user">
                Hi, <strong>{user.name}</strong>
              </span>
              <button
                type="button"
                className="navbar-btn navbar-btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn navbar-btn-login">Login</Link>
              <Link to="/signup" className="navbar-btn navbar-btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
