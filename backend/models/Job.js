import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    location: { type: String },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
    salaryRange: { type: String },
    status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
