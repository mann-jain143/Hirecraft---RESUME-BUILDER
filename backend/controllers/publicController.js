import Portfolio from '../models/Portfolio.js';
import PublicLink from '../models/PublicLink.js';
import Resume from '../models/Resume.js';
import ProfileAnalytics from '../models/ProfileAnalytics.js';
import ContactMessage from '../models/ContactMessage.js';
import Notification from '../models/Notification.js';

// @desc    Get public portfolio by username
// @route   GET /api/public/u/:username
export const getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ username: req.params.username, isPublic: true })
      .populate('resumeId')
      .populate('user', 'name email');
      
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found or private' });

    // Update Analytics asynchronously
    ProfileAnalytics.findOneAndUpdate(
      { portfolio: portfolio._id },
      { $inc: { totalViews: 1 }, $push: { viewsTimeline: { count: 1 } } },
      { upsert: true }
    ).exec();

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public resume by linkId
// @route   GET /api/public/resume/:linkId
export const getPublicResume = async (req, res) => {
  try {
    const link = await PublicLink.findOne({ linkId: req.params.linkId, isActive: true }).populate('resumeId');
    if (!link) return res.status(404).json({ message: 'Link invalid or expired' });

    // Update link views
    link.views += 1;
    await link.save();

    res.status(200).json(link.resumeId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send contact message to portfolio owner
// @route   POST /api/public/contact
export const sendMessage = async (req, res) => {
  try {
    const { portfolioId, senderName, senderEmail, company, message } = req.body;
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const newMsg = await ContactMessage.create({
      portfolio: portfolioId,
      owner: portfolio.user,
      senderName,
      senderEmail,
      company,
      message
    });

    // Create a notification for the owner
    await Notification.create({
      user: portfolio.user,
      title: 'New Recruiter Message',
      message: `${senderName} from ${company || 'a company'} sent you a message via your portfolio.`,
      type: 'Recruiter'
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
