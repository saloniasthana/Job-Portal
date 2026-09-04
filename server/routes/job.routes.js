import express from 'express';
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobs,
  getJobById,
} from '../controllers/job.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/mine', protect, authorize('recruiter'), getMyJobs);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

// Public — browsing jobs doesn't require login
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;
