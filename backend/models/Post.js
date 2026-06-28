import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['General', 'Interview Prep', 'Resume Review', 'Career Advice'], default: 'General' },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
