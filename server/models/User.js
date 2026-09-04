import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['candidate', 'recruiter'],
      required: true,
    },

    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpires: { type: Date, select: false },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    avatarUrl: { type: String, default: '' },

    // Candidate-only fields
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    resume: {
      url: { type: String, default: '' },
      fileName: { type: String, default: '' },
      text: { type: String, default: '', select: false },
      embedding: { type: [Number], default: undefined, select: false },
      uploadedAt: { type: Date },
    },

    // Recruiter-only fields
    company: {
      name: { type: String, default: '' },
      website: { type: String, default: '' },
      logoUrl: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.createVerificationToken = function createVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return rawToken;
};

userSchema.methods.createResetToken = function createResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1h
  return rawToken;
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isVerified: this.isVerified,
    avatarUrl: this.avatarUrl,
    headline: this.headline,
    bio: this.bio,
    skills: this.skills,
    savedJobs: this.savedJobs,
    resume: this.resume
      ? { url: this.resume.url, fileName: this.resume.fileName, uploadedAt: this.resume.uploadedAt }
      : undefined,
    company: this.company,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
