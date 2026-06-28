import express from 'express';
import { getPublicPortfolio, getPublicResume, sendMessage } from '../controllers/publicController.js';

const router = express.Router();

// No auth protection needed here
router.get('/u/:username', getPublicPortfolio);
router.get('/resume/:linkId', getPublicResume);
router.post('/contact', sendMessage);

export default router;
