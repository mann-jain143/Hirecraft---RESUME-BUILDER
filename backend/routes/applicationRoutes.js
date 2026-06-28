import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication
} from '../controllers/applicationController.js';

const router = express.Router();

router.route('/')
  .get(protect, getApplications)
  .post(protect, createApplication);

router.route('/:id')
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

export default router;
