import mongoose from 'mongoose';

const placementBookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    shortcut: {
      type: String,
      default: '',
    },
    formula: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true, // Aptitude or Verbal
    },
    subcategory: {
      type: String,
      required: true, // Quantitative, logical, reading comprehension etc
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    isDifficult: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementBookmark = mongoose.model('PlacementBookmark', placementBookmarkSchema);
export default PlacementBookmark;
