import express from 'express';
import { getPortfolio, updatePortfolio, getAnalytics, generatePublicLink, getPublicLinks } from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPortfolio)
  .put(protect, updatePortfolio);

router.get('/analytics', protect, getAnalytics);
router.route('/links')
  .get(protect, getPublicLinks)
  .post(protect, generatePublicLink);

export default router;
