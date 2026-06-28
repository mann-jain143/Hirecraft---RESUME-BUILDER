import mongoose from 'mongoose';

const placementHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true, // Aptitude or Verbal
    },
    subcategory: {
      type: String,
      default: '', // topic name
    },
    score: {
      type: Number,
      required: true, // correct answers count
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true, // accuracy percentage
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
    company: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'Quick Practice',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementHistory = mongoose.model('PlacementHistory', placementHistorySchema);
export default PlacementHistory;
