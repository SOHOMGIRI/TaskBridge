import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import './Home.css';

const headlineLines = [
  "India's #1 Hyperlocal",
  'Digital Talent',
  'Marketplace',
];

const steps = [
  {
    icon: '📋',
    num: '01',
    title: 'Post a Task',
    desc: 'Describe your need with budget and deadline',
  },
  {
    icon: '🎯',
    num: '02',
    title: 'Get Pitches',
    desc: 'Verified students send their proposals',
  },
  {
    icon: '✅',
    num: '03',
    title: 'Pick & Track',
    desc: 'Choose the best fit and track progress',
  },
  {
    icon: '💰',
    num: '04',
    title: 'Pay on Approval',
    desc: 'Release payment only when satisfied',
  },
];

const businessPoints = [
  'Post tasks in 2 mins',
  'Budget starting ₹299',
  'Verified student talent',
  'Track work live',
  'Pay only on approval',
];

const studentPoints = [
  'Find local gigs',
  'Build real portfolio',
  'Get paid instantly',
  'Climb trust ladder',
  'Work from anywhere',
];

const categories = [
  { emoji: '📱', title: 'Social Media', task: '5 Instagram posts for your cafe' },
  { emoji: '🎨', title: 'Branding', task: 'Logo + visiting cards' },
  { emoji: '🎬', title: 'Video/Editing', task: 'Reel edits and YouTube shorts' },
  { emoji: '📈', title: 'Growth/Outreach', task: 'Influencer mapping + lead gen' },
  { emoji: '⚙️', title: 'Automation/Tech', task: 'WhatsApp bot + landing page' },
  { emoji: '🔍', title: 'Research/Ops', task: 'Competitor research + catalog cleanup' },
];

const trustTiers = [
  {
    name: 'Bronze',
    color: '#CD7F32',
    desc: 'New talent getting started',
    req: 'Complete 1 task • 4.0+ rating',
  },
  {
    name: 'Silver',
    color: '#C0C0C0',
    desc: 'Reliable performers',
    req: '5 tasks • 4.3+ rating • On-time delivery',
  },
  {
    name: 'Gold',
    color: '#FFD700',
    desc: 'Top-rated local experts',
    req: '15 tasks • 4.6+ rating • Portfolio verified',
  },
  {
    name: 'Verified Pro',
    color: '#FF6B00',
    desc: 'Elite execution partners',
    req: '30+ tasks • 4.8+ rating • Business endorsements',
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Businesses' },
  { value: 1200, suffix: '+', label: 'Students' },
  { value: 6, suffix: '', label: 'Categories' },
  { value: 25, prefix: '₹', suffix: 'L+', label: 'Paid' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

function AnimatedCounter({ target, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [text, setText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!isInView) return undefined;
    const controls = animate(count, target, { duration: 2, ease: 'easeOut' });
    return () => controls.stop();
  }, [isInView, count, target]);

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setText(`${prefix}${v}${suffix}`));
    return () => unsub();
  }, [prefix, suffix, rounded]);

  return (
    <span ref={ref} className="stat-number">
      {text}
    </span>
  );
}

function Home() {
  return (
    <div className="home">
      {/* SECTION 1 — HERO */}
      <section className="home-hero">
        <div className="hero-orbs" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
          <span className="orb orb-4" />
        </div>
        <div className="hero-particles" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="particle" />
          ))}
        </div>

        <div className="hero-content">
          <h1 className="hero-headline">
            {headlineLines.map((line, lineIndex) => (
              <motion.span
                key={line}
                className="hero-line"
                initial="hidden"
                animate="visible"
              >
                {line.split(' ').map((word, wordIndex) => (
                  <motion.span
                    key={`${line}-${word}`}
                    className="hero-word"
                    variants={{
                      hidden: { opacity: 0, y: 50, rotateX: -40 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        transition: {
                          delay: lineIndex * 0.35 + wordIndex * 0.08,
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
          >
            Connecting SME businesses with verified student talent.{' '}
            <span className="hero-sub-accent">
              Instantly. Affordably. Locally.
            </span>
          </motion.p>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/post-job" className="btn btn-primary">
                Post a Job →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/jobs" className="btn btn-outline">
                Find Work →
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            className="hero-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            Trusted by 500+ businesses across India • Join 1,200+ verified student freelancers • ₹25L+ earned by students on TaskBridge
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS */}
      <section className="home-section how-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="step-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <span className="step-icon">{step.icon}</span>
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — BUSINESSES vs STUDENTS */}
      <section className="home-section split-section">
        <div className="split-grid">
          <motion.div
            className="split-card split-business"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="split-badge">FOR BUSINESSES 🏪</span>
            <h2>Cut costs by 80%</h2>
            <ul>
              {businessPoints.map((point) => (
                <li key={point}>
                  <FaCheck className="check-icon" />
                  {point}
                </li>
              ))}
            </ul>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link to="/post-job" className="btn btn-primary btn-block">
                Post Your First Job Free
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="split-card split-student"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="split-badge split-badge-dark">FOR STUDENTS 🎓</span>
            <h2>Earn while you learn</h2>
            <ul>
              {studentPoints.map((point) => (
                <li key={point}>
                  <FaCheck className="check-icon check-icon-dark" />
                  {point}
                </li>
              ))}
            </ul>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link to="/student-dashboard" className="btn btn-dark btn-block">
                Join as a Student
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — CATEGORIES */}
      <section className="home-section categories-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Gets Done Here
        </motion.h2>

        <div className="categories-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="category-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -10, boxShadow: '0 20px 50px rgba(255, 107, 0, 0.25)' }}
            >
              <span className="category-emoji">{cat.emoji}</span>
              <h3>{cat.title}</h3>
              <p>&ldquo;{cat.task}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — TRUST LADDER */}
      <section className="home-section trust-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Students Earn Their Stripes
        </motion.h2>

        <div className="trust-ladder">
          <motion.div
            className="trust-progress-track"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="trust-tiers">
            {trustTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                className="trust-card"
                style={{ '--tier-color': tier.color }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.55 }}
                whileHover={{ y: -6 }}
              >
                <div className="trust-dot" />
                <span className="trust-name">{tier.name}</span>
                <p className="trust-desc">{tier.desc}</p>
                <span className="trust-req">{tier.req}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — STATS BANNER */}
      <section className="stats-banner">
        <div className="stats-inner">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <AnimatedCounter
                target={stat.value}
                prefix={stat.prefix || ''}
                suffix={stat.suffix || ''}
              />
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
