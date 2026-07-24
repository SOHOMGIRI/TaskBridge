const express = require('express');
const router = express.Router();
const Pitch = require('../models/Pitch');
const Job = require('../models/Job');
// ✅ Import your auth middleware so we know who is logged in
const authMiddleware = require('../middleware/auth');

// Get all pitches (optional filter by studentName)
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.studentName) {
      query.studentName = { $regex: req.query.studentName.trim(), $options: 'i' };
    }
    const pitches = await Pitch.find(query).sort({ createdAt: -1 });
    res.json(pitches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit a new pitch
router.post('/', async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const pitch = new Pitch(req.body);
    const savedPitch = await pitch.save();
    res.status(201).json(savedPitch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all pitches for a specific job
router.get('/job/:jobId', async (req, res) => {
  try {
    const pitches = await Pitch.find({ jobId: req.params.jobId }).sort({ createdAt: -1 });
    res.json(pitches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update pitch status (generic — owner only for Accept/Reject-style changes)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const pitch = await Pitch.findById(req.params.id);
    if (!pitch) return res.status(404).json({ message: 'Pitch not found' });

    const job = await Job.findById(pitch.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (String(job.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update pitches for this job' });
    }

    pitch.status = status;
    await pitch.save();
    res.json(pitch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Reject a pitch (only job owner)
router.patch('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.id);
    if (!pitch) return res.status(404).json({ message: 'Pitch not found' });

    const job = await Job.findById(pitch.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // ✅ Ownership check
    if (String(job.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to reject pitches for this job' });
    }

    pitch.status = 'Rejected';
    await pitch.save();
    res.json(pitch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept a pitch (only job owner)
router.patch('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.id);
    if (!pitch) return res.status(404).json({ message: 'Pitch not found' });

    const job = await Job.findById(pitch.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // ✅ Ownership check
    if (String(job.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to accept pitches for this job' });
    }

    pitch.status = 'Accepted';
    await pitch.save();

    // Reject all other pitches for the same job
    await Pitch.updateMany(
      { jobId: pitch.jobId, _id: { $ne: pitch._id } },
      { status: 'Rejected' }
    );

    // Update job status
    await Job.findByIdAndUpdate(pitch.jobId, { status: 'In Progress' });

    const allPitches = await Pitch.find({ jobId: pitch.jobId }).sort({ createdAt: -1 });

    res.json({
      message: 'Pitch accepted.',
      acceptedPitch: pitch,
      pitches: allPitches,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
