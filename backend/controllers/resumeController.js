import Resume from '../models/Resume.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const deriveTitle = (resumeData, fallback = 'Untitled Resume') => {
  const name = resumeData?.personalInfo?.fullName?.trim();
  const job = resumeData?.personalInfo?.jobTitle?.trim();
  if (name && job) return `${name} — ${job}`;
  if (name) return name;
  if (job) return job;
  return fallback;
};

const calculateAtsScore = (resumeData) => {
  if (!resumeData) return 0;
  let score = 0;
  
  if (resumeData.personalInfo?.fullName) score += 5;
  if (resumeData.personalInfo?.email) score += 5;
  if (resumeData.personalInfo?.phone) score += 5;
  
  if (resumeData.summary && resumeData.summary.length > 50) score += 10;
  else if (resumeData.summary) score += 5;
  
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += Math.min(20, resumeData.experience.length * 10);
    let bulletCount = 0;
    resumeData.experience.forEach(exp => {
      if (exp.description && exp.description.length > 20) bulletCount++;
      if (exp.bullets && exp.bullets.length > 0) bulletCount += exp.bullets.length;
    });
    score += Math.min(20, bulletCount * 5);
  }
  
  if (resumeData.education && resumeData.education.length > 0) score += 15;
  
  if (resumeData.skills && resumeData.skills.length > 0) {
    score += Math.min(20, resumeData.skills.length * 2);
  }
  
  return Math.min(100, score);
};

const assertOwnership = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) return { error: { status: 404, message: 'Resume not found' } };
  if (resume.user.toString() !== userId.toString()) {
    return { error: { status: 403, message: 'Not authorized to access this resume' } };
  }
  return { resume };
};

// @desc    List all resumes for logged-in user
// @route   GET /api/resumes
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('title resumeData.settings resumeData.personalInfo updatedAt createdAt')
      .sort({ updatedAt: -1 });

    res.status(200).json(resumes);
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({ message: 'Server Error while fetching resumes' });
  }
};

// @desc    Create a new resume
export const createResume = async (req, res) => {
  try {
    const { resumeData, title } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: 'resumeData is required' });
    }

    if (!resumeData.settings) resumeData.settings = {};
    resumeData.settings.atsScore = calculateAtsScore(resumeData);

    const resume = await Resume.create({
      user: req.user._id,
      title: title || deriveTitle(resumeData),
      resumeData,
      activityLog: [{ action: 'Created Resume', timestamp: new Date() }]
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Resume Created',
      resumeId: resume._id
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Create Resume Error:', error);
    res.status(500).json({ message: 'Server Error while creating resume' });
  }
};

// @desc    Get single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const { resume, error } = await assertOwnership(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    res.status(200).json(resume);
  } catch (error) {
    console.error('Get Resume Error:', error);
    res.status(500).json({ message: 'Server Error while fetching resume' });
  }
};

// @desc    Update resume by ID
export const updateResume = async (req, res) => {
  try {
    const { resumeData, title } = req.body;
    const { resume, error } = await assertOwnership(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    let isUpdated = false;
    if (resumeData) {
      if (!resumeData.settings) resumeData.settings = {};
      resumeData.settings.atsScore = calculateAtsScore(resumeData);
      resume.resumeData = resumeData;
      isUpdated = true;

      // Track ATS history if score is updated
      const currentScore = resumeData.settings?.atsScore || 0;
      if (currentScore > 0) {
        const lastHistory = resume.atsHistory?.[resume.atsHistory.length - 1];
        if (!lastHistory || lastHistory.score !== currentScore) {
          resume.atsHistory.push({ score: currentScore, date: new Date() });
          resume.activityLog.push({ action: `ATS Score improved to ${currentScore}%`, timestamp: new Date() });
        }
      }
    }
    if (title && resume.title !== title) {
      resume.title = title;
      isUpdated = true;
    } else if (resumeData) {
      const newTitle = deriveTitle(resumeData, resume.title);
      if (resume.title !== newTitle) {
        resume.title = newTitle;
        isUpdated = true;
      }
    }

    if (isUpdated) {
      resume.activityLog.push({ action: 'Updated content', timestamp: new Date() });
      await ActivityLog.create({
        user: req.user._id,
        action: 'Resume Edited',
        resumeId: resume._id
      });
    }

    const updated = await resume.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500).json({ message: 'Server Error while updating resume' });
  }
};

