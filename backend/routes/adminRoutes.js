import express from 'express';
import { getAdminStats, getUsers, deleteUser, updateUserRole, getRecentActivity } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.get('/activity', getRecentActivity);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
