import mongoose from 'mongoose';
import AiHistory from '../models/AiHistory.js';
import ActivityLog from '../models/ActivityLog.js';
import { logUserActivity } from './logger.js';

export async function logAiUsage({ userId, promptType, promptText, response, resumeId, details }) {
  try {
    const entry = { user: userId, promptType, promptText, response: String(response) };
    if (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
      entry.resumeId = resumeId;
    }
    await AiHistory.create(entry);
    
    // Log in UserActivity
    await logUserActivity(userId, 'AI_REQUEST', details || `AI Prompt Type: ${promptType}`);

    if (details) {
      await ActivityLog.create({
        user: userId,
        action: 'AI Used',
        details,
        resumeId: entry.resumeId,
      });
    }
  } catch (err) {
    console.warn('[AI Logger] Non-fatal save error:', err.message);
  }
}
