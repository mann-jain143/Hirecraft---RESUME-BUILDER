import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const findQuery = {};
    
    // Simulate what the controller does:
    const users = await User.find(findQuery).select('-password').sort({ createdAt: -1 });
    console.log('User find length:', users.length);

    const activeSubs = await Subscription.find({ status: 'active' }).select('user');
    console.log('Active Subs length:', activeSubs.length);

    const premiumUserIds = new Set(activeSubs.map(s => s.user?.toString()));
    console.log('Premium User IDs:', [...premiumUserIds]);

    const usersWithPremium = users.map(u => {
      const uObj = u.toObject();
      uObj.isPremium = premiumUserIds.has(u._id.toString());
      return uObj;
    });

    console.log('Controller output length:', usersWithPremium.length);
    console.log('Sample output:', usersWithPremium.map(u => ({ name: u.name, isPremium: u.isPremium })));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

test();