// @desc    Delete resume by ID
export const deleteResume = async (req, res) => {
  try {
    const { resume, error } = await assertOwnership(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    await resume.deleteOne();
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({ message: 'Server Error while deleting resume' });
  }
};

// @desc    Duplicate a resume
export const duplicateResume = async (req, res) => {
  try {
    const { resume, error } = await assertOwnership(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const copy = await Resume.create({
      user: req.user._id,
      title: `${resume.title} (Copy)`,
      resumeData: JSON.parse(JSON.stringify(resume.resumeData)),
      activityLog: [{ action: `Duplicated from ${resume.title}`, timestamp: new Date() }]
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Resume Duplicated',
      details: `From ${resume.title}`,
      resumeId: copy._id
    });

    res.status(201).json(copy);
  } catch (error) {
    console.error('Duplicate Resume Error:', error);
    res.status(500).json({ message: 'Server Error while duplicating resume' });
  }
};

// Legacy single-resume endpoints (backward compat)
export const saveResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    if (resumeData) {
      if (!resumeData.settings) resumeData.settings = {};
      resumeData.settings.atsScore = calculateAtsScore(resumeData);
    }
    
    let resume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    if (resume) {
      resume.resumeData = resumeData;
      resume.title = deriveTitle(resumeData, resume.title);
      resume.activityLog.push({ action: 'Updated resume details', timestamp: new Date() });
      const updated = await resume.save();
      return res.status(200).json(updated);
    }

    resume = await Resume.create({
      user: req.user._id,
      title: deriveTitle(resumeData),
      resumeData,
      activityLog: [{ action: 'Created Resume', timestamp: new Date() }]
    });
    res.status(201).json(resume);
  } catch (error) {
    console.error('Save Resume Error:', error);
    res.status(500).json({ message: 'Server Error while saving resume' });
  }
};

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    if (resume) res.status(200).json(resume);
    else res.status(404).json({ message: 'No resume found' });
  } catch (error) {
    console.error('Get Resume Error:', error);
    res.status(500).json({ message: 'Server Error while fetching resume' });
  }
};

// @desc    Get public resume by shareId (recruiter view)
export const getPublicResume = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { password } = req.query;

    const resume = await Resume.findOne({ 'sharing.shareId': shareId, 'sharing.isShared': true });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found or not shared publicly' });
    }

    // Check expiration
    if (resume.sharing.expiresAt && new Date(resume.sharing.expiresAt) < new Date()) {
      return res.status(410).json({ message: 'This sharing link has expired' });
    }

    // Check password protection
    if (resume.sharing.password && resume.sharing.password.trim() !== '') {
      if (!password || password !== resume.sharing.password) {
        return res.status(200).json({ passwordRequired: true });
      }
    }

    // Log Analytics (view & unique visitor)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    
    if (!resume.sharing.uniqueVisitors.includes(ip)) {
      resume.sharing.uniqueVisitors.push(ip);
    }
    resume.sharing.views = (resume.sharing.views || 0) + 1;
    
    resume.activityLog.push({
      action: `Viewed by Recruiter`,
      timestamp: new Date()
    });

    await resume.save();

    res.status(200).json({
      _id: resume._id,
      title: resume.title,
      resumeData: resume.resumeData,
      sharing: {
        isShared: resume.sharing.isShared,
        shareId: resume.sharing.shareId,
        expiresAt: resume.sharing.expiresAt,
        shortlisted: resume.sharing.shortlisted,
        feedback: resume.sharing.feedback
      }
    });
  } catch (error) {
    console.error('Get Public Resume Error:', error);
    res.status(500).json({ message: 'Server error loading shared resume' });
  }
};

