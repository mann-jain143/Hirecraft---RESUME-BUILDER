import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Applications', 'Interviews', 'Skills', 'Offers'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Failed'],
    default: 'In Progress'
  }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
