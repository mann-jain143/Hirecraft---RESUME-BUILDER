import express from 'express';
import { parseResume } from '../controllers/resumeParserController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// POST /api/resume-parser/parse
// upload.single('resume') expects a single file upload with field name 'resume'
router.post('/parse', protect, upload.single('resume'), parseResume);

export default router;
