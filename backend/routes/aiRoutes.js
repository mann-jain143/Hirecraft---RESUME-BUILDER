import express from 'express';
import { generateSummary, generateBullets } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-summary', generateSummary);
router.post('/generate-bullets', generateBullets);

export default router;