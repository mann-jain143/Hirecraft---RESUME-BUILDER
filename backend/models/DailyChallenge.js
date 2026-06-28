import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      unique: true,
    },
    aptitudeQuestions: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    verbalQuestions: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);
export default DailyChallenge;
