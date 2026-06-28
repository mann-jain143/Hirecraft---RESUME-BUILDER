import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  generateQuestions,
  saveSessionResult,
  getStats,
  toggleBookmark,
  getBookmarks,
  getDailyChallenge,
  completeDailyChallenge,
  getLeaderboard,
} from '../controllers/placementPrepController.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateQuestions);
router.post('/save-result', saveSessionResult);
router.get('/stats', getStats);
router.post('/bookmark', toggleBookmark);
router.get('/bookmarks', getBookmarks);
router.get('/daily-challenge', getDailyChallenge);
router.post('/daily-challenge/complete', completeDailyChallenge);
router.get('/leaderboard', getLeaderboard);

export default router;
