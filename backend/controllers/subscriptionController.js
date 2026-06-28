import Subscription from '../models/Subscription.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get user subscription
// @route   GET /api/subscriptions/me
export const getMySubscription = async (req, res) => {
  try {
    let sub = await Subscription.findOne({ user: req.user._id });
    if (!sub) {
      // Create default free tier
      sub = await Subscription.create({ user: req.user._id });
    }
    res.status(200).json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock Checkout for Plan Upgrade
// @route   POST /api/subscriptions/checkout
export const checkoutMock = async (req, res) => {
  try {
    const { plan } = req.body; // 'pro' or 'premium'
    if (!['pro', 'premium'].includes(plan)) return res.status(400).json({ message: 'Invalid plan' });

    let sub = await Subscription.findOne({ user: req.user._id });
    if (!sub) {
      sub = await Subscription.create({ user: req.user._id });
    }

    // Process Mock Payment
    const amount = plan === 'premium' ? 2900 : 1500; // $29 or $15

    await Payment.create({
      user: req.user._id,
      amount,
      planTier: plan,
      status: 'succeeded'
    });

    // Update Subscription
    sub.plan = plan;
    sub.status = 'active';
    sub.aiCredits.limit = plan === 'premium' ? 999999 : 500;
    
    // Set expiry to 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    sub.currentPeriodEnd = d;
    await sub.save();

    await AuditLog.create({ user: req.user._id, action: `UPGRADED_PLAN_${plan.toUpperCase()}` });

    res.status(200).json({ message: `Successfully upgraded to ${plan}`, subscription: sub });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Invoice/Payment History
// @route   GET /api/subscriptions/invoices
export const getInvoices = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
