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
  getPublicResume,
  downloadPublicResume,
  submitRecruiterFeedback,
  toggleRecruiterShortlist,
  updateShareSettings,
  getPublicPortfolio,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for recruiter views
router.get('/public/:shareId', getPublicResume);
router.post('/public/:shareId/download', downloadPublicResume);
router.post('/public/:shareId/feedback', submitRecruiterFeedback);
router.post('/public/:shareId/shortlist', toggleRecruiterShortlist);
router.get('/portfolio/:username', getPublicPortfolio);

// Protected routes
router.route('/').get(protect, getResumes).post(protect, createResume);
router.post('/:id/duplicate', protect, duplicateResume);
router.put('/:id/share-settings', protect, updateShareSettings);
router.route('/:id').get(protect, getResumeById).put(protect, updateResume).delete(protect, deleteResume);

export default router;
