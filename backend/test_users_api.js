import { getUsers } from './controllers/superAdminController.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const req = {
  query: {}
};
const res = {
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log('Status code:', this.statusCode);
    console.log('Response length:', data.length);
    if (data.message) {
      console.log('Error message:', data.message);
    } else {
      console.log('First user:', data[0]);
    }
  }
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected! Testing getUsers controller...');
  await getUsers(req, res);
  await mongoose.disconnect();
}).catch(err => {
  console.error('Connection error:', err);
});
