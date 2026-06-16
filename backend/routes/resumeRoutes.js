import express from 'express';
import {
  getResumes,
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  saveResume,
  getResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getResumes).post(protect, createResume);
router.post('/:id/duplicate', protect, duplicateResume);
router.route('/:id').get(protect, getResumeById).put(protect, updateResume).delete(protect, deleteResume);

export default router;
