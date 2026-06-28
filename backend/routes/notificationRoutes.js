import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications)
  .post(protect, createNotification);

router.put('/read-all', protect, markAllNotificationsRead);
router.put('/:id/read', protect, markNotificationRead);
router.delete('/:id', protect, deleteNotification);

export default router;
