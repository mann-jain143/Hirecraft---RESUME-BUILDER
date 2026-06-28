import express from 'express';
import { getJobs, getRecommendedJobs, createJob, applyToJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/recommended', protect, getRecommendedJobs);
router.post('/', protect, createJob);
router.post('/:id/apply', protect, applyToJob);

export default router;
