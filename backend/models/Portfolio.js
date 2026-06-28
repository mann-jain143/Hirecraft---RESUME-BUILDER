import mongoose from 'mongoose';

const portfolioSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    username: { type: String, required: true, unique: true },
    isPublic: { type: Boolean, default: true },
    theme: { type: String, default: 'modern' }, // modern, minimal, dark, creative
    customization: {
      accentColor: { type: String, default: '#6366f1' },
      font: { type: String, default: 'Inter' },
      layout: { type: String, default: 'standard' },
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    badges: [{ type: String }],
  },
  { timestamps: true }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
