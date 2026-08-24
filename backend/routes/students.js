const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/students - get all
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ userType: 'Student' }).sort({ createdAt: -1 });
    // Map to include dummy trustTier and earnings for now
    const mapped = students.map(s => ({
      _id: s._id,
      name: s.name,
      college: s.college,
      skills: s.skills,
      trustTier: 'Bronze',
      trustScore: 20,
      totalEarnings: 0
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students - create new
router.post('/', async (req, res) => {
  try {
    const student = new User({ ...req.body, userType: 'Student' });
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/students/:id - get one
router.get('/:id', async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, userType: 'Student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
