import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'Resume Created', 
      'Resume Edited', 
      'PDF Downloaded', 
      'AI Used', 
      'Job Match Analyzed', 
      'Resume Duplicated',
      'Updated Portfolio Settings',
      'Job Application Tracked',
      'Application Status Updated',
      'Cover Letter Saved',
      'Goal Set',
      'Goal Completed'
    ],
  },
  details: {
    type: String,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
