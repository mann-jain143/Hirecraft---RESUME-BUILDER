import express from 'express';
import { getUserStats, updateUserProfile, switchRole, deleteUserAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { exportAccountData } from '../controllers/exportController.js';

const router = express.Router();

router.get('/dashboard-stats', protect, getUserStats);
router.put('/profile', protect, updateUserProfile);
router.put('/switch-role', protect, switchRole);
router.get('/export', protect, exportAccountData);
router.delete('/delete-account', protect, deleteUserAccount);

export default router;