// @desc    Log public resume download
export const downloadPublicResume = async (req, res) => {
  try {
    const { shareId } = req.params;
    const resume = await Resume.findOne({ 'sharing.shareId': shareId, 'sharing.isShared': true });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    resume.sharing.downloads = (resume.sharing.downloads || 0) + 1;
    resume.activityLog.push({
      action: 'Downloaded PDF',
      timestamp: new Date()
    });

    await resume.save();
    res.status(200).json({ message: 'Download logged successfully', downloads: resume.sharing.downloads });
  } catch (error) {
    console.error('Download Log Error:', error);
    res.status(500).json({ message: 'Failed to log download' });
  }
};

// @desc    Submit feedback on public resume
export const submitRecruiterFeedback = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { recruiterName, comment, rating } = req.body;

    if (!recruiterName || !comment || !rating) {
      return res.status(400).json({ message: 'Please provide recruiterName, comment and rating' });
    }

    const resume = await Resume.findOne({ 'sharing.shareId': shareId, 'sharing.isShared': true });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    resume.sharing.feedback.push({ recruiterName, comment, rating: Number(rating) });
    resume.activityLog.push({
      action: `Received feedback from ${recruiterName} (${rating}⭐)`,
      timestamp: new Date()
    });

    await resume.save();
    res.status(201).json(resume.sharing.feedback);
  } catch (error) {
    console.error('Feedback Error:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

// @desc    Toggle recruiter shortlist status
export const toggleRecruiterShortlist = async (req, res) => {
  try {
    const { shareId } = req.params;
    const resume = await Resume.findOne({ 'sharing.shareId': shareId, 'sharing.isShared': true });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    resume.sharing.shortlisted = !resume.sharing.shortlisted;
    const status = resume.sharing.shortlisted ? 'Shortlisted by Recruiter' : 'Removed from shortlist';
    resume.activityLog.push({
      action: status,
      timestamp: new Date()
    });

    await resume.save();
    res.status(200).json({ shortlisted: resume.sharing.shortlisted });
  } catch (error) {
    console.error('Shortlist Toggle Error:', error);
    res.status(500).json({ message: 'Failed to toggle shortlist status' });
  }
};

// @desc    Update share settings for a resume
export const updateShareSettings = async (req, res) => {
  try {
    const { isShared, password, expiresAt } = req.body;
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!resume.sharing) {
      resume.sharing = { isShared: false, password: '', expiresAt: null };
    }

    resume.sharing.isShared = isShared !== undefined ? isShared : resume.sharing.isShared;
    resume.sharing.password = password !== undefined ? password : resume.sharing.password;
    resume.sharing.expiresAt = expiresAt !== undefined ? expiresAt : resume.sharing.expiresAt;

    if (resume.sharing.isShared && !resume.sharing.shareId) {
      resume.sharing.shareId = Math.random().toString(36).substring(2, 10);
      resume.activityLog.push({
        action: 'Public sharing link enabled',
        timestamp: new Date()
      });
    } else if (!resume.sharing.isShared && resume.sharing.shareId) {
      resume.activityLog.push({
        action: 'Public sharing link disabled',
        timestamp: new Date()
      });
    } else {
      resume.activityLog.push({
        action: 'Updated sharing configurations',
        timestamp: new Date()
      });
    }

    await resume.save();
    res.status(200).json({
      isShared: resume.sharing.isShared,
      shareId: resume.sharing.shareId,
      password: resume.sharing.password,
      expiresAt: resume.sharing.expiresAt,
      views: resume.sharing.views,
      downloads: resume.sharing.downloads,
      feedback: resume.sharing.feedback,
      shortlisted: resume.sharing.shortlisted
    });
  } catch (error) {
    console.error('Update Share Settings Error:', error);
    res.status(500).json({ message: 'Failed to update sharing settings' });
  }
};

// @desc    Get public portfolio data by username
export const getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ portfolioUsername: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const resume = await Resume.findOne({ user: user._id }).sort({ updatedAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'No resume published on this portfolio yet' });
    }

    res.status(200).json({
      name: user.name,
      careerField: user.careerField,
      portfolioTheme: user.portfolioTheme || 'modern',
      resumeData: resume.resumeData,
      email: user.email
    });
  } catch (error) {
    console.error('Get Public Portfolio Error:', error);
    res.status(500).json({ message: 'Server error loading portfolio' });
  }
};
