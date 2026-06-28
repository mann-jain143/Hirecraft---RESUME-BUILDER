import mongoose from 'mongoose';

const publicLinkSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    resumeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Resume' },
    linkId: { type: String, required: true, unique: true }, // e.g. abcd123
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const PublicLink = mongoose.model('PublicLink', publicLinkSchema);
export default PublicLink;
