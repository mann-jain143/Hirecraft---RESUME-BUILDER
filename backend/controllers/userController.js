import User from '../models/User.js';
import Resume from '../models/Resume.js';
import ActivityLog from '../models/ActivityLog.js';
import AiHistory from '../models/AiHistory.js';

const DAILY_TIPS = [
  { category: 'Resume Tip', tip: 'Start each bullet point with a strong action verb (e.g., "Led", "Optimised", "Designed") rather than passive phrases like "Responsible for".' },
  { category: 'ATS Advice', tip: 'Avoid placing vital text in structural headers, footers, or float text boxes. ATS scanners often bypass them completely.' },
  { category: 'Interview Tip', tip: 'Use the STAR method (Situation, Task, Action, Result) to structure behavioral answers in 2 minutes or less.' },
  { category: 'AI Tip', tip: 'Leverage our AI Polish tool to suggest phrasing, but make sure to input key metrics to reflect your real-world achievements.' },
  { category: 'Resume Tip', tip: 'Quantify your accomplishments! Instead of saying "improved load times," write "reduced API response latency by 40%."' },
  { category: 'LinkedIn Optimization', tip: 'Your LinkedIn headline shouldn\'t just be your job title. Add your value proposition (e.g., "Cloud Architect | Scaling Microservices").' },
  { category: 'Career Advice', tip: 'Align your resume skills section directly to keywords used in the job description to bypass automated recruiters.' }
];

// @desc    Get user dashboard stats & widgets
// @route   GET /api/users/dashboard-stats
export const getUserStats = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    const aiCount = await AiHistory.countDocuments({ user: req.user._id });
    const globalLogs = await ActivityLog.find({ user: req.user._id }).populate('resumeId', 'title').sort({ createdAt: -1 }).limit(10);
    
    // 1. Calculate general counters
    const totalResumes = resumes.length;
    let totalViews = 0;
    let totalDownloads = 0;
    let totalAtsScore = 0;
    let resumesWithAts = 0;
    let aiUsage = aiCount;

    const allAtsScores = [];
    const allActivities = [];

    resumes.forEach((resume) => {
      // Sharing stats
      if (resume.sharing) {
        totalViews += resume.sharing.views || 0;
        totalDownloads += resume.sharing.downloads || 0;
      }

      // ATS score stats
      const atsScore = resume.resumeData?.settings?.atsScore || 0;
      if (atsScore > 0) {
        totalAtsScore += atsScore;
        resumesWithAts += 1;
      }

      // Accumulate ATS history for charts
      if (resume.atsHistory && resume.atsHistory.length > 0) {
        resume.atsHistory.forEach((hist) => {
          allAtsScores.push({
            score: hist.score,
            date: hist.date,
            title: resume.title
          });
        });
      }
    });

    // Merge global logs with legacy resume logs
    globalLogs.forEach((log) => {
      allActivities.push({
        action: log.action + (log.details ? `: ${log.details}` : ''),
        timestamp: log.createdAt,
        resumeTitle: log.resumeId ? log.resumeId.title : 'Global'
      });
    });

    const avgAtsScore = resumesWithAts > 0 ? Math.round(totalAtsScore / resumesWithAts) : 0;

    // 2. Daily Tip
    const tipIndex = new Date().getDate() % DAILY_TIPS.length;
    const dailyTip = DAILY_TIPS[tipIndex];

    // 3. Process Achievements (Unlock badges dynamically if rules are met)
    const user = await User.findById(req.user._id);
    const currentAchievements = [...(user.achievements || [])];
    let updated = false;

    if (totalResumes > 0 && !currentAchievements.includes('First Resume')) {
      currentAchievements.push('First Resume');
      updated = true;
    }
    if (totalViews > 0 && !currentAchievements.includes('Resume Shared')) {
      currentAchievements.push('Resume Shared');
      updated = true;
    }
    if (totalDownloads > 0 && !currentAchievements.includes('First Download')) {
      currentAchievements.push('First Download');
      updated = true;
    }
    if (user.portfolioUsername && !currentAchievements.includes('Portfolio Created')) {
      currentAchievements.push('Portfolio Created');
      updated = true;
    }
    
    // Check if any resume has an ATS score >= 90
    const hasAts90 = resumes.some(r => (r.resumeData?.settings?.atsScore || 0) >= 90);
    if (hasAts90 && !currentAchievements.includes('ATS 90+')) {
      currentAchievements.push('ATS 90+');
      updated = true;
    }

    if (updated) {
      user.achievements = currentAchievements;
      await user.save();
    }

    // 4. Default mock data points if user has no ATS score history yet, to render rich line charts
    const atsChartData = allAtsScores.length > 0 
      ? allAtsScores.sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-10)
      : [
          { score: 65, date: new Date(Date.now() - 30*24*60*60*1000) },
          { score: 72, date: new Date(Date.now() - 20*24*60*60*1000) },
          { score: 78, date: new Date(Date.now() - 10*24*60*60*1000) },
          { score: avgAtsScore > 0 ? avgAtsScore : 84, date: new Date() }
        ];

    // 5. Activity Timeline
    const activityTimeline = allActivities.length > 0
      ? allActivities.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)
      : [
          { action: 'Created New Resume', timestamp: user.createdAt, resumeTitle: 'Main CV' }
        ];

    res.status(200).json({
      stats: {
        totalResumes,
        avgAtsScore,
        totalViews,
        totalDownloads,
        aiUsage,
      },
      dailyTip,
      achievements: currentAchievements,
      atsChartData,
      activityTimeline,
      onboardingCompleted: user.onboardingCompleted,
      portfolioUsername: user.portfolioUsername,
      portfolioTheme: user.portfolioTheme,
      points: user.points,
      currentStreak: user.currentStreak,
      careerField: user.careerField
    });
  } catch (error) {
    console.error('Get User Stats Error:', error);
    res.status(500).json({ message: 'Failed to aggregate dashboard analytics' });
  }
};

