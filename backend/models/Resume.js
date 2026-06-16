import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
      trim: true,
    },
    resumeData: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
