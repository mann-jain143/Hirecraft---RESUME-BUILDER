import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Portfolio from '../models/Portfolio.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Export all user account data
// @route   GET /api/users/export
export const exportAccountData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const resumes = await Resume.find({ user: req.user._id });
    const portfolio = await Portfolio.findOne({ user: req.user._id });

    const exportData = {
      account: user,
      resumes,
      portfolio,
      exportedAt: new Date().toISOString()
    };

    // Send an email confirmation (mock)
    await sendEmail({
      to: user.email,
      subject: 'Your HireCraft Data Export',
      text: 'You recently requested a backup of your account data. The export was successful.'
    });

    res.status(200).json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