// @desc    Update user profile configurations (onboarding, portfolio, theme)
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { 
      onboardingCompleted, 
      careerField, 
      portfolioUsername, 
      portfolioTheme,
      profilePicture,
      coverImage,
      education,
      skills,
      socialLinks,
      name,
      phone
    } = req.body;

    if (onboardingCompleted !== undefined) user.onboardingCompleted = onboardingCompleted;
    if (careerField !== undefined) user.careerField = careerField;
    if (portfolioTheme !== undefined) user.portfolioTheme = portfolioTheme;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (coverImage !== undefined) user.coverImage = coverImage;
    if (education !== undefined) user.education = education;
    if (skills !== undefined) user.skills = skills;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (portfolioUsername !== undefined && portfolioUsername !== user.portfolioUsername) {
      // Validate unique username
      if (portfolioUsername.trim().length > 0) {
        const existing = await User.findOne({ portfolioUsername: portfolioUsername.toLowerCase().trim() });
        if (existing && existing._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: 'Portfolio username is already taken' });
        }
        user.portfolioUsername = portfolioUsername.toLowerCase().trim();
      } else {
        user.portfolioUsername = undefined;
      }
    }

    if (req.body.password !== undefined && req.body.password.trim().length > 0) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      onboardingCompleted: updatedUser.onboardingCompleted,
      careerField: updatedUser.careerField,
      portfolioUsername: updatedUser.portfolioUsername,
      portfolioTheme: updatedUser.portfolioTheme,
      achievements: updatedUser.achievements,
      profilePicture: updatedUser.profilePicture,
      coverImage: updatedUser.coverImage,
      phone: updatedUser.phone,
      education: updatedUser.education,
      skills: updatedUser.skills,
      socialLinks: updatedUser.socialLinks
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

// @desc    Switch virtual viewMode for impersonation (Super Admin only)
// @route   PUT /api/users/switch-role
export const switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify realRole is SUPER_ADMIN
    if (user.realRole !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Only Super Admin can switch workspaces' });
    }

    user.viewMode = role;
    // CRITICAL: Keep user.role and user.realRole as SUPER_ADMIN.
    user.role = 'SUPER_ADMIN';
    user.realRole = 'SUPER_ADMIN';
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: `Switched workspace to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        realRole: user.realRole,
        viewMode: user.viewMode,
        points: user.points,
        badges: user.badges,
        onboardingCompleted: user.onboardingCompleted,
        careerField: user.careerField,
        portfolioUsername: user.portfolioUsername,
        profilePicture: user.profilePicture,
        coverImage: user.coverImage,
      }
    });
  } catch (error) {
    console.error('Switch Role Error:', error);
    res.status(500).json({ message: 'Failed to switch workspace' });
  }
};

// @desc    Self delete user account
// @route   DELETE /api/users/delete-account
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await Resume.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};
