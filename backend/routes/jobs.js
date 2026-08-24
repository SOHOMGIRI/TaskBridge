const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.ownerId) query.ownerId = req.query.ownerId;
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new job (must be logged in — ownerId from JWT)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const job = new Job({
      title: req.body.title,
      category: req.body.category,
      budget: req.body.budget,
      deadline: req.body.deadline,
      description: req.body.description,
      postedBy: req.body.postedBy || req.user.name,
      ownerId: req.user.id,
      status: req.body.status || 'Open',
    });
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update job status (used by students / admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a job (only owner)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (String(job.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    Object.assign(job, req.body);
    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a job (admin panel / moderation)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can delete jobs' });
    }
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
