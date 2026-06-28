import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const count = await User.countDocuments();
    console.log(`Total users in DB: ${count}`);

    const users = await User.find().select('name email role status');
    console.log('Users:');
    console.log(JSON.stringify(users, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
