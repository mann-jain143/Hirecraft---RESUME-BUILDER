import mongoose from 'mongoose';

const aiHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  promptType: {
    type: String,
    required: true,
    enum: ['Summary', 'Experience', 'Project', 'Skills', 'Review', 'Interview', 'General'],
  },
  promptText: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  createdAt: { type: Date, default: Date.now, expires: 2592000 } // TTL 30 days
}, { timestamps: true });

const AiHistory = mongoose.model('AiHistory', aiHistorySchema);
export default AiHistory;
