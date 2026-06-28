import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const count = await User.countDocuments();
    console.log('Total Users Count:', count);
    
    const allUsers = await User.find({}).select('-password');
    console.log('All Users:', allUsers.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, status: u.status })));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

test();
