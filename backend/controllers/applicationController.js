import Application from '../models/Application.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all applications for the logged-in user
// @route   GET /api/applications
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Get Applications Error:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
};

// @desc    Create a new application
// @route   POST /api/applications
export const createApplication = async (req, res) => {
  try {
    const { company, position, status, appliedDate, salary, location, notes, jobDescription, resumeId } = req.body;
    
    if (!company || !position) {
      return res.status(400).json({ message: 'Company and position are required' });
    }

    const application = await Application.create({
      user: req.user._id,
      company,
      position,
      status: status || 'Applied',
      appliedDate,
      salary,
      location,
      notes,
      jobDescription,
      resumeId
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Job Application Tracked',
      details: `${position} at ${company}`
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Create Application Error:', error);
    res.status(500).json({ message: 'Server error while creating application' });
  }
};

// @desc    Update an application
// @route   PUT /api/applications/:id
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const { company, position, status, appliedDate, salary, location, notes, jobDescription, resumeId } = req.body;

    if (company) application.company = company;
    if (position) application.position = position;
    if (status && status !== application.status) {
      application.status = status;
      await ActivityLog.create({
        user: req.user._id,
        action: 'Application Status Updated',
        details: `${application.position} at ${application.company} is now ${status}`
      });
    }
    if (appliedDate) application.appliedDate = appliedDate;
    if (salary !== undefined) application.salary = salary;
    if (location !== undefined) application.location = location;
    if (notes !== undefined) application.notes = notes;
    if (jobDescription !== undefined) application.jobDescription = jobDescription;
    if (resumeId !== undefined) application.resumeId = resumeId;

    const updatedApplication = await application.save();
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error('Update Application Error:', error);
    res.status(500).json({ message: 'Server error while updating application' });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete Application Error:', error);
    res.status(500).json({ message: 'Server error while deleting application' });
  }
};
