import express from 'express';
import { applyToJob, getMyApplications, getApplicationsForJob } from '../controllers/application.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, authorize('candidate'), applyToJob);
router.get('/mine', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getApplicationsForJob);

export default router;
