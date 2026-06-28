import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g., 'LOGIN', 'LOGOUT', 'RESUME_CREATE', 'RESUME_EDIT', 'AI_REQUEST', 'RESUME_DOWNLOAD'
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserActivity = mongoose.model('UserActivity', userActivitySchema);
export default UserActivity;
