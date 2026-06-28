import User from '../models/User.js';
import Resume from '../models/Resume.js';
import CoverLetter from '../models/CoverLetter.js';
import Portfolio from '../models/Portfolio.js';
import Application from '../models/Application.js';
import AiHistory from '../models/AiHistory.js';
import Notification from '../models/Notification.js';
import LoginHistory from '../models/LoginHistory.js';
import UserActivity from '../models/UserActivity.js';
import AdminLog from '../models/AdminLog.js';
import AdminInvite from '../models/AdminInvite.js';
import Subscription from '../models/Subscription.js';
import { logAdminAction } from '../utils/logger.js';
import { getUsers as getUnifiedUsers } from './adminController.js';
import crypto from 'crypto';
import os from 'os';

// @desc    Get dashboard metrics & system info
// @route   GET /api/super-admin/stats
export const getSuperAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      suspendedUsers,
      totalResumes,
      aiRequests,
      portfoliosCount,
      applicationsCount,
      activeSubsCount,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'suspended' }),
      Resume.countDocuments(),
      AiHistory.countDocuments(),
      Portfolio.countDocuments(),
      Application.countDocuments(),
      Subscription.countDocuments({ status: 'active' }),
    ]);
    const recruitersCount = 0;

    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      lastLoginDate: { $gte: thirtyDaysAgo },
    });

    // Server health details
    const serverUptime = Math.floor(os.uptime());
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

    const systemStatus = {
      serverStatus: 'Healthy',
      databaseStatus: 'Connected',
      apiHealth: 'Optimal',
      aiStatus: 'Online',
      uptime: `${Math.floor(serverUptime / 3600)}h ${Math.floor((serverUptime % 3600) / 60)}m`,
      memoryUsage: `${usedMemPercent}% of ${Math.round(totalMem / (1024 * 1024 * 1024))}GB`,
      cpuCount: os.cpus().length,
      platform: os.platform(),
    };

    // Monthly signups and AI requests for charts (last 6 months)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date();
      startOfMonth.setMonth(startOfMonth.getMonth() - i, 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      const monthName = startOfMonth.toLocaleString('default', { month: 'short' });

      const [monthSignups, monthAi] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
        AiHistory.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      ]);

      chartData.push({
        month: monthName,
        signups: monthSignups,
        aiRequests: monthAi,
      });
    }

    res.status(200).json({
      totalUsers,
      suspendedUsers,
      activeUsers,
      totalResumes,
      aiRequests,
      recruitersCount,
      portfoliosCount,
      applicationsCount,
      activeSubsCount,
      systemStatus,
      chartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with filters and search (unified delegation)
// @route   GET /api/super-admin/users
export const getUsers = getUnifiedUsers;

// @desc    Get detailed profile view of any user
// @route   GET /api/super-admin/users/:id/inspect
export const getUserProfileInspection = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [
      resumes,
      coverLetters,
      portfolios,
      applications,
      aiHistory,
      notifications,
      loginHistory,
      userActivity,
    ] = await Promise.all([
      Resume.find({ user: userId }).sort({ updatedAt: -1 }),
      CoverLetter.find({ user: userId }).sort({ updatedAt: -1 }),
      Portfolio.find({ user: userId }),
      Application.find({ user: userId }).sort({ createdAt: -1 }),
      AiHistory.find({ user: userId }).sort({ createdAt: -1 }),
      Notification.find({ recipient: userId }).sort({ createdAt: -1 }),
      LoginHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(25),
      UserActivity.find({ user: userId }).sort({ createdAt: -1 }).limit(50),
    ]);

    res.status(200).json({
      user,
      resumes,
      coverLetters,
      portfolios,
      applications,
      aiHistory,
      notifications,
      loginHistory,
      userActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change user status (Suspend, Ban, Activate)
// @route   PATCH /api/super-admin/users/:id/status
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.realRole === 'SUPER_ADMIN' || user.role === 'SUPER_ADMIN') {
      return res.status(400).json({ message: 'Cannot modify Super Admin status' });
    }

    const oldStatus = user.status;
    user.status = status;
    await user.save({ validateBeforeSave: false });

    await logAdminAction(
      req.user._id,
      `USER_STATUS_${status.toUpperCase()}`,
      user._id,
      'User',
      user._id.toString(),
      `Changed user status from ${oldStatus} to ${status}`,
      req.ip
    );

    res.status(200).json({ message: `User status set to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promote or downgrade a user's role
// @route   PATCH /api/super-admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ['USER', 'ADMIN'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ message: 'Invalid role update selection. Only USER and ADMIN roles can be modified here.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.realRole === 'SUPER_ADMIN' || user.role === 'SUPER_ADMIN') {
      return res.status(400).json({ message: 'Cannot modify a Super Admin role configuration' });
    }

    const oldRole = user.role;
    user.role = role;
    user.realRole = role;
    user.viewMode = role;
    await user.save({ validateBeforeSave: false });

    await logAdminAction(
      req.user._id,
      'USER_ROLE_UPDATE',
      user._id,
      'User',
      user._id.toString(),
      `Promoted/Downgraded user from ${oldRole} to ${role}`,
      req.ip
    );

    res.status(200).json({ message: `Role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user completely from database
// @route   DELETE /api/super-admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.realRole === 'SUPER_ADMIN' || user.role === 'SUPER_ADMIN') {
      return res.status(400).json({ message: 'Cannot delete Super Admin account' });
    }

    await user.deleteOne();

    await logAdminAction(
      req.user._id,
      'USER_DELETE',
      req.params.id,
      'User',
      req.params.id,
      `Permanently deleted user: ${user.email}`,
      req.ip
    );

    res.status(200).json({ message: 'User permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resumes in the system
// @route   GET /api/super-admin/resumes
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find()
      .populate('user', 'name email role')
      .sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft-delete a resume
// @route   DELETE /api/super-admin/resumes/:id
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    resume.isDeleted = true;
    await resume.save();

    await logAdminAction(
      req.user._id,
      'RESUME_SOFT_DELETE',
      resume.user,
      'Resume',
      resume._id.toString(),
      `Soft-deleted resume: ${resume.title}`,
      req.ip
    );

    res.status(200).json({ message: 'Resume soft-deleted', resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Restore a soft-deleted resume
// @route   POST /api/super-admin/resumes/:id/restore
export const restoreResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    resume.isDeleted = false;
    await resume.save();

    await logAdminAction(
      req.user._id,
      'RESUME_RESTORE',
      resume.user,
      'Resume',
      resume._id.toString(),
      `Restored resume: ${resume.title}`,
      req.ip
    );

    res.status(200).json({ message: 'Resume restored', resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get portfolios list
// @route   GET /api/super-admin/portfolios
export const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI metrics & activity logs
// @route   GET /api/super-admin/ai-usage
export const getAiUsageStats = async (req, res) => {
  try {
    const totalAiRequests = await AiHistory.countDocuments();

    // Most active AI users (aggregate)
    const mostActive = await AiHistory.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
        },
      },
    ]);

    const history = await AiHistory.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      totalAiRequests,
      mostActive,
      history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity logs
// @route   GET /api/super-admin/activities
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await UserActivity.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin audit logs
// @route   GET /api/super-admin/audit-logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate('admin', 'name email role')
      .populate('targetUser', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate new invite token for Admin/Recruiter
// @route   POST /api/super-admin/invites/generate
export const generateAdminInvite = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!['ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Role must be ADMIN' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours validity

    const invite = await AdminInvite.create({
      token,
      email: email ? email.toLowerCase() : undefined,
      role,
      expiresAt,
      createdBy: req.user._id,
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const inviteUrl = `${clientUrl}/admin/invite/${token}`;

    await logAdminAction(
      req.user._id,
      'INVITE_CREATE',
      null,
      'AdminInvite',
      invite._id.toString(),
      `Generated invite for role ${role} targeting ${email || 'any email'}`,
      req.ip
    );

    res.status(200).json({
      invite,
      inviteUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active/used invites
// @route   GET /api/super-admin/invites
export const getAdminInvites = async (req, res) => {
  try {
    const invites = await AdminInvite.find()
      .populate('createdBy', 'name email')
      .populate('usedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revoke/delete an invite
// @route   DELETE /api/super-admin/invites/:id
export const revokeAdminInvite = async (req, res) => {
  try {
    const invite = await AdminInvite.findById(req.params.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    await invite.deleteOne();

    await logAdminAction(
      req.user._id,
      'INVITE_REVOKE',
      null,
      'AdminInvite',
      req.params.id,
      `Revoked invite token: ${invite.token}`,
      req.ip
    );

    res.status(200).json({ message: 'Invite revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
