import mongoose from 'mongoose';

const organizationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, enum: ['team', 'college', 'enterprise'], default: 'team' },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    settings: {
      allowSharedTemplates: { type: Boolean, default: true },
      allowSharedAnalytics: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
