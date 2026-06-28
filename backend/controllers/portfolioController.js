import Portfolio from '../models/Portfolio.js';
import ProfileAnalytics from '../models/ProfileAnalytics.js';
import PublicLink from '../models/PublicLink.js';
import ActivityLog from '../models/ActivityLog.js';
import crypto from 'crypto';

// @desc    Get user's portfolio configuration
// @route   GET /api/portfolio
export const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id }).populate('resumeId');
    if (!portfolio) {
      // Create default
      portfolio = await Portfolio.create({
        user: req.user._id,
        username: `user_${crypto.randomBytes(4).toString('hex')}`
      });
      await ProfileAnalytics.create({ portfolio: portfolio._id, user: req.user._id });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update portfolio configuration
// @route   PUT /api/portfolio
export const updatePortfolio = async (req, res) => {
  try {
    const { username, theme, customization, socialLinks, resumeId, isPublic } = req.body;
    
    if (username) {
      const exists = await Portfolio.findOne({ username, _id: { $ne: req.portfolio?._id } });
      // We need to fetch the current portfolio to check id
      const current = await Portfolio.findOne({ user: req.user._id });
      if (exists && exists._id.toString() !== current._id.toString()) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { username, theme, customization, socialLinks, resumeId, isPublic },
      { new: true, upsert: true }
    );

    await ActivityLog.create({ user: req.user._id, action: 'Updated Portfolio Settings' });
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile analytics
// @route   GET /api/portfolio/analytics
export const getAnalytics = async (req, res) => {
  try {
    const analytics = await ProfileAnalytics.findOne({ user: req.user._id });
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a new public link
// @route   POST /api/portfolio/link
export const generatePublicLink = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const linkId = crypto.randomBytes(6).toString('hex');
    const link = await PublicLink.create({
      user: req.user._id,
      resumeId,
      linkId
    });
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public links
// @route   GET /api/portfolio/links
export const getPublicLinks = async (req, res) => {
  try {
    const links = await PublicLink.find({ user: req.user._id }).populate('resumeId', 'title');
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
