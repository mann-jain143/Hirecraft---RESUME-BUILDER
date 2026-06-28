import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Don't return the password by default when querying users
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    realRole: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    viewMode: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
    points: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    totalQuestionsSolved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
    lastChallengeCompletedDate: { type: String }, // YYYY-MM-DD
    badges: [{ type: String }],
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    careerField: {
      type: String,
      default: '',
    },
    portfolioUsername: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    portfolioTheme: {
      type: String,
      default: 'modern',
    },
    achievements: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    education: [
      {
        school: String,
        degree: String,
        startYear: String,
        endYear: String,
      }
    ],
    skills: {
      type: [String],
      default: [],
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
  }
);

// Hash the password automatically before saving to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create a method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;