import { GoogleGenerativeAI } from '@google/generative-ai';

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

/**
 * Call Gemini with automatic model fallback.
 * @param {string} prompt - Text prompt (ignored if options.contents provided)
 * @param {{ contents?: object[] }} options
 */
export async function callGemini(prompt, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API Key missing from backend .env file! Add GEMINI_API_KEY from Google AI Studio.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError;

  for (const modelName of MODELS) {
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = options.contents
          ? await model.generateContent({ contents: options.contents })
          : await model.generateContent(prompt);

        const text = result?.response?.text?.();
        if (!text?.trim()) {
          throw new Error('Empty response from Gemini');
        }
        return text.replace(/\*/g, '').trim();
      } catch (err) {
        attempts++;
        const isTransient = err.message?.includes('503') || 
                            err.message?.includes('Service Unavailable') || 
                            err.message?.includes('overloaded') ||
                            err.message?.includes('experiencing high demand');
        
        if (isTransient && attempts < maxAttempts) {
          console.warn(`[Gemini] ${modelName} transient error (503/overloaded). Retrying attempt ${attempts}/${maxAttempts} in ${attempts}s...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        } else {
          lastError = err;
          console.warn(`[Gemini] ${modelName} failed:`, err.message);
          break; // Go to next model in fallback list
        }
      }
    }
  }

  throw new Error(lastError?.message || 'All Gemini models failed. Check your GEMINI_API_KEY.');
}

export function parseJsonFromAi(raw, fallback) {
  try {
    const clean = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(clean);
  } catch {
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}
