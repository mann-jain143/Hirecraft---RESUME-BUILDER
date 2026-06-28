import express from 'express';
import {
  generateSummary,
  generateBullets,
  improveText,
  optimizeLinkedIn,
  generateInterviewQuestions,
  handleChat,
  getChatHistory,
  evaluateMockInterview,
  analyzeSkillGap,
  generateRoadmap,
  generateProjects,
  generateAchievement
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-summary', protect, generateSummary);
router.post('/generate-bullets', protect, generateBullets);
router.post('/improve', protect, improveText);
router.post('/optimize-linkedin', protect, optimizeLinkedIn);
router.post('/interview-questions', protect, generateInterviewQuestions);
router.get('/chat/history', protect, getChatHistory);
router.post('/chat', protect, handleChat);
router.post('/mock', protect, evaluateMockInterview);
router.post('/skills', protect, analyzeSkillGap);
router.post('/roadmap', protect, generateRoadmap);
router.post('/projects', protect, generateProjects);
router.post('/achievement', protect, generateAchievement);

export default router;