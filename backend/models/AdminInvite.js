import mongoose from 'mongoose';

const adminInviteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['ADMIN'],
      default: 'ADMIN',
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const AdminInvite = mongoose.model('AdminInvite', adminInviteSchema);
export default AdminInvite;
