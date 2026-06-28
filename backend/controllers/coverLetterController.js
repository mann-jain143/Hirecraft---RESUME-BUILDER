import dotenv from 'dotenv';
import CoverLetter from '../models/CoverLetter.js';
import ActivityLog from '../models/ActivityLog.js';
import { callGemini } from '../utils/gemini.js';
dotenv.config();

export const generateCoverLetter = async (req, res) => {
  try {
    const { companyName, jobRole, experienceLevel, tone, jobDescription } = req.body;

    if (!companyName || !jobRole) {
      return res.status(400).json({ message: 'Company name and job role are required' });
    }

    const toneDescription = {
      Professional: 'highly professional, structured, and formal business tone',
      Friendly: 'warm, approachable, enthusiastic, and polite tone',
      Executive: 'highly strategic, authoritative, results-driven, and leadership-oriented tone',
      Creative: 'imaginative, unique, storytelling-focused, and highly engaging tone'
    }[tone] || 'formal business tone';

    const prompt = `You are an expert copywriter. Generate a high-impact cover letter using a ${toneDescription}.
    
    Candidate Details:
    - Target Job Title: ${jobRole}
    - Target Company Name: ${companyName}
    - Candidate Experience Level: ${experienceLevel || 'Mid Level'}
    
    ${jobDescription ? `Target Job Description to align with:\n"${jobDescription}"` : ''}

    Structure the cover letter to include:
    1. Salutation (e.g., Dear Hiring Team at ${companyName},)
    2. Introduction (expressing excitement and introducing value proposition)
    3. Body section (aligning skills and achievements directly with the role requirements)
    4. Conclusion (summarizing value, call to action for interview, and professional closing)

    Return ONLY the final cover letter text. Do NOT include markdown styling, asterisks, or extra conversational text.`;

    const content = await callGemini(prompt);

    if (req.user) {
      await ActivityLog.create({
        user: req.user._id,
        action: 'AI Used',
        details: 'Generated Cover Letter'
      });
    }

    res.status(200).json({ coverLetter: content });
  } catch (error) {
    console.error('Cover Letter Error:', error);
    res.status(500).json({ message: `Cover letter generation failed: ${error.message}` });
  }
};

// @desc    Get all cover letters
// @route   GET /api/cover-letters
export const getCoverLetters = async (req, res) => {
  try {
    const letters = await CoverLetter.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(letters);
  } catch (error) {
    console.error('Get Cover Letters Error:', error);
    res.status(500).json({ message: 'Server error while fetching cover letters' });
  }
};

// @desc    Save a cover letter
// @route   POST /api/cover-letters/save
export const saveCoverLetter = async (req, res) => {
  try {
    const { title, content, targetCompany, targetPosition, resumeId } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const letter = await CoverLetter.create({
      user: req.user._id,
      title: title || 'Untitled Cover Letter',
      content,
      targetCompany,
      targetPosition,
      resumeId
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Cover Letter Saved',
      details: title || 'Untitled Cover Letter'
    });

    res.status(201).json(letter);
  } catch (error) {
    console.error('Save Cover Letter Error:', error);
    res.status(500).json({ message: 'Server error while saving cover letter' });
  }
};

// @desc    Update a cover letter
// @route   PUT /api/cover-letters/:id
export const updateCoverLetter = async (req, res) => {
  try {
    const letter = await CoverLetter.findOne({ _id: req.params.id, user: req.user._id });
    if (!letter) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }

    const { title, content, targetCompany, targetPosition } = req.body;

    if (title) letter.title = title;
    if (content) letter.content = content;
    if (targetCompany !== undefined) letter.targetCompany = targetCompany;
    if (targetPosition !== undefined) letter.targetPosition = targetPosition;

    const updated = await letter.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update Cover Letter Error:', error);
    res.status(500).json({ message: 'Server error while updating cover letter' });
  }
};

// @desc    Delete a cover letter
// @route   DELETE /api/cover-letters/:id
export const deleteCoverLetter = async (req, res) => {
  try {
    const letter = await CoverLetter.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!letter) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }
    res.status(200).json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    console.error('Delete Cover Letter Error:', error);
    res.status(500).json({ message: 'Server error while deleting cover letter' });
  }
};
