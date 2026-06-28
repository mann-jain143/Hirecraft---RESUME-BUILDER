import mongoose from 'mongoose';

const adminAnalyticsSchema = mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true }, // Aggregated daily/monthly
    totalUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    totalResumes: { type: Number, default: 0 },
    aiRequests: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }, // in cents or standard unit
    churnRate: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const AdminAnalytics = mongoose.model('AdminAnalytics', adminAnalyticsSchema);
export default AdminAnalytics;
