import express from 'express';
import { 
  generateCoverLetter, 
  getCoverLetters, 
  saveCoverLetter, 
  updateCoverLetter, 
  deleteCoverLetter 
} from '../controllers/coverLetterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/cover-letter/generate
router.post('/generate', protect, generateCoverLetter);

router.route('/')
  .get(protect, getCoverLetters);

router.post('/save', protect, saveCoverLetter);

router.route('/:id')
  .put(protect, updateCoverLetter)
  .delete(protect, deleteCoverLetter);

export default router;
