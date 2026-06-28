import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { bootstrapSuperAdmins } from './utils/bootstrapAdmins.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import coverLetterRoutes from './routes/coverLetterRoutes.js';
import jobMatchRoutes from './routes/jobMatchRoutes.js';
import resumeParserRoutes from './routes/resumeParserRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import placementPrepRoutes from './routes/placementPrepRoutes.js';
import { saveResume, getResume } from './controllers/resumeController.js';
import { protect } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(() => bootstrapSuperAdmins());

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// General Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'HireCraftt API is running smoothly. 🚀' 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/job-match', jobMatchRoutes);
app.use('/api/resume-parser', resumeParserRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/placement-prep', placementPrepRoutes);

// Legacy single-resume endpoints
const legacyResumeRouter = express.Router();
legacyResumeRouter.post('/', protect, saveResume);
legacyResumeRouter.get('/', protect, getResume);
app.use('/api/resume', legacyResumeRouter);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
}); 
 
