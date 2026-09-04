import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null, index: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Data Science',
        'DevOps',
        'UI/UX Design',
        'Product Management',
        'QA / Testing',
        'Marketing',
        'Sales',
        'Other',
      ],
      default: 'Other',
    },

    location: { type: String, required: true, trim: true },
    workMode: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid'],
      default: 'onsite',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },

    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    currency: { type: String, default: 'INR' },

    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    views: { type: Number, default: 0 },
    applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

export default mongoose.model('Job', jobSchema);
