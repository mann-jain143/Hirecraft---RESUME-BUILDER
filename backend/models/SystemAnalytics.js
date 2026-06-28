import mongoose from 'mongoose';

const systemAnalyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      unique: true,
    },
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    resumesCreated: { type: Number, default: 0 },
    aiRequests: { type: Number, default: 0 },
    recruitersCount: { type: Number, default: 0 },
    portfoliosCount: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
    serverStatus: { type: String, default: 'Healthy' },
    databaseStatus: { type: String, default: 'Connected' },
    apiHealth: { type: String, default: 'Optimal' },
    aiStatus: { type: String, default: 'Online' },
  },
  { timestamps: true }
);

const SystemAnalytics = mongoose.model('SystemAnalytics', systemAnalyticsSchema);
export default SystemAnalytics;
