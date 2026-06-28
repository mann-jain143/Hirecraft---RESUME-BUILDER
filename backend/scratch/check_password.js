import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const user = await User.findOne({ email: 'mannjain4885@gmail.com' }).select('+password');
    if (!user) {
      console.log('User not found!');
    } else {
      console.log('User found:', user.email);
      console.log('Hashed Password in DB:', user.password);
      const matches = await user.matchPassword('123456');
      console.log('Does password "123456" match?', matches);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
