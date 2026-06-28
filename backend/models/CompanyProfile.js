import mongoose from 'mongoose';

const companyProfileSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    industry: { type: String },
    website: { type: String },
    logo: { type: String },
    description: { type: String },
    location: { type: String },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);
export default CompanyProfile;
