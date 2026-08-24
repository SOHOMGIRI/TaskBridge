const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const email = 'admin@taskbridge.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: email,
      password: hashedPassword,
      userType: 'Admin',
    });
    console.log('Admin user created: admin@taskbridge.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seedAdmin();
