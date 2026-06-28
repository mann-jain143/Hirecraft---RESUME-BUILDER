import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Cover Letter',
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  targetCompany: {
    type: String,
    trim: true
  },
  targetPosition: {
    type: String,
    trim: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  }
}, { timestamps: true });

const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);
export default CoverLetter;
