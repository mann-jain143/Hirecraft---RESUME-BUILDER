import dotenv from 'dotenv';
dotenv.config();

const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('API Key missing from backend .env file!');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Direct fetch failed.');
  return data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();
};

export const generateSummary = async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const prompt = `You are an expert resume writer. Write a single, highly professional resume summary paragraph for a ${jobTitle}. Keep it to exactly 3 sentences. Focus on value, strategic impact, and expertise. Return ONLY the final paragraph. Do NOT use markdown, bolding, or asterisks.`;
    const summary = await callGemini(prompt);
    res.status(200).json({ summary });
  } catch (error) {
    console.error('FINAL AI ERROR:', error);
    res.status(500).json({ message: `Direct API Error: ${error.message}` });
  }
};

export const generateBullets = async (req, res) => {
  try {
    const { notes, context } = req.body;
    if (!notes?.trim()) {
      return res.status(400).json({ message: 'Notes are required to generate bullet points.' });
    }

    const prompt = `You are an expert resume writer. The user wrote rough notes for their ${context || 'work experience'}. Transform these notes into exactly 3 professional resume bullet points. Each bullet must start with a strong action verb, include measurable impact where possible, and be concise (one line each). Return ONLY the 3 bullet points, one per line, starting with "• ". Do NOT use markdown or asterisks.

Rough notes:
${notes}`;

    const bullets = await callGemini(prompt);
    res.status(200).json({ bullets });
  } catch (error) {
    console.error('AI Bullets Error:', error);
    res.status(500).json({ message: `Direct API Error: ${error.message}` });
  }
};