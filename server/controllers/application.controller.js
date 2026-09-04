import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { ApiError } from '../utils/apiError.js';

// @route POST /api/applications (candidate)
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) throw new ApiError(400, 'jobId is required');

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (job.status !== 'open') throw new ApiError(400, 'This job is no longer accepting applications');

  if (!req.user.resume?.url) {
    throw new ApiError(400, 'Upload a resume to your profile before applying');
  }

  const existing = await Application.findOne({ candidate: req.user._id, job: jobId });
  if (existing) throw new ApiError(409, 'You already applied to this job');

  const application = await Application.create({
    candidate: req.user._id,
    job: jobId,
    resumeUrl: req.user.resume.url,
  });

  job.applicantCount += 1;
  await job.save();

  res.status(201).json({ success: true, application });
});

// @route GET /api/applications/mine (candidate)
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({
      path: 'job',
      select: 'title location workMode jobType salaryMin salaryMax currency status recruiter company',
      populate: [
        { path: 'recruiter', select: 'name company' },
        { path: 'company', select: 'name logoUrl' },
      ],
    })
    .sort('-createdAt');

  res.json({ success: true, applications });
});

// @route GET /api/applications/job/:jobId (recruiter, owner only)
export const getApplicationsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (String(job.recruiter) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only view applicants for your own job postings');
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('candidate', 'name email headline skills resume')
    .sort('-createdAt');

  res.json({ success: true, applications });
});
