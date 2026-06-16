import Resume from '../models/Resume.js';

const deriveTitle = (resumeData, fallback = 'Untitled Resume') => {
  const name = resumeData?.personalInfo?.fullName?.trim();
  const job = resumeData?.personalInfo?.jobTitle?.trim();
  if (name && job) return `${name} — ${job}`;
  if (name) return name;
  if (job) return job;
  return fallback;
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
// @route   POST /api/resumes
export const createResume = async (req, res) => {
  try {
    const { resumeData, title } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: 'resumeData is required' });
    }

    const resume = await Resume.create({
      user: req.user._id,
      title: title || deriveTitle(resumeData),
      resumeData,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Create Resume Error:', error);
    res.status(500).json({ message: 'Server Error while creating resume' });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
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
// @route   PUT /api/resumes/:id
export const updateResume = async (req, res) => {
  try {
    const { resumeData, title } = req.body;
    const { resume, error } = await assertOwnership(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    if (resumeData) resume.resumeData = resumeData;
    if (title) resume.title = title;
    else if (resumeData) resume.title = deriveTitle(resumeData, resume.title);

    const updated = await resume.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500).json({ message: 'Server Error while updating resume' });
  }
};

// @desc    Delete resume by ID
// @route   DELETE /api/resumes/:id
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
// @route   POST /api/resumes/:id/duplicate
export const duplicateResume = async (req, res) => {
  try {
    const { resume, error } = await assertOwnership(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const copy = await Resume.create({
      user: req.user._id,
      title: `${resume.title} (Copy)`,
      resumeData: JSON.parse(JSON.stringify(resume.resumeData)),
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
    let resume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    if (resume) {
      resume.resumeData = resumeData;
      resume.title = deriveTitle(resumeData, resume.title);
      const updated = await resume.save();
      return res.status(200).json(updated);
    }

    resume = await Resume.create({
      user: req.user._id,
      title: deriveTitle(resumeData),
      resumeData,
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
