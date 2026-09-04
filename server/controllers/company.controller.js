import asyncHandler from 'express-async-handler';
import Company from '../models/Company.js';
import { ApiError } from '../utils/apiError.js';

const fields = ['name', 'description', 'website', 'logoUrl', 'industry', 'location'];
const pick = (source, keys) =>
  keys.reduce((acc, key) => {
    if (source[key] !== undefined) acc[key] = source[key];
    return acc;
  }, {});

// @route POST /api/companies (recruiter)
export const createCompany = asyncHandler(async (req, res) => {
  if (!req.body.name) throw new ApiError(400, 'Company name is required');

  const company = await Company.create({ ...pick(req.body, fields), recruiter: req.user._id });
  res.status(201).json({ success: true, company });
});

// @route GET /api/companies/mine (recruiter)
export const getMyCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({ recruiter: req.user._id }).sort('-createdAt');
  res.json({ success: true, companies });
});

// @route PUT /api/companies/:id (recruiter, owner only)
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found');
  if (String(company.recruiter) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only edit your own companies');
  }

  Object.assign(company, pick(req.body, fields));
  await company.save();
  res.json({ success: true, company });
});

// @route DELETE /api/companies/:id (recruiter, owner only)
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found');
  if (String(company.recruiter) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only delete your own companies');
  }

  await company.deleteOne();
  res.json({ success: true, message: 'Company deleted' });
});
