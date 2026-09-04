import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    industry: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
