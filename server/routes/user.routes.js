import express from 'express';
import {
  updateProfile,
  uploadResume,
  toggleSavedJob,
  getSavedJobs,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadResumeFile } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.post('/resume', authorize('candidate'), uploadResumeFile, uploadResume);
router.get('/saved-jobs', authorize('candidate'), getSavedJobs);
router.post('/saved-jobs/:jobId', authorize('candidate'), toggleSavedJob);

export default router;
