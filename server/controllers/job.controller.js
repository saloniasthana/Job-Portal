import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import { ApiError } from '../utils/apiError.js';

const jobFields = [
  'title',
  'description',
  'skills',
  'category',
  'company',
  'location',
  'workMode',
  'jobType',
  'salaryMin',
  'salaryMax',
  'currency',
  'status',
];

const pick = (source, keys) =>
  keys.reduce((acc, key) => {
    if (source[key] !== undefined) acc[key] = source[key];
    return acc;
  }, {});

const assertOwnsCompany = async (companyId, recruiterId) => {
  if (!companyId) return;
  const company = await Company.findById(companyId);
  if (!company) throw new ApiError(400, 'Selected company not found');
  if (String(company.recruiter) !== String(recruiterId)) {
    throw new ApiError(403, 'You can only post jobs under your own company');
  }
};

// @route POST /api/jobs (recruiter)
export const createJob = asyncHandler(async (req, res) => {
  const { title, description, location } = req.body;
  if (!title || !description || !location) {
    throw new ApiError(400, 'Title, description and location are required');
  }
  await assertOwnsCompany(req.body.company, req.user._id);

  const job = await Job.create({
    ...pick(req.body, jobFields),
    recruiter: req.user._id,
  });
  await job.populate('company', 'name logoUrl');

  res.status(201).json({ success: true, job });
});

// @route GET /api/jobs/mine (recruiter)
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id })
    .populate('recruiter', 'name company')
    .populate('company', 'name logoUrl')
    .sort('-createdAt');
  res.json({ success: true, jobs });
});

// @route PUT /api/jobs/:id (recruiter, owner only)
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  if (String(job.recruiter) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only edit your own job postings');
  }
  if (req.body.company !== undefined) await assertOwnsCompany(req.body.company, req.user._id);

  Object.assign(job, pick(req.body, jobFields));
  await job.save();
  await job.populate('company', 'name logoUrl');

  res.json({ success: true, job });
});

// @route DELETE /api/jobs/:id (recruiter, owner only)
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  if (String(job.recruiter) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only delete your own job postings');
  }

  await job.deleteOne();
  res.json({ success: true, message: 'Job posting deleted' });
});

// @route GET /api/jobs (public browse/search/filter — no login required)
export const getJobs = asyncHandler(async (req, res) => {
  const { search, location, jobType, workMode, category, minSalary, page = 1, limit = 12 } = req.query;

  const filter = { status: 'open' };
  if (search) filter.$text = { $search: search };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (jobType) filter.jobType = jobType;
  if (workMode) filter.workMode = workMode;
  if (category) filter.category = category;
  if (minSalary) filter.salaryMax = { $gte: Number(minSalary) };

  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('recruiter', 'name company')
      .populate('company', 'name logoUrl')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(filter),
  ]);

  res.json({
    success: true,
    jobs,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

// @route GET /api/jobs/:id (public — no login required)
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate('recruiter', 'name company')
    .populate('company', 'name logoUrl description website');
  if (!job) throw new ApiError(404, 'Job not found');

  res.json({ success: true, job });
});
