import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g., 'PROMOTE_USER', 'BAN_USER', 'DELETE_RESUME', 'RESTORE_RESUME'
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetResource: {
      type: String, // e.g., 'User', 'Resume', 'Portfolio'
    },
    targetResourceId: {
      type: String,
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

const AdminLog = mongoose.model('AdminLog', adminLogSchema);
export default AdminLog;
