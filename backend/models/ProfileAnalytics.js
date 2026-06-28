import mongoose from 'mongoose';

const profileAnalyticsSchema = mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalViews: { type: Number, default: 0 },
    resumeDownloads: { type: Number, default: 0 },
    qrScans: { type: Number, default: 0 },
    recruiterVisits: { type: Number, default: 0 },
    deviceStats: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
    },
    trafficSources: [
      {
        source: { type: String }, // e.g. "LinkedIn", "Direct", "Twitter"
        count: { type: Number, default: 1 }
      }
    ],
    viewsTimeline: [
      {
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);

const ProfileAnalytics = mongoose.model('ProfileAnalytics', profileAnalyticsSchema);
export default ProfileAnalytics;
