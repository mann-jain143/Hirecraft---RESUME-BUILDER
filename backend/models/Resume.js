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
    sharing: {
      isShared: { type: Boolean, default: false },
      shareId: { type: String, unique: true, sparse: true, index: true },
      password: { type: String, default: '' },
      expiresAt: { type: Date, default: null },
      views: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
      uniqueVisitors: { type: [String], default: [] },
      shortlisted: { type: Boolean, default: false },
      feedback: [
        {
          recruiterName: { type: String, required: true },
          comment: { type: String, required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          createdAt: { type: Date, default: Date.now }
        }
      ]
    },
    atsHistory: [
      {
        score: { type: Number, required: true },
        date: { type: Date, default: Date.now }
      }
    ],
    activityLog: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
