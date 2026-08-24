const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  userType: user.userType,
  businessName: user.businessName || '',
  college: user.college || '',
  phone: user.phone || '',
  skills: user.skills || [],
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const {
      userType,
      name,
      email,
      password,
      phone,
      businessName,
      college,
      skills,
    } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({
        message: 'Name, email, password, and user type are required.',
      });
    }

    if (!['Business', 'Student', 'Admin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type.' });
    }

    if (userType === 'Admin' && req.body.adminSecret !== 'icockroach_admin_2026') {
      return res.status(403).json({ message: 'Invalid admin secret.' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType,
      phone: phone?.trim() || '',
    };

    if (userType === 'Business') {
      userData.businessName = businessName?.trim() || '';
    }

    if (userType === 'Student') {
      userData.college = college?.trim() || '';
      userData.skills = Array.isArray(skills)
        ? skills.map((s) => s.trim()).filter(Boolean)
        : [];
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
