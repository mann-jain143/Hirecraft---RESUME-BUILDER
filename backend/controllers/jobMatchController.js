import dotenv from 'dotenv';
import AiHistory from '../models/AiHistory.js';
import ActivityLog from '../models/ActivityLog.js';
import { callGemini } from '../utils/gemini.js';
dotenv.config();

export const analyzeJobMatch = async (req, res) => {
  try {
    const { jobDescription, resumeData } = req.body;

    if (!jobDescription || !resumeData) {
      return res.status(400).json({ message: 'Job description and resume data are required' });
    }

    // Build a text summary of the resume for the AI
    const resumeSummary = buildResumeSummary(resumeData);

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze the following resume against the job description and return a detailed match analysis.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeSummary}

Return your analysis as a valid JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):
{
  "matchPercentage": <number between 0 and 100>,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "keywordBreakdown": [
    { "keyword": "keyword1", "found": true, "context": "Where it was found in the resume" },
    { "keyword": "keyword2", "found": false, "context": "Not found" }
  ],
  "overallAssessment": "A brief 2-3 sentence overall assessment"
}

Be thorough and accurate. Extract all relevant keywords from the job description.`;

    const rawResponse = await callGemini(prompt);

    // Parse the AI response into structured JSON
    let analysis;
    try {
      // Strip any markdown code fences if present
      const cleanJson = rawResponse
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();
      analysis = JSON.parse(cleanJson);
    } catch (parseError) {
      // Fallback: return a basic structure with the raw text
      analysis = {
        matchPercentage: 0,
        matchingSkills: [],
        missingSkills: [],
        recommendations: ['Unable to parse detailed analysis. Please try again.'],
        keywordBreakdown: [],
        overallAssessment: rawResponse,
      };
    }

    if (req.user) {
      await AiHistory.create({ user: req.user._id, promptType: 'General', promptText: prompt, response: JSON.stringify(analysis) });
      await ActivityLog.create({ user: req.user._id, action: 'Job Match Analyzed', details: `Match: ${analysis.matchPercentage}%` });
    }

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Job Match Error:', error);
    return res.status(500).json({ message: `Job match analysis failed: ${error.message}` });
  }
};

/**
 * Converts the structured resume data into a readable text summary for AI analysis.
 */
function buildResumeSummary(data) {
  const parts = [];

  if (data.personalInfo) {
    const p = data.personalInfo;
    parts.push(`NAME: ${p.firstName || ''} ${p.lastName || ''}`);
    if (p.jobTitle) parts.push(`TITLE: ${p.jobTitle}`);
    if (p.summary) parts.push(`SUMMARY: ${p.summary}`);
  }

  if (data.skills && data.skills.length > 0) {
    const skillNames = data.skills.map((s) => (typeof s === 'string' ? s : s.name || s.skill || '')).filter(Boolean);
    parts.push(`SKILLS: ${skillNames.join(', ')}`);
  }

  if (data.experience && data.experience.length > 0) {
    parts.push('EXPERIENCE:');
    data.experience.forEach((exp) => {
      const line = `- ${exp.jobTitle || exp.position || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || 'Present'})`;
      parts.push(line);
      if (exp.description) parts.push(`  ${exp.description}`);
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((b) => parts.push(`  • ${b}`));
      }
    });
  }

  if (data.education && data.education.length > 0) {
    parts.push('EDUCATION:');
    data.education.forEach((edu) => {
      parts.push(`- ${edu.degree || ''} in ${edu.fieldOfStudy || edu.field || ''} from ${edu.institution || edu.school || ''} (${edu.startDate || ''} - ${edu.endDate || ''})`);
    });
  }

  if (data.certifications && data.certifications.length > 0) {
    parts.push('CERTIFICATIONS:');
    data.certifications.forEach((cert) => {
      parts.push(`- ${cert.name || cert.title || ''} from ${cert.issuer || cert.organization || ''}`);
    });
  }

  if (data.projects && data.projects.length > 0) {
    parts.push('PROJECTS:');
    data.projects.forEach((proj) => {
      parts.push(`- ${proj.name || proj.title || ''}: ${proj.description || ''}`);
    });
  }

  return parts.join('\n');
}
