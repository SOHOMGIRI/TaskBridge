import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">🌉 TaskBridge</span>
            <p className="footer-tagline">Instantly. Affordably. Locally.</p>
            <p className="footer-desc">
              India's hyperlocal marketplace connecting SME businesses
              with verified college talent.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4>For Businesses</h4>
              <ul>
                <li><Link to="/post-job">Post a Job</Link></li>
                <li><Link to="/business-dashboard">Business Dashboard</Link></li>
                <li><Link to="/browse-talent">Browse Talent</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>For Students</h4>
              <ul>
                <li><Link to="/jobs">Find Work</Link></li>
                <li><Link to="/student-dashboard">Student Dashboard</Link></li>
                <li><Link to="/get-verified">Get Verified</Link></li>
                <li><Link to="/trust-tiers">Trust Tiers</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {year} TaskBridge. All rights reserved.</p>
          <div className="footer-social">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://github.com/SOHOMGIRI/I-COCKROACH" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
