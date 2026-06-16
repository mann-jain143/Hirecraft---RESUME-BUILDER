import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import { saveResume, getResume } from './controllers/resumeController.js';
import { protect } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'HireCraft API is running smoothly. 🚀' 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Legacy single-resume endpoints
const legacyResumeRouter = express.Router();
legacyResumeRouter.post('/', protect, saveResume);
legacyResumeRouter.get('/', protect, getResume);
app.use('/api/resume', legacyResumeRouter);

app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
});