import express from 'express';
import {
  getSuperAdminStats,
  getUsers,
  getUserProfileInspection,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getResumes,
  deleteResume,
  restoreResume,
  getPortfolios,
  getAiUsageStats,
  getActivityLogs,
  getAuditLogs,
  generateAdminInvite,
  getAdminInvites,
  revokeAdminInvite,
} from '../controllers/superAdminController.js';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(superAdminOnly);

router.get('/stats', getSuperAdminStats);
router.get('/users', getUsers);
router.get('/users/:id/inspect', getUserProfileInspection);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/resumes', getResumes);
router.delete('/resumes/:id', deleteResume);
router.post('/resumes/:id/restore', restoreResume);

router.get('/portfolios', getPortfolios);
router.get('/ai-usage', getAiUsageStats);
router.get('/activities', getActivityLogs);
router.get('/audit-logs', getAuditLogs);

router.post('/invites/generate', generateAdminInvite);
router.get('/invites', getAdminInvites);
router.delete('/invites/:id', revokeAdminInvite);

export default router;
