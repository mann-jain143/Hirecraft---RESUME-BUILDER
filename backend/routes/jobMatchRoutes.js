import express from 'express';
import { analyzeJobMatch } from '../controllers/jobMatchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/job-match/analyze
router.post('/analyze', protect, analyzeJobMatch);

export default router;
