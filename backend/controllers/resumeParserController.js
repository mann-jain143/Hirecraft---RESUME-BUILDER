import dotenv from 'dotenv';
import mammoth from 'mammoth';
import { createRequire } from 'module';
import { callGemini } from '../utils/gemini.js';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
dotenv.config();

export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF or DOCX file' });
    }

    const { buffer, mimetype, originalname } = req.file;
    let extractedText = '';

    // Extract text based on file type
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file format. Please upload a PDF or DOCX file.' });
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ message: 'Could not extract enough text from the uploaded file.' });
    }

    // Send to Gemini to structure the data
    const prompt = `You are an expert resume parser. Parse the following resume text and extract all information into a structured JSON format.

RESUME TEXT:
${extractedText}

Return a valid JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "jobTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "summary": ""
  },
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": "",
      "bullets": [""]
    }
  ],
  "education": [
    {
      "degree": "",
      "fieldOfStudy": "",
      "institution": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "skills": [
    { "name": "", "level": "Intermediate" }
  ],
  "certifications": [
    { "name": "", "issuer": "", "date": "" }
  ],
  "projects": [
    { "name": "", "description": "", "technologies": "", "link": "" }
  ],
  "languages": [
    { "name": "", "proficiency": "Professional" }
  ]
}

Rules:
- Fill in as much information as possible from the resume text
- Use empty strings for fields you cannot determine
- Use empty arrays if a section has no data
- For dates, use formats like "Jan 2023" or "2023"
- For skills level, use: "Beginner", "Intermediate", "Advanced", or "Expert"
- For language proficiency, use: "Basic", "Conversational", "Professional", or "Native"
- Extract bullet points from experience descriptions where possible`;

    const rawResponse = await callGemini(prompt);

    // Parse AI response
    let resumeData;
    try {
      const cleanJson = rawResponse
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();
      resumeData = JSON.parse(cleanJson);
    } catch (parseError) {
      return res.status(500).json({
        message: 'Failed to structure the resume data. Please try again.',
        rawText: extractedText,
      });
    }

    return res.status(200).json({
      message: 'Resume parsed successfully',
      resumeData,
      rawText: extractedText,
    });
  } catch (error) {
    console.error('Resume Parser Error:', error);
    return res.status(500).json({ message: `Resume parsing failed: ${error.message}` });
  }
};
