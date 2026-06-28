import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const email = 'test_profile_save@example.com';
    await User.deleteMany({ email });

    const createdUser = await User.create({
      name: 'Test Profile Save',
      email,
      password: 'mypassword123',
    });

    console.log('--- After creation ---');
    console.log('Is password matched?', await createdUser.matchPassword('mypassword123'));

    // Retrieve user WITHOUT +password (like in updateUserProfile)
    const retrievedUser = await User.findOne({ email }); // no .select('+password')
    console.log('--- After retrieval WITHOUT +password ---');
    console.log('Is password field present in retrieved user?', retrievedUser.password);
    console.log('Is password modified initially?', retrievedUser.isModified('password'));
    
    // Simulate updating another field
    retrievedUser.name = 'Test Profile Save Updated';
    console.log('Is password modified after modifying name?', retrievedUser.isModified('password'));

    // Save
    await retrievedUser.save();
    console.log('Is password modified after save?', retrievedUser.isModified('password'));

    // Retrieve with +password and check match
    const retrievedUser2 = await User.findOne({ email }).select('+password');
    const matches = await retrievedUser2.matchPassword('mypassword123');
    console.log('Does password "mypassword123" still match after save?', matches);
    console.log('Password in DB now:', retrievedUser2.password);

    // Clean up
    await User.deleteMany({ email });
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
