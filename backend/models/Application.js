import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
    default: 'Applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  },
  jobDescription: {
    type: String
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
