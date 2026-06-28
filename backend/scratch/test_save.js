import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const user = await User.findOne({ email: 'mannjain4885@gmail.com' });
    if (!user) {
      console.log('User not found!');
    } else {
      console.log('User found:', user.email);
      user.lastLoginDate = new Date();
      try {
        await user.save({ validateBeforeSave: false });
        console.log('User saved successfully!');
      } catch (saveErr) {
        console.error('Save failed:', saveErr);
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
