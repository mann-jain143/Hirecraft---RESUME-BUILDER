import Job from '../models/Job.js';
import CompanyProfile from '../models/CompanyProfile.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';

// @desc    Get all open jobs
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).populate('company');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended jobs for user
// @route   GET /api/jobs/recommended
export const getRecommendedJobs = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    const userSkills = resume ? resume.skills.map(s => s.toLowerCase()) : [];
    
    let jobs = await Job.find({ status: 'open' }).populate('company');
    
    // Calculate Match Percentage based on skills overlap
    const scoredJobs = jobs.map(job => {
      const jobSkills = job.skills.map(s => s.toLowerCase());
      if (jobSkills.length === 0) return { ...job.toObject(), matchScore: 50 }; // Default if job has no skills defined
      
      const overlap = jobSkills.filter(s => userSkills.includes(s));
      const matchScore = Math.round((overlap.length / jobSkills.length) * 100);
      return { ...job.toObject(), matchScore };
    });

    // Sort by highest match score
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json(scoredJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job (Company only)
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    if (req.user.role !== 'company' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let company = await CompanyProfile.findOne({ user: req.user._id });
    if (!company) {
      // Create auto-profile for testing
      company = await CompanyProfile.create({
        user: req.user._id,
        companyName: req.body.companyName || 'Unknown Company'
      });
    }

    const job = await Job.create({
      ...req.body,
      company: company._id
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already applied' });
    }

    job.applicants.push(req.user._id);
    await job.save();

    // Reward gamification points
    const user = await User.findById(req.user._id);
    user.points += 10;
    
    // Check for "First Application" badge
    if (!user.badges.includes('First Application')) {
      user.badges.push('First Application');
    }
    await user.save();

    res.status(200).json({ message: 'Applied successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
