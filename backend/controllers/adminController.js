import User from '../models/User.js';
import Resume from '../models/Resume.js';
import AuditLog from '../models/AuditLog.js';
import Subscription from '../models/Subscription.js';
import AiHistory from '../models/AiHistory.js';
import ActivityLog from '../models/ActivityLog.js';
import CoverLetter from '../models/CoverLetter.js';
import Application from '../models/Application.js';

// Helper to query all global statistics to ensure absolute alignment
const queryGlobalMetrics = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    verifiedUsers,
    premiumUsers,
    adminsCount,
    superAdminsCount,
    activeToday,
    newThisWeek,
    resumesCreated,
    aiRequests,
    applicationsCount,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ onboardingCompleted: true }),
    Subscription.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'ADMIN' }),
    User.countDocuments({ role: 'SUPER_ADMIN' }),
    User.countDocuments({ lastLoginDate: { $gte: startOfToday } }),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Resume.countDocuments(),
    AiHistory.countDocuments(),
    Application.countDocuments(),
  ]);

  return {
    totalUsers,
    verifiedUsers,
    premiumUsers,
    adminsCount,
    superAdminsCount,
    activeToday,
    newThisWeek,
    resumesCreated,
    aiRequests,
    applicationsCount,
  };
};

/**
 * @desc    Get dashboard metrics & charts for admin
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res) => {
  try {
    const globalStats = await queryGlobalMetrics();
    const recentSignups = await User.find().sort({ createdAt: -1 }).limit(6).select('createdAt');

    // Compile growth chart (last 6 signups)
    const growthChart = recentSignups.reverse().map((u, i) => ({
      name: `W${i + 1}`,
      users: globalStats.totalUsers - (recentSignups.length - i - 1),
      aiOps: Math.floor(globalStats.aiRequests / 6) + i * 3,
    }));

    res.status(200).json({
      ...globalStats,
      revenue: globalStats.premiumUsers * 15,
      history: growthChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all users with search, filter, pagination, and dynamic metrics
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const { search, role, status, isPremium, activeToday, recentlyJoined, page = 1, limit = 10 } = req.query;

    const findQuery = {};

    // 1. Search name, email, or username (portfolioUsername)
    if (search) {
      const regex = new RegExp(search, 'i');
      findQuery.$or = [
        { name: regex },
        { email: regex },
        { portfolioUsername: regex }
      ];
    }

    // 2. Role Filter
    if (role) {
      findQuery.role = role;
    }

    // 3. Status Filter
    if (status) {
      findQuery.status = status;
    }

    // 4. Premium Filter
    if (isPremium === 'true') {
      const activeSubs = await Subscription.find({ status: 'active' }).select('user');
      const premiumUserIds = activeSubs.map(s => s.user);
      findQuery._id = { $in: premiumUserIds };
    }

    // 5. Active Today Filter
    if (activeToday === 'true') {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      findQuery.lastLoginDate = { $gte: startOfToday };
    }

    // 6. Recently Joined Filter
    if (recentlyJoined === 'true') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      findQuery.createdAt = { $gte: sevenDaysAgo };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Retrieve matching user documents
    const totalMatching = await User.countDocuments(findQuery);
    const users = await User.find(findQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Dynamic metrics aggregation per user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;

        const [resumes, appCount, aiCount, coverLetters] = await Promise.all([
          Resume.find({ user: userId }),
          Application.countDocuments({ user: userId }),
          AiHistory.countDocuments({ user: userId }),
          CoverLetter.find({ user: userId }),
        ]);

        // Calculate storage used (in KB) based on JSON stringified schemas
        let storageSize = 0;
        resumes.forEach(r => {
          storageSize += JSON.stringify(r.resumeData || {}).length;
        });
        coverLetters.forEach(c => {
          storageSize += JSON.stringify(c.content || '').length;
        });
        const storageUsed = `${(storageSize / 1024).toFixed(2)} KB`;

        // Calculate Average ATS score
        const avgAtsScore = resumes.length > 0
          ? Math.round(resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / resumes.length)
          : 0;

        // Online status indicator (login in last 10 minutes)
        const isOnline = user.lastLoginDate && (Date.now() - new Date(user.lastLoginDate).getTime() < 10 * 60 * 1000);

        // Fetch isPremium flag
        const sub = await Subscription.findOne({ user: userId, status: 'active' });

        return {
          ...user.toObject(),
          totalResumes: resumes.length,
          avgAtsScore,
          applicationsCount: appCount,
          aiUsageCount: aiCount,
          storageUsed,
          isOnline: !!isOnline,
          isPremium: !!sub,
        };
      })
    );

    // Query global metrics for synchronizing cards
    const globalStats = await queryGlobalMetrics();

    res.status(200).json({
      users: usersWithStats,
      total: totalMatching,
      pages: Math.ceil(totalMatching / limitNum),
      stats: globalStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Admin role modification route placeholder (Only Super Admin can do this)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res) => {
  return res.status(403).json({ message: 'Forbidden. Only Super Admins can manage user roles.' });
};

/**
 * @desc    Get platform logs / recent operations
 * @route   GET /api/admin/activity
 * @access  Private/Admin
 */
export const getRecentActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.deleteOne();
    await AuditLog.create({
      user: req.user._id,
      action: 'DELETED_USER',
      resourceId: req.params.id,
    });

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
