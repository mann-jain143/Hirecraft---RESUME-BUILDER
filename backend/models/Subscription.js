import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
    status: { type: String, enum: ['active', 'past_due', 'canceled', 'unpaid'], default: 'active' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentPeriodEnd: { type: Date },
    aiCredits: {
      used: { type: Number, default: 0 },
      limit: { type: Number, default: 50 }, // 50 for free, 500 for pro, unlimited for premium
    }
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
