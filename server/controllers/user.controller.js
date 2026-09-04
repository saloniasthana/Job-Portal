import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { ApiError } from '../utils/apiError.js';
import { uploadBuffer } from '../services/upload.service.js';

// @route PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, headline, bio, skills, company } = req.body;

  if (name !== undefined) req.user.name = name;

  if (req.user.role === 'candidate') {
    if (headline !== undefined) req.user.headline = headline;
    if (bio !== undefined) req.user.bio = bio;
    if (skills !== undefined) req.user.skills = skills;
  }

  if (req.user.role === 'recruiter' && company !== undefined) {
    req.user.company = { ...req.user.company?.toObject?.(), ...company };
  }

  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @route POST /api/users/resume (candidate)
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  if (req.file.mimetype !== 'application/pdf') throw new ApiError(400, 'Resume must be a PDF');

  const { url } = await uploadBuffer(req.file.buffer, {
    folder: 'resumes',
    fileName: `${req.user._id}-${Date.now()}.pdf`,
  });

  req.user.resume = { url, fileName: req.file.originalname, uploadedAt: new Date() };
  await req.user.save();

  res.json({ success: true, resume: req.user.toSafeObject().resume });
});

// @route POST /api/users/saved-jobs/:jobId (candidate) — toggle save/unsave
export const toggleSavedJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new ApiError(404, 'Job not found');

  const idx = req.user.savedJobs.findIndex((id) => String(id) === req.params.jobId);
  let saved;
  if (idx >= 0) {
    req.user.savedJobs.splice(idx, 1);
    saved = false;
  } else {
    req.user.savedJobs.push(job._id);
    saved = true;
  }
  await req.user.save();

  res.json({ success: true, saved });
});

// @route GET /api/users/saved-jobs (candidate)
export const getSavedJobs = asyncHandler(async (req, res) => {
  await req.user.populate({
    path: 'savedJobs',
    populate: [
      { path: 'recruiter', select: 'name company' },
      { path: 'company', select: 'name logoUrl' },
    ],
  });
  res.json({ success: true, jobs: req.user.savedJobs });
});
