// Force Node to prefer IPv4 DNS resolution
process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // wait up to 30s for server selection
  socketTimeoutMS: 45000,          // close sockets after 45s inactivity
  family: 4,                       // force IPv4
  directConnection: false,
  retryWrites: true
})
.then(async () => {
  console.log('✅ MongoDB Connected Successfully!');
  try {
    const User = require('./models/User');
    await User.deleteMany({ name: 'Baklol' });
    console.log('Removed test user Baklol');
  } catch (e) {}
})
.catch(err => console.error('❌ MongoDB Error:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/students', require('./routes/students'));
app.use('/api/pitches', require('./routes/pitches'));

// ✅ Mount the enhance route so frontend can call /api/enhance
app.use('/api/enhance', require('./routes/enhance'));

// Root route
app.get('/', (req, res) => {
  res.send('🌉 TaskBridge API Running - India Hyperlocal Talent Marketplace');
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TaskBridge Server Running on Port ${PORT}`);
});

